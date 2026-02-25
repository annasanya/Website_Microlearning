// =============== GLOBAL STATE ===============
const state = {
    currentUser: null,
    currentView: 'login',
    teacherSubView: 'dashboard',
    studentSubView: 'dashboard',
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
    
    // TAMBAHKAN INI - untuk menyimpan link LKPD sementara
    lkpdLinks: {} // format: { subMateriId: "https://drive.google.com/..." }
};