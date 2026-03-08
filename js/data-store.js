// =============== DATA MANAGEMENT ===============
class DataStore {
    constructor() {
        this.data = [];
        this.listeners = [];
        this.init();
    }

    async init() {
        // Coba load dari Firebase
        if (window.firebaseInitialized && window.firebaseDatabase) {
            try {
                const snapshot = await window.firebaseDatabase.ref('microclass_data').once('value');
                const firebaseData = snapshot.val();
                if (firebaseData && Array.isArray(firebaseData)) {
                    this.data = firebaseData;
                    console.log('📦 Data dimuat dari Firebase');
                } else {
                    this.loadFromLocalStorage();
                }
            } catch (e) {
                console.warn('Gagal load dari Firebase, pakai localStorage', e);
                this.loadFromLocalStorage();
            }
        } else {
            this.loadFromLocalStorage();
        }
        
        // TUNGGU migrasi selesai sebelum notify
        await this.migrateTestsToMCQ(); // Tambahkan AWAIT
        await this.migrateLkpdSubmissionsToObject();
        
        this.notify();
    }

    loadFromLocalStorage() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                this.data = JSON.parse(stored);
                console.log('💾 Data dimuat dari localStorage');
            } catch (e) {
                this.data = [];
            }
        } else {
            this.data = [];
        }
    }

    async saveToStorage() {
        // Simpan ke localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
        
        // Simpan ke Firebase
        if (window.firebaseInitialized && window.firebaseDatabase) {
            try {
                await window.firebaseDatabase.ref('microclass_data').set(this.data);
                console.log('☁️ Data disinkronkan ke Firebase');
            } catch (e) {
                console.warn('Gagal sync ke Firebase', e);
            }
        }
    }

    // Fungsi migrasi yang SUDAH DIPERBAIKI
    async migrateTestsToMCQ() {
        const tests = this.getByType('test');
        let migrated = false;
        
        for (const test of tests) { // Gunakan for...of karena async
            const questions = parseJSON(test.questions);
            
            // Cek apakah masih format lama (boolean)
            if (questions.length > 0 && typeof questions[0].answer === 'boolean') {
                console.log('🔄 Migrating test:', test.id);
                
                const newQuestions = questions.map(q => ({
                    question: q.question,
                    options: ['', '', '', '', ''], // Opsi kosong
                    answer: q.answer ? 'A' : 'B' // true → A, false → B
                }));
                
                // Update test
                await this.update(test.id, { // TAMBAHKAN AWAIT
                    questions: JSON.stringify(newQuestions)
                });
                
                migrated = true;
            }
        }
        
        if (migrated) {
            console.log('✅ Test migration completed');
            // PAKAI CARA AMAN UNTUK TOAST
            setTimeout(() => {
                if (typeof window.showToast === 'function') {
                    window.showToast('Data test berhasil dimigrasi ke format pilihan ganda', 'success');
                }
            }, 100);
        }
        
        return migrated;
    }

    // Di dalam class DataStore, tambahkan fungsi ini
    async migrateLkpdSubmissionsToObject() {
        console.log('🔄 Migrasi data LKPD submissions...');
        const progresses = this.getByType('progress');
        let migrated = false;
        
        for (const progress of progresses) {
            if (progress.lkpdSubmissions) {
                try {
                    const parsed = JSON.parse(progress.lkpdSubmissions);
                    // Jika masih array, konversi ke object
                    if (Array.isArray(parsed)) {
                        console.log(`⚠️ Progress ${progress.id} masih array, konversi ke object`);
                        
                        // Buat object kosong
                        const newSubmissions = {};
                        
                        // Update ke database
                        await this.update(progress.id, {
                            lkpdSubmissions: JSON.stringify(newSubmissions)
                        });
                        
                        migrated = true;
                    }
                } catch (e) {
                    console.error('Error parsing:', e);
                }
            }
        }
        
        if (migrated) {
            console.log('✅ Migrasi LKPD submissions selesai');
        }
        
        return migrated;
    }

    subscribe(listener) {
        this.listeners.push(listener);
        listener(this.data);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notify() {
        this.saveToStorage();
        this.listeners.forEach(listener => listener(this.data));
    }

    create(item) {
        const newItem = {
            ...item,
            id: generateId(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        this.data.push(newItem);
        this.notify();
        return newItem;
    }

    async update(id, updates) { // TAMBAHKAN async
        const index = this.data.findIndex(item => item.id === id);
        if (index !== -1) {
            this.data[index] = { 
                ...this.data[index], 
                ...updates, 
                updatedAt: new Date().toISOString() 
            };
            await this.notify(); // TAMBAHKAN await
            return this.data[index];
        }
        return null;
    }

    async delete(id) { // TAMBAHKAN async
        this.data = this.data.filter(item => item.id !== id);
        await this.notify(); // TAMBAHKAN await
    }

    getAll() { return this.data; }
    getByType(type) { return this.data.filter(item => item.type === type); }
    getById(id) { return this.data.find(item => item.id === id); }
    
    async cleanOrphanData() { // TAMBAHKAN async
        const materiIds = this.getByType('materi').map(m => m.id);
        
        const subs = this.getByType('submateri');
        for (const sub of subs) {
            if (!materiIds.includes(sub.materiId)) {
                await this.delete(sub.id);
            }
        }
        
        const studentIds = this.getByType('student').map(s => s.id);
        const progresses = this.getByType('progress');
        for (const progress of progresses) {
            if (!studentIds.includes(progress.studentId)) {
                await this.delete(progress.id);
                continue;
            }
            
            if (progress.completedSubMateri) {
                const completedSubs = parseJSON(progress.completedSubMateri);
                const validSubIds = this.getByType('submateri').map(s => s.id);
                const filteredSubs = completedSubs.filter(subId => validSubIds.includes(subId));
                if (completedSubs.length !== filteredSubs.length) {
                    await this.update(progress.id, {
                        completedSubMateri: JSON.stringify(filteredSubs)
                    });
                }
            }
            
            if (progress.completedLkpd) {
                const completedLkpd = parseJSON(progress.completedLkpd);
                const validSubIds = this.getByType('submateri').map(s => s.id);
                const filteredLkpd = completedLkpd.filter(subId => validSubIds.includes(subId));
                if (completedLkpd.length !== filteredLkpd.length) {
                    await this.update(progress.id, {
                        completedLkpd: JSON.stringify(filteredLkpd)
                    });
                }
            }
        }
    }
}

const store = new DataStore();

function getStudents() { return store.getByType('student'); }
function getMateri() { return store.getByType('materi'); }
function getSubMateri(materiId = null) {
    const subs = store.getByType('submateri');
    const materiIds = getMateri().map(m => m.id);
    const validSubs = subs.filter(sub => materiIds.includes(sub.materiId));
    return materiId ? validSubs.filter(s => s.materiId === materiId) : validSubs;
}
function getTests() { return store.getByType('test'); }
function getProgress(studentId) {
    return store.getByType('progress').find(p => p.studentId === studentId);
}