// =============== TEACHER DASHBOARD ===============
// Di awal setiap file component, pastikan fungsi didefinisikan secara global
window.renderTeacherDashboard = renderTeacherDashboard;
//window.renderStudentDashboard = renderStudentDashboard;
//window.renderTestManager = renderTestManager;
window.renderMateriManager = renderMateriManager;
window.renderRekapNilai = renderRekapNilai;
//window.renderStudentMateri = renderStudentMateri;
//window.renderStudentNilai = renderStudentNilai;
//window.renderLogin = renderLogin;
window.exportPretestToExcel = exportPretestToExcel;
window.exportPosttestToExcel = exportPosttestToExcel;

function renderTeacherDashboard() {
    const students = getStudents();
    const materi = getMateri();
    const subMateri = getSubMateri();
    const tests = getTests();
    const pretest = tests.find(t => t.testType === 'pretest');
    const posttest = tests.find(t => t.testType === 'posttest');

    return `
        <div class="flex h-full">
            <!-- Sidebar Desktop -->
            <div class="w-64 gradient-bg text-white flex-shrink-0 hidden md:flex flex-col">
                <div class="p-6 border-b border-white/20">
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-12.5c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5z"/>
                            </svg>
                        </div>
                        <div>
                            <h2 class="font-bold">${state.currentUser?.name || 'Guru'}</h2>
                            <p class="text-sm text-white/70">Guru</p>
                        </div>
                    </div>
                </div>
                <nav class="flex-1 p-4 space-y-2">
                    ${renderTeacherSidebar()}
                </nav>
                <div class="p-4 border-t border-white/20">
                    <button id="logoutTeacher" class="w-full py-2 bg-white/20 rounded-xl hover:bg-white/30 transition-all">🚪 Keluar</button>
                </div>
            </div>

            <!-- Mobile Header -->
            <div class="md:hidden fixed top-0 left-0 right-0 gradient-bg text-white p-4 z-40">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-12.5c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5z"/>
                        </svg>
                        <span class="font-bold">${state.currentUser?.name || 'Guru'}</span>
                    </div>
                    <button id="mobileMenuToggle" class="p-2 hover:bg-white/20 rounded-lg">☰</button>
                </div>
            </div>

            <!-- Mobile Menu -->
            <div id="mobileMenu" class="hidden md:hidden fixed inset-0 bg-black/50 z-50">
                <div class="w-64 h-full gradient-bg text-white p-4">
                    <button id="closeMobileMenu" class="mb-4 p-2 hover:bg-white/20 rounded-lg">✕</button>
                    <nav class="space-y-2">
                        ${renderTeacherSidebar()}
                        <button id="logoutTeacherMobile" class="w-full py-2 mt-4 bg-white/20 rounded-xl">🚪 Keluar</button>
                    </nav>
                </div>
            </div>

            <!-- Main Content -->
            <div class="flex-1 overflow-auto md:pt-0 pt-16">
                <div class="p-4 md:p-8">
                    ${renderTeacherContent()}
                </div>
            </div>
        </div>
    `;
}

function renderTeacherSidebar() {
    const views = [
        { id: 'dashboard', icon: '📊', label: 'Dashboard' },
        { id: 'materi', icon: '📚', label: 'Kelola Materi' },
        { id: 'tests', icon: '✏️', label: 'Pretest & Posttest' },
        { id: 'rekap', icon: '📈', label: 'Rekap Nilai' }
    ];
    return views.map(v => `
        <button data-view="${v.id}" 
            class="sidebar-item w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 
            ${state.teacherSubView === v.id ? 'active' : ''}">
            ${v.icon} ${v.label}
        </button>
    `).join('');
}

function renderTeacherContent() {
    const students = getStudents();
    const materi = getMateri();
    const subMateri = getSubMateri();
    const tests = getTests();
    const pretest = tests.find(t => t.testType === 'pretest');
    const posttest = tests.find(t => t.testType === 'posttest');

    switch(state.teacherSubView) {
        case 'dashboard':
            return renderTeacherHome(students, materi, subMateri, tests);
        case 'materi':
            return renderMateriManager(materi, subMateri);
        case 'tests':
            return renderTestManager(pretest, posttest);
        case 'rekap':
            return renderRekapNilai(students, pretest, posttest);
        default:
            return renderTeacherHome(students, materi, subMateri, tests);
    }
}

function renderTeacherHome(students, materi, subMateri, tests) {
    // Hanya hitung sub materi yang masih memiliki materi induk yang valid
    const validSubMateri = subMateri.filter(sub => {
        const parentMateri = materi.find(m => m.id === sub.materiId);
        return parentMateri !== undefined;
    });
    
    // Hitung video dari sub materi yang valid
    const totalVideos = validSubMateri.filter(s => s.videoUrl && s.videoUrl.trim() !== '').length;
    
    // Hitung LKPD dari sub materi yang valid
    const totalLkpd = validSubMateri.filter(s => s.lkpdTitle && s.lkpdTitle.trim() !== '').length;

    return `
        <div class="animate-fade">
            <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Dashboard Guru</h1>
            <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                <div class="bg-white rounded-2xl p-4 card-shadow">
                    <div class="text-3xl mb-2">📚</div>
                    <div class="text-2xl font-bold text-purple-600">${materi.length}</div>
                    <div class="text-sm text-gray-500">Materi</div>
                </div>
                <div class="bg-white rounded-2xl p-4 card-shadow">
                    <div class="text-3xl mb-2">📖</div>
                    <div class="text-2xl font-bold text-indigo-600">${validSubMateri.length}</div>
                    <div class="text-sm text-gray-500">Sub Materi</div>
                </div>
                <div class="bg-white rounded-2xl p-4 card-shadow">
                    <div class="text-3xl mb-2">🎬</div>
                    <div class="text-2xl font-bold text-blue-600">${totalVideos}</div>
                    <div class="text-sm text-gray-500">Video</div>
                </div>
                <div class="bg-white rounded-2xl p-4 card-shadow">
                    <div class="text-3xl mb-2">📋</div>
                    <div class="text-2xl font-bold text-green-600">${totalLkpd}</div>
                    <div class="text-sm text-gray-500">LKPD</div>
                </div>
                <div class="bg-white rounded-2xl p-4 card-shadow col-span-2 md:col-span-1">
                    <div class="text-3xl mb-2">✏️</div>
                    <div class="text-2xl font-bold text-orange-600">${tests.length}</div>
                    <div class="text-sm text-gray-500">Tes</div>
                </div>
            </div>

            <!-- Status Pengerjaan Siswa -->
            <div class="bg-white rounded-2xl card-shadow p-6">
                <div class="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                    <h2 class="text-xl font-bold text-gray-800">📊 Status Pengerjaan Siswa</h2>
                    <div class="flex gap-2">
                        <button id="refreshStudents" class="px-4 py-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-all text-sm font-medium">🔄 Refresh</button>
                        <button id="deleteAllStudents" class="px-4 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all text-sm font-medium">🗑️ Hapus Semua</button>
                    </div>
                </div>
                
                ${students.length === 0 ? `
                    <div class="text-center py-12 text-gray-400">
                        <div class="text-5xl mb-4">👨‍🎓</div>
                        <p>Belum ada siswa yang terdaftar</p>
                    </div>
                ` : `
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead>
                                <tr class="bg-gray-50">
                                    <th class="text-left py-3 px-4 font-semibold text-gray-600">Nama</th>
                                    <th class="text-left py-3 px-4 font-semibold text-gray-600">Kelas</th>
                                    <th class="text-left py-3 px-4 font-semibold text-gray-600">Sekolah</th>
                                    <th class="text-left py-3 px-4 font-semibold text-gray-600">Progres</th>
                                    <th class="text-left py-3 px-4 font-semibold text-gray-600">Pretest</th>
                                    <th class="text-left py-3 px-4 font-semibold text-gray-600">Posttest</th>
                                    <th class="text-center py-3 px-4 font-semibold text-gray-600">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${students.map(s => {
                                    const progress = getProgress(s.id);
                                    const completedSubs = progress ? parseJSON(progress.completedSubMateri).filter(subId => {
                                        // Hanya hitung sub materi yang masih valid
                                        const sub = store.getById(subId);
                                        return sub && materi.some(m => m.id === sub.materiId);
                                    }).length : 0;
                                    const totalSubs = validSubMateri.length;
                                    return `
                                        <tr class="border-b border-gray-100 hover:bg-gray-50">
                                            <td class="py-3 px-4 font-medium">${s.name}</td>
                                            <td class="py-3 px-4">${s.kelas}</td>
                                            <td class="py-3 px-4">${s.sekolah}</td>
                                            <td class="py-3 px-4">
                                                <div class="flex items-center gap-2">
                                                    <div class="w-20 bg-gray-200 rounded-full h-2">
                                                        <div class="bg-green-500 h-2 rounded-full progress-bar" style="width: ${totalSubs > 0 ? (completedSubs/totalSubs)*100 : 0}%"></div>
                                                    </div>
                                                    <span class="text-sm text-gray-600">${completedSubs}/${totalSubs}</span>
                                                </div>
                                            </td>
                                            <td class="py-3 px-4">${progress?.pretestDone ? '<span class="text-green-500 font-bold">✔</span>' : '<span class="text-gray-300">—</span>'}</td>
                                            <td class="py-3 px-4">${progress?.posttestDone ? '<span class="text-green-500 font-bold">✔</span>' : '<span class="text-gray-300">—</span>'}</td>
                                            <td class="py-3 px-4 text-center">
                                                <button data-delete-student="${s.id}" class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all">🗑️</button>
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                `}
            </div>
        </div>
    `;
}