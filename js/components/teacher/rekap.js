// =============== REKAP NILAI ===============

// Di awal setiap file component, pastikan fungsi didefinisikan secara global
window.renderRekapNilai = renderRekapNilai;
window.exportPretestToExcel = exportPretestToExcel;
window.exportPosttestToExcel = exportPosttestToExcel;

function renderRekapNilai(students, pretest, posttest) {
    return `
        <div class="animate-fade">
            <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h1 class="text-2xl md:text-3xl font-bold text-gray-800">📈 Rekap Nilai</h1>
            </div>

            <!-- Tab Navigation -->
            <div class="flex flex-col sm:flex-row gap-3 mb-6">
                <button id="tabPretest" 
                    class="flex-1 flex items-center justify-center gap-3 px-5 py-4 rounded-xl font-semibold transition-all
                           bg-orange-100 text-orange-600 hover:bg-orange-200 shadow-sm">
                    <span class="text-xl">✏️</span>
                    <span>Pretest</span>
                    <span class="bg-orange-200 text-orange-700 px-2 py-1 rounded-full text-xs font-bold">
                        ${pretest ? parseJSON(pretest.questions).length : 0} soal
                    </span>
                </button>
                <button id="tabPosttest" 
                    class="flex-1 flex items-center justify-center gap-3 px-5 py-4 rounded-xl font-semibold transition-all
                           bg-gray-100 text-gray-600 hover:bg-gray-200 shadow-sm">
                    <span class="text-xl">✏️</span>
                    <span>Posttest</span>
                    <span class="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-bold">
                        ${posttest ? parseJSON(posttest.questions).length : 0} soal
                    </span>
                </button>
            </div>

            <!-- Pretest Tools Section -->
            <div id="pretestTools" class="bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-2xl p-5 md:p-6 mb-6 border border-orange-200">
                <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div class="flex items-center gap-4">
                        <div class="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center text-white text-2xl shadow-md">
                            ✏️
                        </div>
                        <div>
                            <h2 class="text-xl font-bold text-gray-800">Pretest</h2>
                            <div class="flex items-center gap-2 mt-1">
                                <span class="text-sm bg-white px-3 py-1 rounded-full text-orange-600 font-semibold">
                                    ${students.filter(s => getProgress(s.id)?.pretestDone).length}/${students.length} siswa
                                </span>
                                <span class="text-xs text-gray-500">selesai</span>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col sm:flex-row gap-3">
                        <button id="refreshPretest" 
                            class="flex items-center justify-center gap-2 px-5 py-3 sm:px-4 sm:py-2.5 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all text-sm font-semibold shadow-sm border border-blue-200">
                            <span class="text-lg">🔄</span>
                            <span>Refresh</span>
                        </button>
                        <button id="deletePretestRekap" 
                            class="flex items-center justify-center gap-2 px-5 py-3 sm:px-4 sm:py-2.5 bg-white text-red-600 rounded-xl hover:bg-red-50 transition-all text-sm font-semibold shadow-sm border border-red-200">
                            <span class="text-lg">🗑️</span>
                            <span>Hapus</span>
                        </button>
                        <button id="exportPretest" 
                            class="flex items-center justify-center gap-2 px-5 py-3 sm:px-4 sm:py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all text-sm font-semibold shadow-sm">
                            <span class="text-lg">📥</span>
                            <span>Export Excel</span>
                        </button>
                    </div>
                </div>
                
                <!-- Pretest Statistics -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5 pt-5 border-t border-orange-200">
                    <div class="bg-white/80 backdrop-blur rounded-xl p-4">
                        <div class="text-xs text-gray-500 mb-1">Total Soal</div>
                        <div class="text-2xl font-bold text-orange-600">${pretest ? parseJSON(pretest.questions).length : 0}</div>
                    </div>
                    <div class="bg-white/80 backdrop-blur rounded-xl p-4">
                        <div class="text-xs text-gray-500 mb-1">Rata-rata</div>
                        <div class="text-2xl font-bold text-orange-600">${calculateAverageScore(students, 'pretest')}</div>
                    </div>
                    <div class="bg-white/80 backdrop-blur rounded-xl p-4">
                        <div class="text-xs text-gray-500 mb-1">Nilai Tertinggi</div>
                        <div class="text-2xl font-bold text-green-600">${calculateHighestScore(students, 'pretest')}</div>
                    </div>
                    <div class="bg-white/80 backdrop-blur rounded-xl p-4">
                        <div class="text-xs text-gray-500 mb-1">Nilai Terendah</div>
                        <div class="text-2xl font-bold text-red-600">${calculateLowestScore(students, 'pretest')}</div>
                    </div>
                </div>
            </div>

            <!-- Posttest Tools Section -->
            <div id="posttestTools" class="hidden bg-gradient-to-r from-green-50 to-green-100/50 rounded-2xl p-5 md:p-6 mb-6 border border-green-200">
                <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div class="flex items-center gap-4">
                        <div class="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center text-white text-2xl shadow-md">
                            ✏️
                        </div>
                        <div>
                            <h2 class="text-xl font-bold text-gray-800">Posttest</h2>
                            <div class="flex items-center gap-2 mt-1">
                                <span class="text-sm bg-white px-3 py-1 rounded-full text-green-600 font-semibold">
                                    ${students.filter(s => getProgress(s.id)?.posttestDone).length}/${students.length} siswa
                                </span>
                                <span class="text-xs text-gray-500">selesai</span>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col sm:flex-row gap-3">
                        <button id="refreshPosttest" 
                            class="flex items-center justify-center gap-2 px-5 py-3 sm:px-4 sm:py-2.5 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all text-sm font-semibold shadow-sm border border-blue-200">
                            <span class="text-lg">🔄</span>
                            <span>Refresh</span>
                        </button>
                        <button id="deletePosttestRekap" 
                            class="flex items-center justify-center gap-2 px-5 py-3 sm:px-4 sm:py-2.5 bg-white text-red-600 rounded-xl hover:bg-red-50 transition-all text-sm font-semibold shadow-sm border border-red-200">
                            <span class="text-lg">🗑️</span>
                            <span>Hapus</span>
                        </button>
                        <button id="exportPosttest" 
                            class="flex items-center justify-center gap-2 px-5 py-3 sm:px-4 sm:py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all text-sm font-semibold shadow-sm">
                            <span class="text-lg">📥</span>
                            <span>Export Excel</span>
                        </button>
                    </div>
                </div>
                
                <!-- Posttest Statistics -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5 pt-5 border-t border-green-200">
                    <div class="bg-white/80 backdrop-blur rounded-xl p-4">
                        <div class="text-xs text-gray-500 mb-1">Total Soal</div>
                        <div class="text-2xl font-bold text-green-600">${posttest ? parseJSON(posttest.questions).length : 0}</div>
                    </div>
                    <div class="bg-white/80 backdrop-blur rounded-xl p-4">
                        <div class="text-xs text-gray-500 mb-1">Rata-rata</div>
                        <div class="text-2xl font-bold text-green-600">${calculateAverageScore(students, 'posttest')}</div>
                    </div>
                    <div class="bg-white/80 backdrop-blur rounded-xl p-4">
                        <div class="text-xs text-gray-500 mb-1">Nilai Tertinggi</div>
                        <div class="text-2xl font-bold text-green-600">${calculateHighestScore(students, 'posttest')}</div>
                    </div>
                    <div class="bg-white/80 backdrop-blur rounded-xl p-4">
                        <div class="text-xs text-gray-500 mb-1">Nilai Terendah</div>
                        <div class="text-2xl font-bold text-red-600">${calculateLowestScore(students, 'posttest')}</div>
                    </div>
                </div>
            </div>

            <!-- Pretest Results -->
            <div id="pretestContainer" class="bg-white rounded-2xl card-shadow p-4 md:p-6">
                ${!pretest ? `
                    <div class="text-center py-12 text-gray-400">
                        <div class="text-5xl mb-4">✏️</div>
                        <p class="text-lg font-medium">Belum ada pretest dibuat</p>
                        <p class="text-sm mt-2">Buat pretest terlebih dahulu di menu Kelola Pretest & Posttest</p>
                    </div>
                ` : students.filter(s => getProgress(s.id)?.pretestDone).length === 0 ? `
                    <div class="text-center py-12 text-gray-400">
                        <div class="text-5xl mb-4">⏳</div>
                        <p class="text-lg font-medium">Belum ada siswa mengerjakan pretest</p>
                        <p class="text-sm mt-2">Tunggu siswa menyelesaikan pretest mereka</p>
                    </div>
                ` : renderPretestTable(students, pretest)}
            </div>

            <!-- Posttest Results -->
            <div id="posttestContainer" class="hidden bg-white rounded-2xl card-shadow p-4 md:p-6">
                ${!posttest ? `
                    <div class="text-center py-12 text-gray-400">
                        <div class="text-5xl mb-4">✏️</div>
                        <p class="text-lg font-medium">Belum ada posttest dibuat</p>
                        <p class="text-sm mt-2">Buat posttest terlebih dahulu di menu Kelola Pretest & Posttest</p>
                    </div>
                ` : students.filter(s => getProgress(s.id)?.posttestDone).length === 0 ? `
                    <div class="text-center py-12 text-gray-400">
                        <div class="text-5xl mb-4">⏳</div>
                        <p class="text-lg font-medium">Belum ada siswa mengerjakan posttest</p>
                        <p class="text-sm mt-2">Tunggu siswa menyelesaikan posttest mereka</p>
                    </div>
                ` : renderPosttestTable(students, posttest)}
            </div>
        </div>
    `;
}

// Fungsi helper untuk menghitung rata-rata nilai
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

// Fungsi helper untuk nilai tertinggi
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

// Fungsi helper untuk nilai terendah
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

// UPDATED: Render Pretest Table dengan format pilihan ganda
function renderPretestTable(students, pretest) {
    const questions = parseJSON(pretest.questions);
    const totalSoal = questions.length;
    
    return `
        <div class="overflow-x-auto">
            <table class="min-w-full w-full border-collapse">
                <thead>
                    <tr class="bg-orange-50">
                        <th class="text-left py-3 px-4 font-semibold text-gray-600 border-b">No</th>
                        <th class="text-left py-3 px-4 font-semibold text-gray-600 border-b">Nama</th>
                        <th class="text-left py-3 px-4 font-semibold text-gray-600 border-b">Kelas</th>
                        <th class="text-left py-3 px-4 font-semibold text-gray-600 border-b">Sekolah</th>
                        <th class="text-left py-3 px-4 font-semibold text-gray-600 border-b">Tanggal</th>
                        <th class="text-center py-3 px-4 font-semibold text-gray-600 border-b" colspan="${totalSoal}">Jawaban (${totalSoal} soal)</th>
                        <th class="text-center py-3 px-4 font-semibold text-gray-600 border-b">Benar</th>
                        <th class="text-center py-3 px-4 font-semibold text-gray-600 border-b">Salah</th>
                        <th class="text-center py-3 px-4 font-semibold text-gray-600 border-b">Nilai</th>
                        <th class="text-center py-3 px-4 font-semibold text-gray-600 border-b">Aksi</th>
                    </tr>
                    <tr class="bg-orange-50/50">
                        <th class="py-2 px-4 border-b"></th>
                        <th class="py-2 px-4 border-b"></th>
                        <th class="py-2 px-4 border-b"></th>
                        <th class="py-2 px-4 border-b"></th>
                        <th class="py-2 px-4 border-b"></th>
                        ${Array.from({ length: totalSoal }, (_, i) => 
                            `<th class="text-center py-2 px-2 border-b text-xs font-medium text-gray-500">${i + 1}</th>`
                        ).join('')}
                        <th class="py-2 px-4 border-b"></th>
                        <th class="py-2 px-4 border-b"></th>
                        <th class="py-2 px-4 border-b"></th>
                        <th class="py-2 px-4 border-b"></th>
                    </tr>
                </thead>
                <tbody>
                    ${students.filter(s => getProgress(s.id)?.pretestDone).map((s, index) => {
                        const progress = getProgress(s.id);
                        const answers = parseJSON(progress.pretestAnswers);
                        const correctCount = answers.filter((a, i) => a === questions[i]?.answer).length;
                        const wrongCount = totalSoal - correctCount;
                        
                        return `
                            <tr class="border-b border-gray-100 hover:bg-gray-50">
                                <td class="py-3 px-4 font-medium text-gray-500">${index + 1}</td>
                                <td class="py-3 px-4 font-medium">${s.name}</td>
                                <td class="py-3 px-4">${s.kelas}</td>
                                <td class="py-3 px-4">${s.sekolah}</td>
                                <td class="py-3 px-4 text-sm">${formatDate(progress.createdAt || progress.updatedAt || new Date().toISOString())}</td>
                                ${answers.map(answer => `
                                    <td class="py-3 px-2 text-center">
                                        <span class="inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold 
                                            bg-purple-100 text-purple-700">
                                            ${String.fromCharCode(65 + answer)}
                                        </span>
                                    </td>
                                `).join('')}
                                <td class="py-3 px-4 text-center font-semibold text-green-600">${correctCount}</td>
                                <td class="py-3 px-4 text-center font-semibold text-red-600">${wrongCount}</td>
                                <td class="py-3 px-4 text-center">
                                    <span class="px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-bold">${progress.pretestScore || 0}</span>
                                </td>
                                <td class="py-3 px-4 text-center">
                                    <button data-delete-score="${progress.id}" class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Hapus nilai">
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// UPDATED: Render Posttest Table dengan format pilihan ganda
function renderPosttestTable(students, posttest) {
    const questions = parseJSON(posttest.questions);
    const totalSoal = questions.length;
    
    return `
        <div class="overflow-x-auto">
            <table class="min-w-full w-full border-collapse">
                <thead>
                    <tr class="bg-green-50">
                        <th class="text-left py-3 px-4 font-semibold text-gray-600 border-b">No</th>
                        <th class="text-left py-3 px-4 font-semibold text-gray-600 border-b">Nama</th>
                        <th class="text-left py-3 px-4 font-semibold text-gray-600 border-b">Kelas</th>
                        <th class="text-left py-3 px-4 font-semibold text-gray-600 border-b">Sekolah</th>
                        <th class="text-left py-3 px-4 font-semibold text-gray-600 border-b">Tanggal</th>
                        <th class="text-center py-3 px-4 font-semibold text-gray-600 border-b" colspan="${totalSoal}">Jawaban (${totalSoal} soal)</th>
                        <th class="text-center py-3 px-4 font-semibold text-gray-600 border-b">Benar</th>
                        <th class="text-center py-3 px-4 font-semibold text-gray-600 border-b">Salah</th>
                        <th class="text-center py-3 px-4 font-semibold text-gray-600 border-b">Nilai</th>
                        <th class="text-center py-3 px-4 font-semibold text-gray-600 border-b">Aksi</th>
                    </tr>
                    <tr class="bg-green-50/50">
                        <th class="py-2 px-4 border-b"></th>
                        <th class="py-2 px-4 border-b"></th>
                        <th class="py-2 px-4 border-b"></th>
                        <th class="py-2 px-4 border-b"></th>
                        <th class="py-2 px-4 border-b"></th>
                        ${Array.from({ length: totalSoal }, (_, i) => 
                            `<th class="text-center py-2 px-2 border-b text-xs font-medium text-gray-500">${i + 1}</th>`
                        ).join('')}
                        <th class="py-2 px-4 border-b"></th>
                        <th class="py-2 px-4 border-b"></th>
                        <th class="py-2 px-4 border-b"></th>
                        <th class="py-2 px-4 border-b"></th>
                    </tr>
                </thead>
                <tbody>
                    ${students.filter(s => getProgress(s.id)?.posttestDone).map((s, index) => {
                        const progress = getProgress(s.id);
                        const answers = parseJSON(progress.posttestAnswers);
                        const correctCount = answers.filter((a, i) => a === questions[i]?.answer).length;
                        const wrongCount = totalSoal - correctCount;
                        
                        return `
                            <tr class="border-b border-gray-100 hover:bg-gray-50">
                                <td class="py-3 px-4 font-medium text-gray-500">${index + 1}</td>
                                <td class="py-3 px-4 font-medium">${s.name}</td>
                                <td class="py-3 px-4">${s.kelas}</td>
                                <td class="py-3 px-4">${s.sekolah}</td>
                                <td class="py-3 px-4 text-sm">${formatDate(progress.updatedAt || progress.createdAt || new Date().toISOString())}</td>
                                ${answers.map(answer => `
                                    <td class="py-3 px-2 text-center">
                                        <span class="inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold 
                                            bg-purple-100 text-purple-700">
                                            ${String.fromCharCode(65 + answer)}
                                        </span>
                                    </td>
                                `).join('')}
                                <td class="py-3 px-4 text-center font-semibold text-green-600">${correctCount}</td>
                                <td class="py-3 px-4 text-center font-semibold text-red-600">${wrongCount}</td>
                                <td class="py-3 px-4 text-center">
                                    <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full font-bold">${progress.posttestScore || 0}</span>
                                </td>
                                <td class="py-3 px-4 text-center">
                                    <button data-delete-score="${progress.id}" class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Hapus nilai">
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// UPDATED: Export Pretest ke Excel dengan format pilihan ganda
function exportPretestToExcel() {
    const students = getStudents();
    const pretest = getTests().find(t => t.testType === 'pretest');
    
    if (!pretest) {
        showToast('Belum ada pretest dibuat', 'error');
        return;
    }

    const questions = parseJSON(pretest.questions);
    const totalSoal = questions.length;
    const exportData = [];
    let no = 1;
    
    students.forEach(s => {
        const progress = getProgress(s.id);
        if (progress?.pretestDone) {
            const answers = parseJSON(progress.pretestAnswers);
            const correctCount = answers.filter((a, i) => a === questions[i]?.answer).length;
            const wrongCount = totalSoal - correctCount;
            
            const rowData = {
                'No': no++,
                'Tanggal': formatDate(progress.createdAt || progress.updatedAt || new Date().toISOString()),
                'Nama': s.name,
                'Kelas': s.kelas,
                'Sekolah': s.sekolah
            };
            
            answers.forEach((answer, index) => {
                rowData[`Soal ${index + 1}`] = String.fromCharCode(65 + answer); // Konversi ke A, B, C, D
            });
            
            rowData['Jumlah Benar'] = correctCount;
            rowData['Jumlah Salah'] = wrongCount;
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

// UPDATED: Export Posttest ke Excel dengan format pilihan ganda
function exportPosttestToExcel() {
    const students = getStudents();
    const posttest = getTests().find(t => t.testType === 'posttest');
    
    if (!posttest) {
        showToast('Belum ada posttest dibuat', 'error');
        return;
    }

    const questions = parseJSON(posttest.questions);
    const totalSoal = questions.length;
    const exportData = [];
    let no = 1;
    
    students.forEach(s => {
        const progress = getProgress(s.id);
        if (progress?.posttestDone) {
            const answers = parseJSON(progress.posttestAnswers);
            const correctCount = answers.filter((a, i) => a === questions[i]?.answer).length;
            const wrongCount = totalSoal - correctCount;
            
            const rowData = {
                'No': no++,
                'Tanggal': formatDate(progress.updatedAt || progress.createdAt || new Date().toISOString()),
                'Nama': s.name,
                'Kelas': s.kelas,
                'Sekolah': s.sekolah
            };
            
            answers.forEach((answer, index) => {
                rowData[`Soal ${index + 1}`] = String.fromCharCode(65 + answer); // Konversi ke A, B, C, D
            });
            
            rowData['Jumlah Benar'] = correctCount;
            rowData['Jumlah Salah'] = wrongCount;
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

// Di dalam renderPretestTable atau buat tabel khusus LKPD
// =============== FUNGSI RENDER POHON MATERI LKPD ===============
    function renderMateriTreeLKPD() {
        const materiList = getMateri();
        const semuaSubs = getSubMateri();
        const students = getStudents();
        
        if (materiList.length === 0) {
            return `
                <div class="text-center py-8 text-gray-400">
                    <div class="text-4xl mb-2">📚</div>
                    <p>Belum ada materi</p>
                </div>
            `;
        }
        
        let html = '';
        
        materiList.forEach((materi, idx) => {
            // Ambil sub materi untuk materi ini
            const subMateriList = semuaSubs.filter(sub => sub.materiId === materi.id);
            
            // Hitung total pengumpulan untuk setiap sub materi
            const subMateriWithCount = subMateriList.map(sub => {
                const count = hitungPengumpulanPerSubMateri(sub.id, students);
                return { ...sub, count };
            });
            
            // Filter sub materi yang punya pengumpulan (opsional: bisa juga tampilkan yang 0)
            const subWithSubmissions = subMateriWithCount.filter(sub => sub.count > 0);
            
            // Kalau ga ada pengumpulan sama sekali di materi ini, bisa disembunyikan
            if (subWithSubmissions.length === 0) return;
            
            html += `
                <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <!-- Header Materi (bisa diklik untuk expand/collapse) -->
                    <div class="bg-gradient-to-r from-amber-50 to-amber-100/50 p-4 flex items-center justify-between cursor-pointer hover:bg-amber-100 transition-all"
                        onclick="toggleMateriSubs('materi-${materi.id}')">
                        <div class="flex items-center gap-3">
                            <span class="text-2xl">📚</span>
                            <div>
                                <h3 class="font-bold text-gray-800">${escapeHtml(materi.title)}</h3>
                                <p class="text-xs text-gray-500">${subWithSubmissions.length} sub materi dengan tugas</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <span class="bg-amber-200 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold">
                                ${subWithSubmissions.reduce((sum, sub) => sum + sub.count, 0)} tugas
                            </span>
                            <span class="text-gray-400 text-xl transition-transform" id="arrow-materi-${materi.id}">▼</span>
                        </div>
                    </div>
                    
                    <!-- Daftar Sub Materi (awalnya terbuka, bisa di-toggle) -->
                    <div id="materi-${materi.id}" class="p-4 space-y-2 bg-white">
                        ${subWithSubmissions.map(sub => `
                            <div class="flex items-center justify-between p-3 hover:bg-amber-50 rounded-lg transition-all border border-gray-100">
                                <div class="flex items-center gap-3">
                                    <span class="text-lg">📖</span>
                                    <div>
                                        <span class="font-medium text-gray-800">${escapeHtml(sub.title)}</span>
                                        <span class="text-xs text-gray-500 ml-2">${sub.count} tugas terkumpul</span>
                                    </div>
                                </div>
                                <button onclick="showLkpdDetail('${sub.id}', '${escapeHtml(sub.title)}')" 
                                    class="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all text-sm font-semibold flex items-center gap-2">
                                    <span>📋</span>
                                    Lihat Tugas
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        });
        
        return html || '<div class="text-center py-8 text-gray-400">Belum ada pengumpulan LKPD</div>';
    }

    // Fungsi helper hitung pengumpulan per sub materi
    function hitungPengumpulanPerSubMateri(subId, students) {
        let count = 0;
        students.forEach(s => {
            const progress = getProgress(s.id);
            if (progress?.lkpdLinks) {
                const links = parseJSON(progress.lkpdLinks);
                if (links[subId]) count++;
            }
        });
        return count;
    }

    // Fungsi untuk toggle expand/collapse sub materi
    window.toggleMateriSubs = function(materiId) {
        const container = document.getElementById(materiId);
        const arrow = document.getElementById(`arrow-${materiId}`);
        
        if (container.classList.contains('hidden')) {
            container.classList.remove('hidden');
            arrow.style.transform = 'rotate(0deg)';
        } else {
            container.classList.add('hidden');
            arrow.style.transform = 'rotate(-90deg)';
        }
    }

    // Fungsi untuk menampilkan detail pengumpulan per sub materi
    window.showLkpdDetail = function(subId, subTitle) {
        const students = getStudents();
        const sub = store.getById(subId);
        
        // Kumpulkan data siswa yang mengumpulkan untuk sub materi ini
        const submissions = [];
        
        students.forEach(s => {
            const progress = getProgress(s.id);
            if (progress?.lkpdLinks) {
                const links = parseJSON(progress.lkpdLinks);
                const link = links[subId];
                
                if (link) {
                    submissions.push({
                        siswa: s,
                        link: link,
                        tanggal: progress.updatedAt || progress.createdAt
                    });
                }
            }
        });
        
        // Urutkan berdasarkan tanggal terbaru
        submissions.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
        
        // Render detail
        const detailContainer = document.getElementById('lkpdDetailContainer');
        const treeContainer = document.getElementById('lkpdMateriTree');
        
        detailContainer.innerHTML = `
            <div class="animate-fade">
                <!-- Header dengan tombol back -->
                <div class="flex items-center gap-3 mb-6">
                    <button onclick="backToMateriTree()" 
                        class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all flex items-center gap-2">
                        <span>←</span> Kembali
                    </button>
                    <h3 class="text-lg font-bold text-gray-800">
                        📖 ${escapeHtml(subTitle)}
                    </h3>
                    <span class="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-semibold">
                        ${submissions.length} tugas
                    </span>
                </div>
                
                <!-- Tabel Detail -->
                <div class="overflow-x-auto">
                    <table class="min-w-full w-full">
                        <thead>
                            <tr class="bg-amber-50">
                                <th class="text-left py-3 px-4 font-semibold text-gray-600">No</th>
                                <th class="text-left py-3 px-4 font-semibold text-gray-600">Nama Siswa</th>
                                <th class="text-left py-3 px-4 font-semibold text-gray-600">Kelas</th>
                                <th class="text-left py-3 px-4 font-semibold text-gray-600">Sekolah</th>
                                <th class="text-left py-3 px-4 font-semibold text-gray-600">Link Tugas</th>
                                <th class="text-left py-3 px-4 font-semibold text-gray-600">Tanggal</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${submissions.length === 0 ? `
                                <tr>
                                    <td colspan="6" class="text-center py-8 text-gray-400">
                                        Belum ada siswa mengumpulkan tugas
                                    </td>
                                </tr>
                            ` : submissions.map((item, index) => `
                                <tr class="border-b hover:bg-gray-50">
                                    <td class="py-3 px-4">${index + 1}</td>
                                    <td class="py-3 px-4 font-medium">${item.siswa.name}</td>
                                    <td class="py-3 px-4">${item.siswa.kelas}</td>
                                    <td class="py-3 px-4">${item.siswa.sekolah}</td>
                                    <td class="py-3 px-4">
                                        <a href="${item.link}" target="_blank" 
                                            class="text-amber-600 hover:text-amber-800 flex items-center gap-1">
                                            <span>🔗</span>
                                            Lihat Tugas
                                        </a>
                                    </td>
                                    <td class="py-3 px-4 text-sm">${formatDate(item.tanggal)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <!-- Export per sub materi -->
                <div class="mt-6 flex justify-end">
                    <button onclick="exportLkpdPerSubMateri('${subId}', '${escapeHtml(subTitle)}')" 
                        class="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center gap-2 text-sm font-semibold">
                        <span>📥</span>
                        Export Excel (Sub Materi Ini)
                    </button>
                </div>
            </div>
        `;
        
        // Sembunyikan tree, tampilkan detail
        treeContainer.classList.add('hidden');
        detailContainer.classList.remove('hidden');
    };

    // Fungsi kembali ke pohon materi
    window.backToMateriTree = function() {
        document.getElementById('lkpdMateriTree').classList.remove('hidden');
        document.getElementById('lkpdDetailContainer').classList.add('hidden');
    };

    // Fungsi export per sub materi
    window.exportLkpdPerSubMateri = function(subId, subTitle) {
        const students = getStudents();
        const sub = store.getById(subId);
        const exportData = [];
        let no = 1;
        
        students.forEach(s => {
            const progress = getProgress(s.id);
            if (progress?.lkpdLinks) {
                const links = parseJSON(progress.lkpdLinks);
                const link = links[subId];
                
                if (link) {
                    exportData.push({
                        'No': no++,
                        'Nama': s.name,
                        'Kelas': s.kelas,
                        'Sekolah': s.sekolah,
                        'Link Tugas': link,
                        'Tanggal': formatDate(progress.updatedAt || progress.createdAt)
                    });
                }
            }
        });
        
        if (exportData.length === 0) {
            showToast('Tidak ada data untuk diexport', 'info');
            return;
        }
        
        const fileName = `LKPD_${subTitle.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().slice(0,10)}`;
        exportToExcel(exportData, fileName);
    };
    

function renderRekapNilai(students, pretest, posttest) {
    return `
        <div class="animate-fade">
            <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h1 class="text-2xl md:text-3xl font-bold text-gray-800">📈 Rekap Nilai</h1>
            </div>

            <!-- Tab Navigation - TAMBAH TAB LKPD -->
            <div class="flex flex-col sm:flex-row gap-3 mb-6">
                <button id="tabPretest" 
                    class="flex-1 flex items-center justify-center gap-3 px-5 py-4 rounded-xl font-semibold transition-all
                           bg-orange-100 text-orange-600 hover:bg-orange-200 shadow-sm">
                    <span class="text-xl">✏️</span>
                    <span>Pretest</span>
                    <span class="bg-orange-200 text-orange-700 px-2 py-1 rounded-full text-xs font-bold">
                        ${pretest ? parseJSON(pretest.questions).length : 0} soal
                    </span>
                </button>
                <button id="tabPosttest" 
                    class="flex-1 flex items-center justify-center gap-3 px-5 py-4 rounded-xl font-semibold transition-all
                           bg-gray-100 text-gray-600 hover:bg-gray-200 shadow-sm">
                    <span class="text-xl">✏️</span>
                    <span>Posttest</span>
                    <span class="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-bold">
                        ${posttest ? parseJSON(posttest.questions).length : 0} soal
                    </span>
                </button>
                <!-- TAMBAHKAN TAB LKPD -->
                <button id="tabLkpd" 
                    class="flex-1 flex items-center justify-center gap-3 px-5 py-4 rounded-xl font-semibold transition-all
                           bg-gray-100 text-gray-600 hover:bg-amber-200 shadow-sm">
                    <span class="text-xl">📋</span>
                    <span>LKPD</span>
                    <span class="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-bold">
                        Tugas
                    </span>
                </button>
            </div>

            <!-- Pretest Tools Section (existing code) -->
            <div id="pretestTools" class="...">...</div>

            <!-- Posttest Tools Section (existing code) -->
            <div id="posttestTools" class="hidden ...">...</div>

            <!-- TAMBAHKAN LKPD Tools Section -->
            <div id="lkpdTools" class="hidden bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-2xl p-5 md:p-6 mb-6 border border-amber-200">
                <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div class="flex items-center gap-4">
                        <div class="w-14 h-14 bg-amber-500 rounded-xl flex items-center justify-center text-white text-2xl shadow-md">
                            📋
                        </div>
                        <div>
                            <h2 class="text-xl font-bold text-gray-800">Kumpulan Tugas LKPD</h2>
                            <div class="flex items-center gap-2 mt-1">
                                <span class="text-sm bg-white px-3 py-1 rounded-full text-amber-600 font-semibold">
                                    ${hitungTotalPengumpulanLKPD(students)} tugas terkumpul
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col sm:flex-row gap-3">
                        <button id="refreshLkpd" 
                            class="flex items-center justify-center gap-2 px-5 py-3 sm:px-4 sm:py-2.5 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all text-sm font-semibold shadow-sm border border-blue-200">
                            <span class="text-lg">🔄</span>
                            <span>Refresh</span>
                        </button>
                        <button id="exportLkpd" 
                            class="flex items-center justify-center gap-2 px-5 py-3 sm:px-4 sm:py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all text-sm font-semibold shadow-sm">
                            <span class="text-lg">📥</span>
                            <span>Export Excel</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Pretest Container (existing) -->
            <div id="pretestContainer" class="bg-white rounded-2xl card-shadow p-4 md:p-6">
                ${renderPretestTable(students, pretest)}
            </div>

            <!-- Posttest Container (existing) -->
            <div id="posttestContainer" class="hidden bg-white rounded-2xl card-shadow p-4 md:p-6">
                ${renderPosttestTable(students, posttest)}
            </div>

            <!-- TAMBAHKAN LKPD Container dengan struktur hierarki -->
            <div id="lkpdContainer" class="hidden bg-white rounded-2xl card-shadow p-4 md:p-6">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl font-bold text-amber-600 flex items-center gap-2">
                        <span>📋</span> Kumpulan Tugas LKPD
                    </h2>
                    <span class="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-semibold">
                        Total: ${hitungTotalPengumpulanLKPD(students)} tugas
                    </span>
                </div>
                
                <!-- Container untuk daftar materi (tree view) -->
                <div id="lkpdMateriTree" class="space-y-4">
                    ${renderMateriTreeLKPD()}
                </div>
                
                <!-- Container untuk detail sub materi (awalnya hidden) -->
                <div id="lkpdDetailContainer" class="hidden mt-6 border-t pt-6"></div>
            </div>
    `;
}

// Fungsi helper untuk menghitung total pengumpulan LKPD
function hitungTotalPengumpulanLKPD(students) {
    let total = 0;
    students.forEach(s => {
        const progress = getProgress(s.id);
        if (progress?.lkpdLinks) {
            const links = parseJSON(progress.lkpdLinks);
            total += Object.keys(links).length;
        }
    });
    return total;
}

// Export semua LKPD (tetap ada untuk export global)
function exportLkpdToExcel() {
    const students = getStudents();
    const exportData = [];
    let no = 1;
    
    students.forEach(s => {
        const progress = getProgress(s.id);
        if (progress?.lkpdLinks) {
            const links = parseJSON(progress.lkpdLinks);
            
            Object.entries(links).forEach(([subId, link]) => {
                const sub = store.getById(subId);
                if (sub) {
                    exportData.push({
                        'No': no++,
                        'Nama': s.name,
                        'Kelas': s.kelas,
                        'Sekolah': s.sekolah,
                        'Materi': getMateri().find(m => m.id === sub.materiId)?.title || '-',
                        'Sub Materi': sub.title,
                        'Link Tugas': link,
                        'Tanggal': formatDate(progress.updatedAt || progress.createdAt)
                    });
                }
            });
        }
    });

    if (exportData.length === 0) {
        showToast('Belum ada pengumpulan LKPD', 'info');
        return;
    }

    exportToExcel(exportData, `Rekap_LKPD_${new Date().toISOString().slice(0,10)}`);
}