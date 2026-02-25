// =============== STUDENT DASHBOARD ===============

// Di awal setiap file component, pastikan fungsi didefinisikan secara global
window.renderTeacherDashboard = renderTeacherDashboard;
window.renderStudentDashboard = renderStudentDashboard;
//window.renderTestManager = renderTestManager;
window.renderMateriManager = renderMateriManager;
window.renderRekapNilai = renderRekapNilai;
//window.renderStudentMateri = renderStudentMateri;
//window.renderStudentNilai = renderStudentNilai;
//window.renderLogin = renderLogin;
window.exportPretestToExcel = exportPretestToExcel;
window.exportPosttestToExcel = exportPosttestToExcel;

function renderStudentDashboard() {
    const progress = getProgress(state.currentUser.id);
    const materi = getMateri();
    const subMateri = getSubMateri();
    const tests = getTests();
    const pretest = tests.find(t => t.testType === 'pretest');
    const posttest = tests.find(t => t.testType === 'posttest');
    const completedSubs = progress ? parseJSON(progress.completedSubMateri) : [];
    const completedLkpd = progress ? parseJSON(progress.completedLkpd) : [];

    return `
        <div class="flex h-full">
            <!-- Sidebar Desktop -->
            <div class="w-64 bg-gradient-to-b from-emerald-600 to-teal-700 text-white flex-shrink-0 hidden md:flex flex-col">
                <div class="p-6 border-b border-white/20">
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-12.5c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5z"/>
                            </svg>
                        </div>
                        <div>
                            <h2 class="font-bold">${state.currentUser.name}</h2>
                            <p class="text-sm text-white/70">Kelas ${state.currentUser.kelas}</p>
                        </div>
                    </div>
                </div>
                <nav class="flex-1 p-4 space-y-2">
                    ${renderStudentSidebar()}
                </nav>
                <div class="p-4 border-t border-white/20">
                    <button id="logoutStudent" class="w-full py-2 bg-white/20 rounded-xl hover:bg-white/30 transition-all">🚪 Keluar</button>
                </div>
            </div>

            <!-- Mobile Header -->
            <div class="md:hidden fixed top-0 left-0 right-0 bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 z-40">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-12.5c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5z"/>
                        </svg>
                        <span class="font-bold">${state.currentUser.name}</span>
                    </div>
                    <button id="mobileMenuToggleS" class="p-2 hover:bg-white/20 rounded-lg">☰</button>
                </div>
            </div>

            <!-- Mobile Menu -->
            <div id="mobileMenuS" class="hidden md:hidden fixed inset-0 bg-black/50 z-50">
                <div class="w-64 h-full bg-gradient-to-b from-emerald-600 to-teal-700 text-white p-4">
                    <button id="closeMobileMenuS" class="mb-4 p-2 hover:bg-white/20 rounded-lg">✕</button>
                    <nav class="space-y-2">
                        ${renderStudentSidebar()}
                        <button id="logoutStudentMobile" class="w-full py-2 mt-4 bg-white/20 rounded-xl">🚪 Keluar</button>
                    </nav>
                </div>
            </div>

            <!-- Main Content -->
            <div class="flex-1 overflow-auto md:pt-0 pt-16">
                <div class="p-4 md:p-8">
                    ${renderStudentContent()}
                </div>
            </div>
        </div>

        <!-- LKPD Modal -->
        <div id="lkpdModal" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-auto">
            <div class="bg-white rounded-2xl w-full max-w-2xl p-6 my-8 max-h-[70vh] overflow-y-auto">
                <h3 class="text-xl font-bold mb-4">📋 Tugas LKPD</h3>
                <div id="lkpdContent" class="mb-6 break-words text-break"></div>
                <div class="flex gap-3">
                    <button id="closeLkpd" class="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all">Tutup</button>
                    <button id="markLkpdDone" class="flex-1 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all">✓ Tandai Selesai</button>
                </div>
            </div>
        </div>

        <!-- Test Modal -->
        <div id="testModal" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-auto">
            <div class="bg-white rounded-2xl w-full max-w-2xl p-6 my-8 max-h-[90vh] overflow-y-auto">
                <div class="flex items-center justify-between mb-6 sticky top-0 bg-white pb-4 border-b">
                    <h3 class="text-xl font-bold" id="testModalTitle">Soal</h3>
                    <span class="text-sm text-gray-500 font-semibold" id="testProgress">1/1</span>
                </div>
                <div id="testQuestions" class="space-y-6"></div>
                <button id="submitTest" class="w-full mt-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all sticky bottom-0">
                    ✓ Kirim Jawaban
                </button>
            </div>
        </div>
    `;
}

function renderStudentSidebar() {
    const views = [
        { id: 'dashboard', icon: '📊', label: 'Dashboard' },
        { id: 'materi', icon: '📚', label: 'Materi & Tugas' },
        { id: 'nilai', icon: '📈', label: 'Rekap Nilai' }
    ];
    return views.map(v => `
        <button data-sview="${v.id}" 
            class="sidebar-item w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 
            ${state.studentSubView === v.id ? 'active' : ''}">
            ${v.icon} ${v.label}
        </button>
    `).join('');
}

// Di dalam renderStudentContent() function
function renderStudentContent() {
    const progress = getProgress(state.currentUser.id);
    const materi = getMateri();
    const subMateri = getSubMateri();
    const tests = getTests();
    const pretest = tests.find(t => t.testType === 'pretest');
    const posttest = tests.find(t => t.testType === 'posttest');
    const completedSubs = progress ? parseJSON(progress.completedSubMateri) : [];
    const completedLkpd = progress ? parseJSON(progress.completedLkpd) : [];

    switch(state.studentSubView) {
        case 'dashboard':
            return renderStudentHome(progress, subMateri, pretest, posttest, completedSubs, completedLkpd);
        case 'materi':
            return renderStudentMateri(materi, subMateri, progress, pretest, posttest, completedSubs, completedLkpd);
        case 'sub-materi-detail':
            return renderSubMateriDetail();
        case 'nilai':
            return renderStudentNilai(progress, pretest, posttest);
        default:
            return renderStudentHome(progress, subMateri, pretest, posttest, completedSubs, completedLkpd);
    }
}

function renderStudentHome(progress, subMateri, pretest, posttest, completedSubs, completedLkpd) {
    const totalTasks = (pretest ? 1 : 0) + subMateri.length + (posttest ? 1 : 0);
    const completedTasks = (progress?.pretestDone ? 1 : 0) + completedSubs.length + (progress?.posttestDone ? 1 : 0);
    const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return `
        <div class="animate-fade">
            <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Selamat Datang, ${state.currentUser.name}! 👋</h1>
            
            <div class="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white mb-6">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 class="text-xl font-bold mb-2">Progres Pembelajaran</h2>
                        <p class="text-white/80">Kelas ${state.currentUser.kelas} - ${state.currentUser.sekolah}</p>
                    </div>
                    <div class="text-center">
                        <div class="text-4xl font-bold">${progressPercent}%</div>
                        <p class="text-white/80">${completedTasks}/${totalTasks} tugas</p>
                    </div>
                </div>
                <div class="mt-4 bg-white/20 rounded-full h-3">
                    <div class="bg-white h-3 rounded-full progress-bar" style="width: ${progressPercent}%"></div>
                </div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="bg-white rounded-2xl p-4 card-shadow text-center">
                    <div class="text-3xl mb-2">${progress?.pretestDone ? '✅' : '⏳'}</div>
                    <div class="font-bold text-gray-800">Pretest</div>
                    <div class="text-sm text-gray-500">${progress?.pretestDone ? 'Selesai' : 'Belum'}</div>
                </div>
                <div class="bg-white rounded-2xl p-4 card-shadow text-center">
                    <div class="text-3xl mb-2">📚</div>
                    <div class="font-bold text-gray-800">${completedSubs.length}/${subMateri.length}</div>
                    <div class="text-sm text-gray-500">Sub Materi</div>
                </div>
                <div class="bg-white rounded-2xl p-4 card-shadow text-center">
                    <div class="text-3xl mb-2">📋</div>
                    <div class="font-bold text-gray-800">${completedLkpd.length}</div>
                    <div class="text-sm text-gray-500">LKPD Selesai</div>
                </div>
                <div class="bg-white rounded-2xl p-4 card-shadow text-center">
                    <div class="text-3xl mb-2">${progress?.posttestDone ? '✅' : '🔒'}</div>
                    <div class="font-bold text-gray-800">Posttest</div>
                    <div class="text-sm text-gray-500">${progress?.posttestDone ? 'Selesai' : 'Terkunci'}</div>
                </div>
            </div>
        </div>
    `;
}

