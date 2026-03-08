// =============== REKAP NILAI & LKPD (PRETEST, POSTTEST, LKPD) ===============

window.renderRekapNilai = renderRekapNilai;
window.exportPretestToExcel = exportPretestToExcel;
window.exportPosttestToExcel = exportPosttestToExcel;
window.exportLkpdToExcel = exportLkpdToExcel;

function renderRekapNilai(students, pretest, posttest) {
    // Tentukan tab aktif dari state (default 'pretest')
    const activeTab = state.rekapTab || 'pretest';
    
    return `
        <div class="animate-fade">
            <!-- HEADER -->
            <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h1 class="text-2xl md:text-3xl font-bold text-gray-800">📊 Rekap Nilai & Tugas</h1>
            </div>

            <!-- 3 TAB NAVIGATION: PRETEST | POSTTEST | LKPD -->
            <div class="flex flex-wrap gap-2 mb-6">
                <!-- TAB PRETEST -->
                <button id="tabPretestRekap" 
                    class="tab-rekap flex-1 flex items-center justify-center gap-2 px-5 py-4 rounded-xl font-semibold transition-all
                           ${activeTab === 'pretest' ? 'bg-orange-100 text-orange-600 border-2 border-orange-300 shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}">
                    <span class="text-xl">✏️</span>
                    <span class="hidden sm:inline">Pretest</span>
                    <span class="bg-white px-2 py-1 rounded-full text-xs font-bold ${activeTab === 'pretest' ? 'text-orange-600' : 'text-gray-600'}">
                        ${students.filter(s => getProgress(s.id)?.pretestDone).length}/${students.length}
                    </span>
                </button>
                
                <!-- TAB POSTTEST -->
                <button id="tabPosttestRekap" 
                    class="tab-rekap flex-1 flex items-center justify-center gap-2 px-5 py-4 rounded-xl font-semibold transition-all
                           ${activeTab === 'posttest' ? 'bg-green-100 text-green-600 border-2 border-green-300 shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}">
                    <span class="text-xl">📝</span>
                    <span class="hidden sm:inline">Posttest</span>
                    <span class="bg-white px-2 py-1 rounded-full text-xs font-bold ${activeTab === 'posttest' ? 'text-green-600' : 'text-gray-600'}">
                        ${students.filter(s => getProgress(s.id)?.posttestDone).length}/${students.length}
                    </span>
                </button>
                
                <!-- TAB LKPD -->
                <button id="tabLkpdRekap" 
                    class="tab-rekap flex-1 flex items-center justify-center gap-2 px-5 py-4 rounded-xl font-semibold transition-all
                           ${activeTab === 'lkpd' ? 'bg-purple-100 text-purple-600 border-2 border-purple-300 shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}">
                    <span class="text-xl">📋</span>
                    <span class="hidden sm:inline">LKPD</span>
                    <span class="bg-white px-2 py-1 rounded-full text-xs font-bold ${activeTab === 'lkpd' ? 'text-purple-600' : 'text-gray-600'}">
                        ${hitungTotalPengumpulanLKPD(students)} tugas
                    </span>
                </button>
            </div>

            <!-- CONTENT BERDASARKAN TAB AKTIF -->
            <div class="bg-white rounded-2xl card-shadow p-4 md:p-6">
                ${activeTab === 'pretest' ? renderPretestContent(students, pretest) : ''}
                ${activeTab === 'posttest' ? renderPosttestContent(students, posttest) : ''}
                ${activeTab === 'lkpd' ? renderLkpdContent(students) : ''}
            </div>
        </div>
    `;
}

// =============== CONTENT PRETEST ===============
function renderPretestContent(students, pretest) {
    if (!pretest) {
        return `
            <div class="text-center py-12 text-gray-400">
                <div class="text-5xl mb-4">✏️</div>
                <p class="text-lg font-medium">Belum ada pretest dibuat</p>
                <p class="text-sm mt-2">Buat pretest terlebih dahulu di menu Kelola Pretest & Posttest</p>
            </div>
        `;
    }

    if (students.filter(s => getProgress(s.id)?.pretestDone).length === 0) {
        return `
            <div class="text-center py-12 text-gray-400">
                <div class="text-5xl mb-4">⏳</div>
                <p class="text-lg font-medium">Belum ada siswa mengerjakan pretest</p>
            </div>
        `;
    }

    const questions = parseJSON(pretest.questions);
    const totalSoal = questions.length;
    
    return `
        <div>
            <!-- TOOLS BAR -->
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 text-xl">✏️</div>
                    <div>
                        <h2 class="text-xl font-bold text-gray-800">Pretest</h2>
                        <p class="text-sm text-gray-500">${totalSoal} soal • ${students.filter(s => getProgress(s.id)?.pretestDone).length} siswa mengerjakan</p>
                    </div>
                </div>
                <div class="flex gap-2">
                    <button id="refreshPretest" class="px-4 py-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-all">🔄 Refresh</button>
                    <button id="deletePretestRekap" class="px-4 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all">🗑️ Hapus</button>
                    <button id="exportPretest" class="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all">📥 Export</button>
                </div>
            </div>

            <!-- STATISTIK CARD -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div class="bg-orange-50 rounded-xl p-4">
                    <div class="text-xs text-gray-500 mb-1">Rata-rata</div>
                    <div class="text-2xl font-bold text-orange-600">${calculateAverageScore(students, 'pretest')}</div>
                </div>
                <div class="bg-orange-50 rounded-xl p-4">
                    <div class="text-xs text-gray-500 mb-1">Tertinggi</div>
                    <div class="text-2xl font-bold text-green-600">${calculateHighestScore(students, 'pretest')}</div>
                </div>
                <div class="bg-orange-50 rounded-xl p-4">
                    <div class="text-xs text-gray-500 mb-1">Terendah</div>
                    <div class="text-2xl font-bold text-red-600">${calculateLowestScore(students, 'pretest')}</div>
                </div>
                <div class="bg-orange-50 rounded-xl p-4">
                    <div class="text-xs text-gray-500 mb-1">Total Siswa</div>
                    <div class="text-2xl font-bold text-gray-700">${students.filter(s => getProgress(s.id)?.pretestDone).length}</div>
                </div>
            </div>

            <!-- TABEL PRETEST -->
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="bg-orange-50">
                            <th class="text-left py-3 px-4 font-semibold">No</th>
                            <th class="text-left py-3 px-4 font-semibold">Nama</th>
                            <th class="text-left py-3 px-4 font-semibold">Kelas</th>
                            <th class="text-center py-3 px-4 font-semibold" colspan="${totalSoal}">Jawaban (A-E)</th>
                            <th class="text-center py-3 px-4 font-semibold">Benar</th>
                            <th class="text-center py-3 px-4 font-semibold">Nilai</th>
                            <th class="text-center py-3 px-4 font-semibold">Aksi</th>
                        </tr>
                        <tr class="bg-orange-50/50">
                            <th class="py-2 px-4"></th>
                            <th class="py-2 px-4"></th>
                            <th class="py-2 px-4"></th>
                            ${Array.from({ length: totalSoal }, (_, i) => 
                                `<th class="text-center py-2 px-1 text-xs font-medium text-gray-500">${i + 1}</th>`
                            ).join('')}
                            <th class="py-2 px-4"></th>
                            <th class="py-2 px-4"></th>
                            <th class="py-2 px-4"></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${students.filter(s => getProgress(s.id)?.pretestDone).map((s, index) => {
                            const progress = getProgress(s.id);
                            const answers = parseJSON(progress.pretestAnswers);
                            const correctCount = answers.filter((ans, i) => ans === questions[i]?.answer).length;
                            
                            return `
                                <tr class="border-b hover:bg-gray-50">
                                    <td class="py-3 px-4">${index + 1}</td>
                                    <td class="py-3 px-4 font-medium">${s.name}</td>
                                    <td class="py-3 px-4">${s.kelas}</td>
                                    ${answers.map(answer => `
                                        <td class="py-3 px-1 text-center">
                                            <span class="inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold bg-purple-100 text-purple-700">
                                                ${answer || '-'}
                                            </span>
                                        </td>
                                    `).join('')}
                                    <td class="py-3 px-4 text-center font-semibold text-green-600">${correctCount}</td>
                                    <td class="py-3 px-4 text-center">
                                        <span class="px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-bold">${progress.pretestScore || 0}</span>
                                    </td>
                                    <td class="py-3 px-4 text-center">
                                        <button data-delete-score="${progress.id}" class="p-2 text-red-500 hover:bg-red-50 rounded-lg" title="Hapus nilai">🗑️</button>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// =============== CONTENT POSTTEST ===============
function renderPosttestContent(students, posttest) {
    if (!posttest) {
        return `
            <div class="text-center py-12 text-gray-400">
                <div class="text-5xl mb-4">📝</div>
                <p class="text-lg font-medium">Belum ada posttest dibuat</p>
            </div>
        `;
    }

    if (students.filter(s => getProgress(s.id)?.posttestDone).length === 0) {
        return `
            <div class="text-center py-12 text-gray-400">
                <div class="text-5xl mb-4">⏳</div>
                <p class="text-lg font-medium">Belum ada siswa mengerjakan posttest</p>
            </div>
        `;
    }

    const questions = parseJSON(posttest.questions);
    const totalSoal = questions.length;
    
    return `
        <div>
            <!-- TOOLS BAR -->
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 text-xl">📝</div>
                    <div>
                        <h2 class="text-xl font-bold text-gray-800">Posttest</h2>
                        <p class="text-sm text-gray-500">${totalSoal} soal • ${students.filter(s => getProgress(s.id)?.posttestDone).length} siswa mengerjakan</p>
                    </div>
                </div>
                <div class="flex gap-2">
                    <button id="refreshPosttest" class="px-4 py-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-all">🔄 Refresh</button>
                    <button id="deletePosttestRekap" class="px-4 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all">🗑️ Hapus</button>
                    <button id="exportPosttest" class="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all">📥 Export</button>
                </div>
            </div>

            <!-- STATISTIK CARD -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div class="bg-green-50 rounded-xl p-4">
                    <div class="text-xs text-gray-500 mb-1">Rata-rata</div>
                    <div class="text-2xl font-bold text-green-600">${calculateAverageScore(students, 'posttest')}</div>
                </div>
                <div class="bg-green-50 rounded-xl p-4">
                    <div class="text-xs text-gray-500 mb-1">Tertinggi</div>
                    <div class="text-2xl font-bold text-green-600">${calculateHighestScore(students, 'posttest')}</div>
                </div>
                <div class="bg-green-50 rounded-xl p-4">
                    <div class="text-xs text-gray-500 mb-1">Terendah</div>
                    <div class="text-2xl font-bold text-red-600">${calculateLowestScore(students, 'posttest')}</div>
                </div>
                <div class="bg-green-50 rounded-xl p-4">
                    <div class="text-xs text-gray-500 mb-1">Total Siswa</div>
                    <div class="text-2xl font-bold text-gray-700">${students.filter(s => getProgress(s.id)?.posttestDone).length}</div>
                </div>
            </div>

            <!-- TABEL POSTTEST -->
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="bg-green-50">
                            <th class="text-left py-3 px-4 font-semibold">No</th>
                            <th class="text-left py-3 px-4 font-semibold">Nama</th>
                            <th class="text-left py-3 px-4 font-semibold">Kelas</th>
                            <th class="text-center py-3 px-4 font-semibold" colspan="${totalSoal}">Jawaban (A-E)</th>
                            <th class="text-center py-3 px-4 font-semibold">Benar</th>
                            <th class="text-center py-3 px-4 font-semibold">Nilai</th>
                            <th class="text-center py-3 px-4 font-semibold">Aksi</th>
                        </tr>
                        <tr class="bg-green-50/50">
                            <th class="py-2 px-4"></th>
                            <th class="py-2 px-4"></th>
                            <th class="py-2 px-4"></th>
                            ${Array.from({ length: totalSoal }, (_, i) => 
                                `<th class="text-center py-2 px-1 text-xs font-medium text-gray-500">${i + 1}</th>`
                            ).join('')}
                            <th class="py-2 px-4"></th>
                            <th class="py-2 px-4"></th>
                            <th class="py-2 px-4"></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${students.filter(s => getProgress(s.id)?.posttestDone).map((s, index) => {
                            const progress = getProgress(s.id);
                            const answers = parseJSON(progress.posttestAnswers);
                            const correctCount = answers.filter((ans, i) => ans === questions[i]?.answer).length;
                            
                            return `
                                <tr class="border-b hover:bg-gray-50">
                                    <td class="py-3 px-4">${index + 1}</td>
                                    <td class="py-3 px-4 font-medium">${s.name}</td>
                                    <td class="py-3 px-4">${s.kelas}</td>
                                    ${answers.map(answer => `
                                        <td class="py-3 px-1 text-center">
                                            <span class="inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold bg-purple-100 text-purple-700">
                                                ${answer || '-'}
                                            </span>
                                        </td>
                                    `).join('')}
                                    <td class="py-3 px-4 text-center font-semibold text-green-600">${correctCount}</td>
                                    <td class="py-3 px-4 text-center">
                                        <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full font-bold">${progress.posttestScore || 0}</span>
                                    </td>
                                    <td class="py-3 px-4 text-center">
                                        <button data-delete-score="${progress.id}" class="p-2 text-red-500 hover:bg-red-50 rounded-lg" title="Hapus nilai">🗑️</button>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// =============== CONTENT LKPD DENGAN DROPDOWN ===============
function renderLkpdContent(students) {
    const materiList = getMateri();
    const allSubMateri = getSubMateri().filter(s => s.lkpdTitle);
    
    // State untuk dropdown
    const expandedMateri = state.expandedMateriLkpd || [];
    const expandedSubMateri = state.expandedSubMateriLkpd || [];
    
    return `
        <div>
            <!-- TOOLS BAR -->
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 text-xl">📋</div>
                    <div>
                        <h2 class="text-xl font-bold text-gray-800">Rekap Pengumpulan LKPD</h2>
                        <p class="text-sm text-gray-500">${allSubMateri.length} LKPD • ${hitungTotalPengumpulanLKPD(students)} tugas terkumpul</p>
                    </div>
                </div>
                <div class="flex gap-2">
                    <button id="refreshLkpd" class="px-4 py-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-all">🔄 Refresh</button>
                    <button id="exportLkpdExcel" class="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all">📥 Export Excel</button>
                </div>
            </div>

            <!-- STATISTIK CARD LKPD -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div class="bg-purple-50 rounded-xl p-4">
                    <div class="text-xs text-gray-500 mb-1">Total Materi</div>
                    <div class="text-2xl font-bold text-purple-600">${materiList.length}</div>
                </div>
                <div class="bg-purple-50 rounded-xl p-4">
                    <div class="text-xs text-gray-500 mb-1">Total LKPD</div>
                    <div class="text-2xl font-bold text-indigo-600">${allSubMateri.length}</div>
                </div>
                <div class="bg-purple-50 rounded-xl p-4">
                    <div class="text-xs text-gray-500 mb-1">Total Siswa</div>
                    <div class="text-2xl font-bold text-green-600">${students.length}</div>
                </div>
                <div class="bg-purple-50 rounded-xl p-4">
                    <div class="text-xs text-gray-500 mb-1">Tugas Terkumpul</div>
                    <div class="text-2xl font-bold text-orange-600">${hitungTotalPengumpulanLKPD(students)}</div>
                </div>
            </div>

            <!-- DAFTAR MATERI BERTINGKAT -->
            ${materiList.length === 0 ? `
                <div class="text-center py-12 text-gray-400">
                    <div class="text-5xl mb-4">📚</div>
                    <p>Belum ada materi</p>
                </div>
            ` : allSubMateri.length === 0 ? `
                <div class="text-center py-12 text-gray-400">
                    <div class="text-5xl mb-4">📋</div>
                    <p>Belum ada LKPD dibuat</p>
                </div>
            ` : `
                <div class="space-y-3">
                    ${materiList.map((materi) => {
                        const subMateriList = allSubMateri.filter(s => s.materiId === materi.id);
                        if (subMateriList.length === 0) return '';
                        
                        const isExpanded = expandedMateri.includes(materi.id);
                        const totalTerkumpul = hitungPengumpulanMateri(students, subMateriList);
                        
                        return `
                            <!-- MATERI CARD -->
                            <div class="border border-gray-200 rounded-xl overflow-hidden">
                                <!-- HEADER MATERI (KLIKABLE) -->
                                <div class="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 flex items-center justify-between cursor-pointer hover:bg-purple-100 transition-all"
                                     onclick="window.toggleMateriLkpd('${materi.id}')">
                                    <div class="flex items-center gap-3">
                                        <span class="text-2xl">📚</span>
                                        <div>
                                            <h3 class="font-bold text-gray-800">${escapeHtml(materi.title)}</h3>
                                            <p class="text-sm text-gray-500">${subMateriList.length} LKPD • ${totalTerkumpul} dari ${students.length * subMateriList.length} tugas terkumpul</p>
                                        </div>
                                    </div>
                                    <span class="text-xl transition-transform ${isExpanded ? 'rotate-180' : ''}">▼</span>
                                </div>
                                
                                <!-- DAFTAR SUB MATERI (COLLAPSIBLE) -->
                                ${isExpanded ? `
                                    <div class="p-4 space-y-3 bg-gray-50">
                                        ${subMateriList.map((sub) => {
                                            const isSubExpanded = expandedSubMateri.includes(sub.id);
                                            const pengumpul = getSiswaPengumpulLkpd(students, sub.id);
                                            
                                            return `
                                                <!-- SUB MATERI CARD -->
                                                <div class="border border-gray-200 rounded-lg bg-white">
                                                    <!-- HEADER SUB MATERI (KLIKABLE) -->
                                                    <div class="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-all rounded-lg"
                                                         onclick="window.toggleSubMateriLkpd('${sub.id}')">
                                                        <div class="flex items-center gap-3">
                                                            <span class="text-lg">📋</span>
                                                            <div>
                                                                <h4 class="font-semibold text-gray-700">${escapeHtml(sub.title)}</h4>
                                                                <p class="text-xs text-gray-500">${pengumpul.length} dari ${students.length} siswa mengumpulkan</p>
                                                            </div>
                                                        </div>
                                                        <span class="text-lg transition-transform ${isSubExpanded ? 'rotate-180' : ''}">▼</span>
                                                    </div>
                                                    
                                                    <!-- DAFTAR SISWA PENGUMPUL (COLLAPSIBLE) -->
                                                    ${isSubExpanded ? `
                                                        <div class="p-3 border-t border-gray-200">
                                                            ${pengumpul.length === 0 ? `
                                                                <p class="text-center text-gray-400 py-4">Belum ada siswa mengumpulkan tugas</p>
                                                            ` : `
                                                                <div class="overflow-x-auto">
                                                                    <table class="w-full text-sm">
                                                                        <thead>
                                                                            <tr class="bg-gray-100">
                                                                                <th class="text-left p-2 rounded-l-lg">No</th>
                                                                                <th class="text-left p-2">Nama</th>
                                                                                <th class="text-left p-2">Kelas</th>
                                                                                <th class="text-left p-2">Link Tugas</th>
                                                                                <th class="text-left p-2 rounded-r-lg">Status</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            ${pengumpul.map((siswa, i) => {
                                                                                const progress = getProgress(siswa.id);
                                                                                const submissions = progress ? parseJSON(progress.lkpdSubmissions) : {};
                                                                                const link = submissions[sub.id];
                                                                                const completedLkpd = progress ? parseJSON(progress.completedLkpd) : [];
                                                                                const isCompleted = completedLkpd.includes(sub.id);
                                                                                
                                                                                return `
                                                                                    <tr class="border-b border-gray-100 hover:bg-gray-50">
                                                                                        <td class="p-2">${i + 1}</td>
                                                                                        <td class="p-2 font-medium">${escapeHtml(siswa.name)}</td>
                                                                                        <td class="p-2">${siswa.kelas}</td>
                                                                                        <td class="p-2">
                                                                                            <a href="${link}" target="_blank" 
                                                                                               class="text-blue-600 hover:underline text-xs break-all">
                                                                                                ${link.substring(0, 30)}...
                                                                                            </a>
                                                                                        </td>
                                                                                        <td class="p-2">
                                                                                            ${isCompleted ? 
                                                                                                '<span class="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">✅ Selesai</span>' : 
                                                                                                '<span class="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">⏳ Upload saja</span>'
                                                                                            }
                                                                                        </td>
                                                                                    </tr>
                                                                                `;
                                                                            }).join('')}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            `}
                                                        </div>
                                                    ` : ''}
                                                </div>
                                            `;
                                        }).join('')}
                                    </div>
                                ` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
            `}
        </div>
    `;
}

// =============== HELPER FUNCTIONS LKPD ===============

function hitungTotalPengumpulanLKPD(students) {
    let total = 0;
    students.forEach(siswa => {
        const progress = getProgress(siswa.id);
        if (progress) {
            const submissions = parseJSON(progress.lkpdSubmissions);
            total += Object.keys(submissions).length;
        }
    });
    return total;
}

function hitungPengumpulanMateri(students, subMateriList) {
    let total = 0;
    students.forEach(siswa => {
        const progress = getProgress(siswa.id);
        if (progress) {
            const submissions = parseJSON(progress.lkpdSubmissions);
            subMateriList.forEach(sub => {
                if (submissions[sub.id]) total++;
            });
        }
    });
    return total;
}

function getSiswaPengumpulLkpd(students, subId) {
    return students.filter(siswa => {
        const progress = getProgress(siswa.id);
        if (!progress) return false;
        const submissions = parseJSON(progress.lkpdSubmissions);
        return submissions[subId];
    });
}

// =============== TOGGLE FUNCTIONS ===============

window.toggleMateriLkpd = function(materiId) {
    if (!state.expandedMateriLkpd) state.expandedMateriLkpd = [];
    
    if (state.expandedMateriLkpd.includes(materiId)) {
        state.expandedMateriLkpd = state.expandedMateriLkpd.filter(id => id !== materiId);
    } else {
        state.expandedMateriLkpd.push(materiId);
    }
    render();
};

window.toggleSubMateriLkpd = function(subId) {
    if (!state.expandedSubMateriLkpd) state.expandedSubMateriLkpd = [];
    
    if (state.expandedSubMateriLkpd.includes(subId)) {
        state.expandedSubMateriLkpd = state.expandedSubMateriLkpd.filter(id => id !== subId);
    } else {
        state.expandedSubMateriLkpd.push(subId);
    }
    render();
};

// =============== FUNGSI STATISTIK ===============

function calculateAverageScore(students, testType) {
    const scores = students
        .map(s => {
            const progress = getProgress(s.id);
            return testType === 'pretest' ? progress?.pretestScore : progress?.posttestScore;
        })
        .filter(score => score !== undefined && score !== null);
    
    if (scores.length === 0) return 0;
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    return Math.round(average);
}

function calculateHighestScore(students, testType) {
    const scores = students
        .map(s => {
            const progress = getProgress(s.id);
            return testType === 'pretest' ? progress?.pretestScore : progress?.posttestScore;
        })
        .filter(score => score !== undefined && score !== null);
    
    if (scores.length === 0) return 0;
    return Math.max(...scores);
}

function calculateLowestScore(students, testType) {
    const scores = students
        .map(s => {
            const progress = getProgress(s.id);
            return testType === 'pretest' ? progress?.pretestScore : progress?.posttestScore;
        })
        .filter(score => score !== undefined && score !== null);
    
    if (scores.length === 0) return 0;
    return Math.min(...scores);
}

// =============== EXPORT FUNCTIONS ===============

function exportPretestToExcel() {
    const students = getStudents();
    const pretest = getTests().find(t => t.testType === 'pretest');
    
    if (!pretest) {
        showToast('Belum ada pretest dibuat', 'error');
        return;
    }

    const questions = parseJSON(pretest.questions);
    const exportData = [];
    let no = 1;
    
    students.forEach(s => {
        const progress = getProgress(s.id);
        if (progress?.pretestDone) {
            const answers = parseJSON(progress.pretestAnswers);
            const correctCount = answers.filter((ans, i) => ans === questions[i]?.answer).length;
            
            const rowData = {
                'No': no++,
                'Nama': s.name,
                'Kelas': s.kelas,
                'Sekolah': s.sekolah
            };
            
            answers.forEach((answer, index) => {
                rowData[`Soal ${index + 1}`] = answer || '-';
            });
            
            rowData['Jumlah Benar'] = correctCount;
            rowData['Nilai'] = progress.pretestScore || 0;
            
            exportData.push(rowData);
        }
    });

    if (exportData.length === 0) {
        showToast('Belum ada siswa mengerjakan pretest', 'info');
        return;
    }

    exportToExcel(exportData, `Rekap_Pretest_${new Date().toISOString().slice(0,10)}`);
}

function exportPosttestToExcel() {
    const students = getStudents();
    const posttest = getTests().find(t => t.testType === 'posttest');
    
    if (!posttest) {
        showToast('Belum ada posttest dibuat', 'error');
        return;
    }

    const questions = parseJSON(posttest.questions);
    const exportData = [];
    let no = 1;
    
    students.forEach(s => {
        const progress = getProgress(s.id);
        if (progress?.posttestDone) {
            const answers = parseJSON(progress.posttestAnswers);
            const correctCount = answers.filter((ans, i) => ans === questions[i]?.answer).length;
            
            const rowData = {
                'No': no++,
                'Nama': s.name,
                'Kelas': s.kelas,
                'Sekolah': s.sekolah
            };
            
            answers.forEach((answer, index) => {
                rowData[`Soal ${index + 1}`] = answer || '-';
            });
            
            rowData['Jumlah Benar'] = correctCount;
            rowData['Nilai'] = progress.posttestScore || 0;
            
            exportData.push(rowData);
        }
    });

    if (exportData.length === 0) {
        showToast('Belum ada siswa mengerjakan posttest', 'info');
        return;
    }

    exportToExcel(exportData, `Rekap_Posttest_${new Date().toISOString().slice(0,10)}`);
}

function exportLkpdToExcel() {
    const students = getStudents();
    const materiList = getMateri();
    const allSubMateri = getSubMateri().filter(s => s.lkpdTitle);
    
    const exportData = [];
    
    allSubMateri.forEach(sub => {
        const materi = materiList.find(m => m.id === sub.materiId);
        const pengumpul = getSiswaPengumpulLkpd(students, sub.id);
        
        pengumpul.forEach((siswa, idx) => {
            const progress = getProgress(siswa.id);
            const submissions = parseJSON(progress.lkpdSubmissions);
            const link = submissions[sub.id];
            const completedLkpd = parseJSON(progress.completedLkpd);
            const isCompleted = completedLkpd.includes(sub.id);
            
            exportData.push({
                'No': exportData.length + 1,
                'Materi': materi?.title || '-',
                'Sub Materi': sub.title,
                'Nama Siswa': siswa.name,
                'Kelas': siswa.kelas,
                'Sekolah': siswa.sekolah,
                'Link Tugas': link,
                'Status': isCompleted ? 'Selesai' : 'Upload saja'
            });
        });
    });
    
    if (exportData.length === 0) {
        showToast('Belum ada pengumpulan LKPD', 'info');
        return;
    }
    
    exportToExcel(exportData, `Rekap_LKPD_${new Date().toISOString().slice(0,10)}`);
}

// =============== EVENT LISTENER UNTUK TAB ===============
function setupRekapTabListeners() {
    document.getElementById('tabPretestRekap')?.addEventListener('click', () => {
        state.rekapTab = 'pretest';
        render();
    });
    
    document.getElementById('tabPosttestRekap')?.addEventListener('click', () => {
        state.rekapTab = 'posttest';
        render();
    });
    
    document.getElementById('tabLkpdRekap')?.addEventListener('click', () => {
        state.rekapTab = 'lkpd';
        render();
    });
    
    // Refresh LKPD
    document.getElementById('refreshLkpd')?.addEventListener('click', () => {
        store.loadFromLocalStorage();
        store.notify();
        showToast('Data LKPD diperbarui');
    });
}

// Helper escapeHtml
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}