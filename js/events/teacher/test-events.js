// =============== TEST EVENT LISTENERS ===============
function attachTestEventListeners() {
    // Open test modals
    document.getElementById('addPretest')?.addEventListener('click', () => openTestModal('pretest'));
    document.getElementById('addPosttest')?.addEventListener('click', () => openTestModal('posttest'));

    // View test
    document.querySelectorAll('[data-view-test]').forEach(btn => {
        btn.addEventListener('click', () => {
            const testType = btn.dataset.viewTest;
            const test = getTests().find(t => t.testType === testType);
            if (test) {
                const questions = parseJSON(test.questions);
                document.getElementById('modalViewTestTitle').textContent = testType === 'pretest' ? 'Soal Pretest' : 'Soal Posttest';
                document.getElementById('viewTestContainer').innerHTML = questions.map((q, i) => `
                    <div class="bg-gray-50 rounded-xl p-4 border-l-4 border-purple-500">
                        <p class="font-semibold text-gray-800 mb-2">${i + 1}. ${q.question}</p>
                        <div class="ml-4 space-y-1">
                            ${q.options.map((opt, optIdx) => `
                                <div class="flex items-center gap-2 ${q.answer === optIdx ? 'text-green-600 font-semibold' : 'text-gray-600'}">
                                    <span>${String.fromCharCode(65 + optIdx)}.</span>
                                    <span>${opt}</span>
                                    ${q.answer === optIdx ? ' ✓' : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('');
                document.getElementById('modalViewTest').classList.remove('hidden');
            }
        });
    });

    document.getElementById('closeViewTest')?.addEventListener('click', () => {
        document.getElementById('modalViewTest').classList.add('hidden');
    });

    // Edit test
    document.querySelectorAll('[data-edit-test]').forEach(btn => {
        btn.addEventListener('click', () => {
            const testType = btn.dataset.editTest;
            const test = getTests().find(t => t.testType === testType);
            if (test) {
                state.currentTestType = testType;
                state.testQuestions = parseJSON(test.questions);
                state.editingTest = test;
                document.getElementById('modalTestTitle').textContent = `Edit ${testType === 'pretest' ? 'Pretest' : 'Posttest'}`;
                renderTestQuestions();
                document.getElementById('modalTest').classList.remove('hidden');
            }
        });
    });

    // Delete test
    document.querySelectorAll('[data-delete-test]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const testId = e.currentTarget.dataset.deleteTest;
            store.delete(testId);
            showToast('Soal dihapus');
        });
    });

    // Add question
    document.getElementById('addQuestion')?.addEventListener('click', () => {
        state.testQuestions.push({ 
            question: '', 
            options: ['', '', '', ''],
            answer: 0 // index jawaban yang benar (0,1,2,3)
        });
        renderTestQuestions();
    });

    // Cancel test
    document.getElementById('cancelTest')?.addEventListener('click', () => {
        document.getElementById('modalTest').classList.add('hidden');
    });

    // Save test
    document.getElementById('saveTest')?.addEventListener('click', () => {
        // Validasi semua soal terisi
        const validQuestions = state.testQuestions.filter(q => 
            q.question.trim() && 
            q.options.every(opt => opt.trim()) &&
            q.answer !== undefined
        );
        
        if (validQuestions.length === 0) {
            showToast('Tambahkan minimal 1 soal dengan semua field terisi', 'error');
            return;
        }

        const data = {
            type: 'test',
            testType: state.currentTestType,
            questions: JSON.stringify(validQuestions)
        };

        if (state.editingTest) {
            store.update(state.editingTest.id, data);
        } else {
            store.create(data);
        }

        document.getElementById('modalTest').classList.add('hidden');
        showToast('Soal disimpan');
    });
}

function renderTestQuestions() {
    const container = document.getElementById('questionsContainer');
    if (!container) return;

    container.innerHTML = state.testQuestions.map((q, i) => `
        <div class="bg-white border border-gray-200 rounded-xl p-4">
            <div class="flex items-center justify-between mb-3">
                <span class="font-semibold text-gray-700 px-3 py-1 bg-purple-100 rounded-lg">${i + 1}</span>
                ${state.testQuestions.length > 1 ? `
                    <button data-remove-q="${i}" class="text-red-500 hover:text-red-700 font-bold">✕</button>
                ` : ''}
            </div>
            
            <textarea data-q-text="${i}" class="w-full px-4 py-3 border border-gray-200 rounded-xl mb-4 focus:ring-2 focus:ring-purple-500" 
                rows="2" placeholder="Masukkan pertanyaan">${q.question}</textarea>
            
            <div class="space-y-3 mb-4">
                ${q.options.map((opt, optIdx) => `
                    <div class="flex items-center gap-3">
                        <span class="font-semibold text-gray-600 w-6">${String.fromCharCode(65 + optIdx)}.</span>
                        <input type="text" data-q-opt="${i},${optIdx}" value="${opt}" 
                            class="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500" 
                            placeholder="Opsi ${String.fromCharCode(65 + optIdx)}">
                        <input type="radio" name="correctAnswer${i}" value="${optIdx}" ${q.answer === optIdx ? 'checked' : ''}
                            data-q-correct="${i}" class="w-4 h-4 text-green-600">
                    </div>
                `).join('')}
            </div>
            
            <p class="text-xs text-gray-400 mt-2">✓ Centang radio button pada jawaban yang benar</p>
        </div>
    `).join('');

    document.getElementById('questionCount').textContent = state.testQuestions.length + ' soal';

    // Event listeners untuk pertanyaan
    container.querySelectorAll('[data-q-text]').forEach(input => {
        input.addEventListener('input', (e) => {
            state.testQuestions[parseInt(e.target.dataset.qText)].question = e.target.value;
        });
    });

    // Event listeners untuk opsi jawaban
    container.querySelectorAll('[data-q-opt]').forEach(input => {
        input.addEventListener('input', (e) => {
            const [qIdx, optIdx] = e.target.dataset.qOpt.split(',').map(Number);
            state.testQuestions[qIdx].options[optIdx] = e.target.value;
        });
    });

    // Event listeners untuk jawaban benar
    container.querySelectorAll('[data-q-correct]').forEach(input => {
        input.addEventListener('change', (e) => {
            const qIdx = parseInt(e.target.dataset.qCorrect);
            state.testQuestions[qIdx].answer = parseInt(e.target.value);
        });
    });

    // Event listeners untuk hapus soal
    container.querySelectorAll('[data-remove-q]').forEach(btn => {
        btn.addEventListener('click', () => {
            state.testQuestions.splice(parseInt(btn.dataset.removeQ), 1);
            renderTestQuestions();
        });
    });
}

function openTestModal(type) {
    state.currentTestType = type;
    state.testQuestions = [{ 
        question: '', 
        options: ['', '', '', ''],
        answer: 0 
    }];
    state.editingTest = null;
    document.getElementById('modalTestTitle').textContent = `Buat ${type === 'pretest' ? 'Pretest' : 'Posttest'}`;
    renderTestQuestions();
    document.getElementById('modalTest').classList.remove('hidden');
}