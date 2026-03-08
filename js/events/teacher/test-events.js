// =============== TEST EVENT LISTENERS ===============
function attachTestEventListeners() {
    // Open test modals
    document.getElementById('addPretest')?.addEventListener('click', () => openTestModal('pretest'));
    document.getElementById('addPosttest')?.addEventListener('click', () => openTestModal('posttest'));

    // Update di attachTestEventListeners bagian view test
    document.querySelectorAll('[data-view-test]').forEach(btn => {
        btn.addEventListener('click', () => {
            const testType = btn.dataset.viewTest;
            const test = getTests().find(t => t.testType === testType);
            if (test) {
                const questions = parseJSON(test.questions);
                document.getElementById('modalViewTestTitle').textContent = 
                    testType === 'pretest' ? 'Soal Pretest (Pilihan Ganda)' : 'Soal Posttest (Pilihan Ganda)';
                
                document.getElementById('viewTestContainer').innerHTML = questions.map((q, i) => `
                    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border-l-4 border-purple-500">
                        <p class="font-bold text-gray-800 mb-3">${i + 1}. ${escapeHtml(q.question)}</p>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                            ${q.options.map((opt, idx) => {
                                const letter = ['A', 'B', 'C', 'D', 'E'][idx];
                                return `
                                    <div class="flex items-center gap-2 p-2 ${q.answer === letter ? 'bg-green-100 rounded-lg' : ''}">
                                        <span class="w-6 h-6 ${q.answer === letter ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'} rounded-full flex items-center justify-center text-xs font-bold">
                                            ${letter}
                                        </span>
                                        <span class="text-gray-700">${escapeHtml(opt) || '(kosong)'}</span>
                                        ${q.answer === letter ? '<span class="text-green-600 text-xs ml-2">✓ Jawaban Benar</span>' : ''}
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `).join('');
                
                document.getElementById('modalViewTest').classList.remove('hidden');
            }
        });
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
    // Di dalam attachTestEventListeners()
    document.getElementById('addQuestion')?.addEventListener('click', () => {
        console.log('➕ Tambah soal diklik'); // Tambahkan log untuk debugging
        state.testQuestions.push({ 
            question: '', 
            options: ['', '', '', '', ''],
            answer: 'A'
        });
        renderTestQuestions();
    });

    // Cancel test
    document.getElementById('cancelTest')?.addEventListener('click', () => {
        document.getElementById('modalTest').classList.add('hidden');
    });

    // Save test
    document.getElementById('saveTest')?.addEventListener('click', () => {
        const validQuestions = state.testQuestions.filter(q => q.question.trim());
        if (validQuestions.length === 0) {
            showToast('Tambahkan minimal 1 soal', 'error');
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
        <div class="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-purple-300 transition-all">
            <!-- Header Soal -->
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                    <span class="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center font-bold">${i + 1}</span>
                    <span class="font-semibold text-gray-700">Soal Pilihan Ganda</span>
                </div>
                ${state.testQuestions.length > 1 ? `
                    <button data-remove-q="${i}" class="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all" title="Hapus soal">
                        🗑️ Hapus
                    </button>
                ` : ''}
            </div>
            
            <!-- Input Pertanyaan -->
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Pertanyaan</label>
                <textarea data-q-text="${i}" 
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500" 
                    rows="2" 
                    placeholder="Masukkan pertanyaan...">${escapeHtml(q.question)}</textarea>
            </div>
            
            <!-- Opsi Pilihan Ganda A-E -->
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-3">Pilihan Jawaban</label>
                <div class="space-y-3">
                    ${['A', 'B', 'C', 'D', 'E'].map((letter, optIdx) => `
                        <div class="flex items-center gap-3">
                            <span class="w-8 h-8 ${q.answer === letter ? 'bg-green-600' : 'bg-gray-200'} rounded-lg flex items-center justify-center font-bold ${q.answer === letter ? 'text-white' : 'text-gray-600'}">
                                ${letter}
                            </span>
                            <input type="text" 
                                data-q-option="${i}" 
                                data-option-index="${optIdx}"
                                value="${escapeHtml(q.options[optIdx] || '')}"
                                class="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500" 
                                placeholder="Opsi ${letter}...">
                            <input type="radio" 
                                name="answer${i}" 
                                value="${letter}" 
                                ${q.answer === letter ? 'checked' : ''}
                                data-q-ans="${i}"
                                class="w-5 h-5 text-green-600 focus:ring-green-500"
                                title="Jadikan sebagai jawaban benar">
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Petunjuk -->
            <div class="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg">
                <span class="font-semibold text-blue-600">📌 Petunjuk:</span> 
                Isi semua opsi A-E, lalu pilih radio button pada jawaban yang benar.
            </div>
        </div>
    `).join('');

    document.getElementById('questionCount').textContent = state.testQuestions.length + ' soal';

    // Event listener untuk input pertanyaan
    container.querySelectorAll('[data-q-text]').forEach(input => {
        input.addEventListener('input', (e) => {
            state.testQuestions[parseInt(e.target.dataset.qText)].question = e.target.value;
        });
    });

    // Event listener untuk input opsi
    container.querySelectorAll('[data-q-option]').forEach(input => {
        input.addEventListener('input', (e) => {
            const qIndex = parseInt(e.target.dataset.qOption);
            const optIndex = parseInt(e.target.dataset.optionIndex);
            state.testQuestions[qIndex].options[optIndex] = e.target.value;
        });
    });

    // Event listener untuk radio button jawaban
    container.querySelectorAll('[data-q-ans]').forEach(input => {
        input.addEventListener('change', (e) => {
            const qIndex = parseInt(e.target.dataset.qAns);
            state.testQuestions[qIndex].answer = e.target.value;
            
            // Update visual warna huruf
            const parentDiv = e.target.closest('.space-y-3');
            if (parentDiv) {
                parentDiv.querySelectorAll('span:first-child').forEach((span, idx) => {
                    const letter = ['A', 'B', 'C', 'D', 'E'][idx];
                    if (letter === e.target.value) {
                        span.classList.remove('bg-gray-200', 'text-gray-600');
                        span.classList.add('bg-green-600', 'text-white');
                    } else {
                        span.classList.remove('bg-green-600', 'text-white');
                        span.classList.add('bg-gray-200', 'text-gray-600');
                    }
                });
            }
        });
    });

    // Event listener untuk hapus soal
    container.querySelectorAll('[data-remove-q]').forEach(btn => {
        btn.addEventListener('click', () => {
            state.testQuestions.splice(parseInt(btn.dataset.removeQ), 1);
            renderTestQuestions();
        });
    });

        // PASTIKAN EVENT LISTENER UNTUK TAMBAH SOAL TETAP AKTIF
    setTimeout(() => {
        const addBtn = document.getElementById('addQuestion');
        if (addBtn) {
            // Hapus listener lama dulu (pakai cloneNode)
            const newAddBtn = addBtn.cloneNode(true);
            addBtn.parentNode.replaceChild(newAddBtn, addBtn);
            
            // Pasang listener baru
            newAddBtn.addEventListener('click', () => {
                console.log('➕ Tambah soal diklik (dari render)');
                state.testQuestions.push({ 
                    question: '', 
                    options: ['', '', '', '', ''],
                    answer: 'A'
                });
                renderTestQuestions();
            });
        }
    }, 0);

}

function openTestModal(type) {
    state.currentTestType = type;
    state.testQuestions = [{ 
        question: '', 
        options: ['', '', '', '', ''], // 5 opsi kosong
        answer: 'A' // Default jawaban A
    }];
    state.editingTest = null;
    document.getElementById('modalTestTitle').textContent = `Buat ${type === 'pretest' ? 'Pretest' : 'Posttest'} (Pilihan Ganda)`;
    renderTestQuestions();
    document.getElementById('modalTest').classList.remove('hidden');
}