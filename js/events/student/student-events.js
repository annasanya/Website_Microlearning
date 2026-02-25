// =============== STUDENT EVENT LISTENERS ===============

function attachStudentEventListeners() {
    // Handler untuk button sub materi - redirect ke halaman detail
    document.querySelectorAll('.sub-materi-btn:not([disabled])').forEach(btn => {
        btn.removeEventListener('click', handleSubMateriClick);
        btn.addEventListener('click', handleSubMateriClick);
    });

    // Start test
    document.querySelectorAll('[data-start-test]').forEach(btn => {
        btn.removeEventListener('click', handleStartTest);
        btn.addEventListener('click', handleStartTest);
    });
}

// =============== EVENT HANDLERS ===============

function handleSubMateriClick(e) {
    e.preventDefault();
    const btn = e.currentTarget;
    const subDataAttr = btn.dataset.subMateri;
    
    try {
        const subData = JSON.parse(subDataAttr.replace(/&apos;/g, "'"));
        
        // Simpan data sub materi ke state
        state.currentSubMateri = subData;
        
        // Redirect ke halaman detail sub materi
        state.studentSubView = 'sub-materi-detail';
        render();
        
    } catch (error) {
        console.error('Error parsing sub materi data:', error);
        showToast('Gagal membuka materi', 'error');
    }
}

function handleStartTest(e) {
    e.preventDefault();
    const btn = e.currentTarget;
    const testType = btn.dataset.startTest;
    const test = getTests().find(t => t.testType === testType);
    
    if (test) {
        state.currentStudentTest = test;
        const questions = parseJSON(test.questions);
        state.studentAnswers = new Array(questions.length).fill(null);
        
        // Hapus modal lama jika ada
        const oldModal = document.getElementById('testModal');
        if (oldModal) oldModal.remove();
        
        renderTestModal(testType, questions);
    }
}

function renderTestModal(testType, questions) {
    const modalHtml = `
        <div id="testModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-auto">
            <div class="bg-white rounded-2xl w-full max-w-2xl p-6 my-8 max-h-[90vh] overflow-y-auto">
                <div class="flex items-center justify-between mb-6 sticky top-0 bg-white pb-4 border-b">
                    <h3 class="text-xl font-bold">${testType === 'pretest' ? 'Pretest' : 'Posttest'}</h3>
                    <button id="closeTestModal" class="text-gray-500 hover:text-gray-700 text-2xl font-bold">✕</button>
                </div>
                <div id="testQuestions" class="space-y-6">
                    ${questions.map((q, i) => `
                        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border-l-4 border-purple-500">
                            <div class="flex items-start justify-between mb-3">
                                <p class="font-bold text-gray-800">Soal ${i + 1}</p>
                                <span class="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded font-semibold">${i + 1}/${questions.length}</span>
                            </div>
                            <p class="text-lg font-semibold text-gray-800 mb-4">${escapeHtml(q.question)}</p>
                            <div class="space-y-3">
                                ${q.options.map((opt, optIdx) => `
                                    <label class="flex items-center gap-3 p-3 rounded-lg border-2 border-transparent cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all">
                                        <input type="radio" name="studentAns${i}" value="${optIdx}" data-student-ans="${i}" class="w-5 h-5 text-purple-600">
                                        <span class="font-semibold text-gray-700">${String.fromCharCode(65 + optIdx)}. ${escapeHtml(opt)}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button id="submitTest" class="w-full mt-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all">
                    ✓ Kirim Jawaban
                </button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Event listeners untuk modal test
    document.getElementById('closeTestModal')?.addEventListener('click', () => {
        document.getElementById('testModal')?.remove();
    });
    
    document.querySelectorAll('[data-student-ans]').forEach(input => {
        input.addEventListener('change', (e) => {
            const index = parseInt(e.target.dataset.studentAns);
            if (!isNaN(index)) {
                state.studentAnswers[index] = parseInt(e.target.value);
            }
        });
    });
    
    document.getElementById('submitTest')?.addEventListener('click', submitTest);
}

function submitTest() {
    if (state.studentAnswers.includes(null)) {
        showToast('Jawab semua soal terlebih dahulu', 'error');
        return;
    }

    const questions = parseJSON(state.currentStudentTest.questions);
    let correct = 0;
    questions.forEach((q, i) => {
        if (state.studentAnswers[i] === q.answer) correct++;
    });
    const score = Math.round((correct / questions.length) * 100);

    const progress = getProgress(state.currentUser.id);
    const isPretest = state.currentStudentTest.testType === 'pretest';

    const updateData = {
        ...(progress || {
            type: 'progress',
            studentId: state.currentUser.id,
            completedSubMateri: '[]',
            completedLkpd: '[]'
        }),
        [isPretest ? 'pretestDone' : 'posttestDone']: true,
        [isPretest ? 'pretestAnswers' : 'posttestAnswers']: JSON.stringify(state.studentAnswers),
        [isPretest ? 'pretestScore' : 'posttestScore']: score
    };

    if (progress) {
        store.update(progress.id, updateData);
    } else {
        store.create(updateData);
    }

    document.getElementById('testModal')?.remove();
    showToast(`${isPretest ? 'Pretest' : 'Posttest'} selesai! Nilai: ${score}`);
    
    setTimeout(() => {
        if (typeof render === 'function') {
            render();
        }
    }, 100);
}

// Fungsi helper untuk escape HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}