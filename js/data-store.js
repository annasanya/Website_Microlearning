// =============== DATA MANAGEMENT ===============
class DataStore {
    constructor() {
        this.data = [];
        this.listeners = [];
        this.init();
    }

    init() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                this.data = JSON.parse(stored);
            } catch (e) {
                this.data = [...defaultData];
            }
        } else {
            this.data = [...defaultData];
            this.saveToStorage();
        }
    }

    saveToStorage() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
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
    getByType(type) { return this.data.filter(item => item.type === type); }
    getById(id) { return this.data.find(item => item.id === id); }
    
    // Fungsi baru untuk membersihkan data yang tidak memiliki relasi
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
}

const store = new DataStore();

// Helper functions
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
