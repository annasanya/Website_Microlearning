// =============== FIREBASE + LOCALSTORAGE DATA MANAGEMENT ===============

// Inisialisasi Firebase (pastikan firebase-config.js sudah dipanggil sebelumnya)
let firebaseAvailable = false;
let database = null;

// Cek apakah Firebase tersedia
if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length > 0) {
    try {
        database = firebase.database();
        firebaseAvailable = true;
        console.log('🔥 Firebase Realtime Database siap digunakan');
    } catch (e) {
        console.warn('Firebase database tidak tersedia:', e);
    }
}

class DataStore {
    constructor() {
        this.data = [];
        this.listeners = [];
        this.init();
    }

    async init() {
        // Coba load dari Firebase dulu
        if (firebaseAvailable && database) {
            try {
                const snapshot = await database.ref('microclass_data').once('value');
                const firebaseData = snapshot.val();
                
                if (firebaseData && Array.isArray(firebaseData)) {
                    this.data = firebaseData;
                    console.log('☁️ Data dimuat dari Firebase:', this.data.length, 'item');
                } else if (firebaseData && typeof firebaseData === 'object') {
                    // Kalau data di Firebase berbentuk object (biasanya kalo pake push())
                    this.data = Object.keys(firebaseData).map(key => ({
                        ...firebaseData[key],
                        firebaseKey: key
                    }));
                    console.log('☁️ Data dimuat dari Firebase (format object):', this.data.length, 'item');
                } else {
                    console.log('Data Firebase kosong, coba localStorage...');
                    this.loadFromLocalStorage();
                }
            } catch (e) {
                console.warn('⚠️ Gagal load dari Firebase:', e.message);
                this.loadFromLocalStorage();
            }
        } else {
            console.log('Firebase tidak tersedia, pakai localStorage');
            this.loadFromLocalStorage();
        }
        
        // Simpan ke localStorage sebagai backup
        this.saveToLocalStorage();
        this.notify();
    }

    loadFromLocalStorage() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                this.data = JSON.parse(stored);
                console.log('💾 Data dimuat dari localStorage:', this.data.length, 'item');
            } else {
                this.data = [];
                console.log('LocalStorage kosong');
            }
        } catch (e) {
            console.error('Error load dari localStorage:', e);
            this.data = [];
        }
    }

    saveToLocalStorage() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
        } catch (e) {
            console.error('Error save ke localStorage:', e);
        }
    }

    async syncToFirebase() {
        if (!firebaseAvailable || !database) return false;
        
        try {
            // Simpan ke Firebase dengan struktur array
            await database.ref('microclass_data').set(this.data);
            console.log('☁️ Data disinkronkan ke Firebase');
            return true;
        } catch (e) {
            console.warn('⚠️ Gagal sync ke Firebase:', e.message);
            return false;
        }
    }

    subscribe(listener) {
        this.listeners.push(listener);
        // Panggil listener dengan data yang ada
        setTimeout(() => listener(this.data), 0);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notify() {
        // Simpan ke localStorage
        this.saveToLocalStorage();
        
        // Sync ke Firebase (async, tidak perlu ditunggu)
        this.syncToFirebase();
        
        // Panggil semua listeners
        this.listeners.forEach(listener => listener(this.data));
    }

    create(item) {
        const now = new Date().toISOString();
        const newItem = {
            ...item,
            id: generateId(),
            createdAt: now,
            updatedAt: now
        };
        this.data.push(newItem);
        this.notify();
        return newItem;
    }

    update(id, updates) {
        const index = this.data.findIndex(item => item.id === id);
        if (index !== -1) {
            this.data[index] = { 
                ...this.data[index], 
                ...updates, 
                updatedAt: new Date().toISOString() 
            };
            this.notify();
            return this.data[index];
        }
        return null;
    }

    delete(id) {
        this.data = this.data.filter(item => item.id !== id);
        this.notify();
    }

    getAll() { return this.data; }
    
    getByType(type) { 
        return this.data.filter(item => item.type === type); 
    }
    
    getById(id) { 
        return this.data.find(item => item.id === id); 
    }
    
    // Fungsi untuk membersihkan data orphan
    cleanOrphanData() {
        const materiIds = this.getByType('materi').map(m => m.id);
        
        // Hapus sub materi yang tidak memiliki materi induk
        const subs = this.getByType('submateri');
        subs.forEach(sub => {
            if (!materiIds.includes(sub.materiId)) {
                this.delete(sub.id);
            }
        });
        
        // Hapus progress yang tidak memiliki siswa
        const studentIds = this.getByType('student').map(s => s.id);
        const progresses = this.getByType('progress');
        progresses.forEach(progress => {
            if (!studentIds.includes(progress.studentId)) {
                this.delete(progress.id);
            }
        });
        
        // Bersihkan completedSubMateri dari progress yang merujuk ke sub materi yang sudah tidak ada
        const validSubIds = this.getByType('submateri').map(s => s.id);
        progresses.forEach(progress => {
            if (progress.completedSubMateri) {
                const completedSubs = parseJSON(progress.completedSubMateri);
                const filteredSubs = completedSubs.filter(subId => validSubIds.includes(subId));
                if (completedSubs.length !== filteredSubs.length) {
                    this.update(progress.id, {
                        completedSubMateri: JSON.stringify(filteredSubs)
                    });
                }
            }
            
            if (progress.completedLkpd) {
                const completedLkpd = parseJSON(progress.completedLkpd);
                const filteredLkpd = completedLkpd.filter(subId => validSubIds.includes(subId));
                if (completedLkpd.length !== filteredLkpd.length) {
                    this.update(progress.id, {
                        completedLkpd: JSON.stringify(filteredLkpd)
                    });
                }
            }
        });
    }

    // Fungsi untuk reset semua data (hati-hati!)
    async resetAllData() {
        this.data = [];
        this.saveToLocalStorage();
        if (firebaseAvailable && database) {
            try {
                await database.ref('microclass_data').set([]);
                console.log('Semua data direset di Firebase');
            } catch (e) {
                console.error('Gagal reset Firebase:', e);
            }
        }
        this.notify();
    }
}

// Buat instance global
const store = new DataStore();

// Helper functions (tetap sama, tapi bisa dipanggil async kalau perlu)
function getStudents() { 
    return store.getByType('student'); 
}

function getMateri() { 
    return store.getByType('materi'); 
}

function getSubMateri(materiId = null) {
    const subs = store.getByType('submateri');
    const materiIds = getMateri().map(m => m.id);
    
    // Hanya kembalikan sub materi yang memiliki materi induk yang valid
    const validSubs = subs.filter(sub => materiIds.includes(sub.materiId));
    
    return materiId ? validSubs.filter(s => s.materiId === materiId) : validSubs;
}

function getTests() { 
    return store.getByType('test'); 
}

function getProgress(studentId) {
    return store.getByType('progress').find(p => p.studentId === studentId);
}

// Fungsi untuk ngecek status koneksi Firebase
function isFirebaseConnected() {
    return firebaseAvailable && database;
}

// Export untuk digunakan di file lain
window.store = store;
window.isFirebaseConnected = isFirebaseConnected;
