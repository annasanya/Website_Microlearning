// =============== GLOBAL STATE ===============
const state = {
    currentUser: null,
    currentView: 'login',
    teacherSubView: 'dashboard',
    studentSubView: 'dashboard', // 'dashboard', 'materi', 'nilai', 'sub-materi-detail'
    editingMateri: null,
    editingSubMateri: null,
    editingTest: null,
    selectedMateriForSub: null,
    currentTestType: null,
    testQuestions: [],
    currentStudentTest: null,
    studentAnswers: [],
    currentLkpdId: null,
    currentSubMateri: null,
    
    // ===== TAMBAHKAN INI UNTUK REKAP LKPD =====
    rekapTab: 'pretest', // Tab aktif di halaman rekap: 'pretest', 'posttest', atau 'lkpd'
    expandedMateriLkpd: [], // Menyimpan ID materi yang sedang terbuka dropdownnya
    expandedSubMateriLkpd: [] // Menyimpan ID sub materi yang sedang terbuka dropdownnya
};