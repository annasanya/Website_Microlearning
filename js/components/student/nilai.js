// =============== STUDENT NILAI ===============
// Di awal setiap file component, pastikan fungsi didefinisikan secara global
window.renderTeacherDashboard = renderTeacherDashboard;
window.renderStudentDashboard = renderStudentDashboard;
//window.renderTestManager = renderTestManager;
window.renderMateriManager = renderMateriManager;
window.renderRekapNilai = renderRekapNilai;
window.renderStudentMateri = renderStudentMateri;
window.renderStudentNilai = renderStudentNilai;
//window.renderLogin = renderLogin;
window.exportPretestToExcel = exportPretestToExcel;
window.exportPosttestToExcel = exportPosttestToExcel;

function renderStudentNilai(progress, pretest, posttest) {
    return `
        <div class="animate-fade">
            <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-6">📈 Rekap Nilai</h1>
            
            <div class="grid md:grid-cols-2 gap-6">
                <!-- Pretest -->
                <div class="bg-white rounded-2xl card-shadow p-6">
                    <h2 class="text-xl font-bold text-orange-600 mb-4">✏️ Nilai Pretest</h2>
                    ${!progress?.pretestDone ? `
                        <div class="text-center py-8 text-gray-400">
                            <div class="text-4xl mb-2">⏳</div>
                            <p>Belum mengerjakan pretest</p>
                        </div>
                    ` : `
                        <div class="text-center mb-6">
                            <div class="text-5xl font-bold text-orange-600">${progress.pretestScore || 0}</div>
                            <p class="text-gray-500">Nilai Akhir</p>
                        </div>
                        <div class="space-y-2">
                            ${parseJSON(pretest?.questions || '[]').map((q, i) => {
                                const answers = parseJSON(progress.pretestAnswers);
                                return `
                                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                        <span class="font-medium">Soal ${i + 1}</span>
                                        <span class="font-bold text-gray-700">${answers[i] ? 'Benar' : 'Salah'}</span>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    `}
                </div>

                <!-- Posttest -->
                <div class="bg-white rounded-2xl card-shadow p-6">
                    <h2 class="text-xl font-bold text-green-600 mb-4">✏️ Nilai Posttest</h2>
                    ${!progress?.posttestDone ? `
                        <div class="text-center py-8 text-gray-400">
                            <div class="text-4xl mb-2">🔒</div>
                            <p>Belum mengerjakan posttest</p>
                        </div>
                    ` : `
                        <div class="text-center mb-6">
                            <div class="text-5xl font-bold text-green-600">${progress.posttestScore || 0}</div>
                            <p class="text-gray-500">Nilai Akhir</p>
                        </div>
                        <div class="space-y-2">
                            ${parseJSON(posttest?.questions || '[]').map((q, i) => {
                                const answers = parseJSON(progress.posttestAnswers);
                                return `
                                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                        <span class="font-medium">Soal ${i + 1}</span>
                                        <span class="font-bold text-gray-700">${answers[i] ? 'Benar' : 'Salah'}</span>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    `}
                </div>
            </div>
        </div>
    `;
}

