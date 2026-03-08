// =============== TEST MANAGER ===============

// Di awal setiap file component, pastikan fungsi didefinisikan secara global
//window.renderTeacherDashboard = renderTeacherDashboard;
//window.renderStudentDashboard = renderStudentDashboard;
window.renderTestManager = renderTestManager;
//indow.renderMateriManager = renderMateriManager;
//window.renderRekapNilai = renderRekapNilai;
//window.renderStudentMateri = renderStudentMateri;
//window.renderStudentNilai = renderStudentNilai;
//window.renderLogin = renderLogin;
//window.exportPretestToExcel = exportPretestToExcel;
//window.exportPosttestToExcel = exportPosttestToExcel;


function renderTestManager(pretest, posttest) {
    return `
        <div class="animate-fade">
            <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-6">✏️ Kelola Pretest & Posttest</h1>
            
            <div class="grid md:grid-cols-2 gap-6">
                <!-- Pretest Card -->
                <div class="bg-white rounded-2xl card-shadow p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-xl font-bold text-orange-600">✏️ Pretest</h2>
                    </div>
                    ${pretest ? renderTestCard(pretest, 'pretest') : renderEmptyTestCard('pretest')}
                </div>

                <!-- Posttest Card -->
                <div class="bg-white rounded-2xl card-shadow p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-xl font-bold text-green-600">✏️ Posttest</h2>
                    </div>
                    ${posttest ? renderTestCard(posttest, 'posttest') : renderEmptyTestCard('posttest')}
                </div>
            </div>
        </div>

        <!-- Modal View Test -->
        ${renderViewTestModal()}
        
        <!-- Modal Test Input (PILIHAN GANDA) -->
        ${renderTestInputModal()}
    `;
}

function renderTestCard(test, type) {
    const questions = parseJSON(test.questions);
    const color = type === 'pretest' ? 'orange' : 'green';
    
    return `
        <div class="mb-4 p-4 bg-${color}-50 rounded-xl">
            <p class="text-sm text-${color}-700 font-semibold">📊 Total Soal: ${questions.length}</p>
            <p class="text-xs text-gray-500 mt-1">Tipe: Pilihan Ganda (A-E)</p>
        </div>
        <div class="flex gap-2 mb-4">
            <button data-view-test="${type}" class="flex-1 px-4 py-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-all text-sm font-medium">👁️ Lihat</button>
            <button data-edit-test="${type}" class="flex-1 px-4 py-2 bg-purple-100 text-purple-600 rounded-xl hover:bg-purple-200 transition-all text-sm font-medium">✏️ Edit</button>
        </div>
        <button data-delete-test="${test.id}" class="w-full py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all font-medium">🗑️ Hapus</button>
    `;
}

function renderEmptyTestCard(type) {
    const color = type === 'pretest' ? 'orange' : 'green';
    const id = type === 'pretest' ? 'addPretest' : 'addPosttest';
    const text = type === 'pretest' ? 'Pretest' : 'Posttest';
    
    return `
        <div class="text-center py-8 text-gray-400">
            <div class="text-4xl mb-2">✏️</div>
            <p class="mb-4">Belum ada ${text}</p>
            <button id="${id}" class="w-full px-6 py-3 bg-${color}-500 text-white font-semibold rounded-xl hover:bg-${color}-600 transition-all">
                + Buat ${text}
            </button>
        </div>
    `;
}

function renderViewTestModal() {
    return `
        <div id="modalViewTest" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-auto">
            <div class="bg-white rounded-2xl w-full max-w-2xl p-6 my-8">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-xl font-bold" id="modalViewTestTitle">Daftar Soal</h3>
                    <button id="closeViewTest" class="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full">✕</button>
                </div>
                <div id="viewTestContainer" class="space-y-4 max-h-[60vh] overflow-y-auto"></div>
            </div>
        </div>
    `;
}

function renderTestInputModal() {
    return `
        <div id="modalTest" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-auto">
            <div class="bg-white rounded-2xl w-full max-w-3xl p-6 my-8 max-h-[90vh] overflow-y-auto">
                <div class="flex items-center justify-between mb-6 sticky top-0 bg-white pb-4 border-b">
                    <h3 class="text-xl font-bold" id="modalTestTitle">Buat Soal Pilihan Ganda</h3>
                    <span class="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold" id="questionCount">0 soal</span>
                </div>
                
                <div id="questionsContainer" class="space-y-6 mb-6"></div>
                
                <button id="addQuestion" class="w-full py-4 border-2 border-dashed border-gray-300 text-gray-600 rounded-xl hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50 transition-all mb-6 font-semibold flex items-center justify-center gap-2">
                    <span class="text-xl">+</span>
                    <span>Tambah Soal</span>
                </button>
                
                <div class="sticky bottom-0 bg-white pt-4 border-t flex gap-3">
                    <button id="cancelTest" class="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all">Batal</button>
                    <button id="saveTest" class="flex-1 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-all">💾 Simpan</button>
                </div>
            </div>
        </div>
    `;
}
