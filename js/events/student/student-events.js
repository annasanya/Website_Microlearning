// =============== STUDENT EVENT LISTENERS ===============

function attachStudentEventListeners() {
    console.log('📢 Attaching student event listeners');
    
    // Handler untuk button sub materi
    document.querySelectorAll('.sub-materi-btn:not([disabled])').forEach(btn => {
        btn.removeEventListener('click', handleSubMateriClick);
        btn.addEventListener('click', handleSubMateriClick);
    });

    // Start test - PRETEST & POSTTEST
    document.querySelectorAll('[data-start-test]').forEach(btn => {
        btn.removeEventListener('click', handleStartTest);
        btn.addEventListener('click', handleStartTest);
        console.log('🎯 Test button found:', btn.dataset.startTest);
    });
}

// =============== EVENT HANDLERS ===============

function handleSubMateriClick(e) {
    e.preventDefault();
    const btn = e.currentTarget;
    const subDataAttr = btn.dataset.subMateri;
    
    try {
        const subData = JSON.parse(subDataAttr.replace(/&apos;/g, "'"));
        state.currentSubMateri = subData;
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
    console.log('🎯 Starting test:', testType);
    
    const test = getTests().find(t => t.testType === testType);
    
    if (test) {
        state.currentStudentTest = test;
        const questions = parseJSON(test.questions);
        state.studentAnswers = new Array(questions.length).fill(null);
        
        // Hapus modal lama jika ada
        const oldModal = document.getElementById('testModal');
        if (oldModal) {
            oldModal.remove();
        }
        
        renderTestModal(testType, questions);
    } else {
        showToast('Soal belum tersedia', 'error');
    }
}

function renderTestModal(testType, questions) {
    console.log('📊 Rendering test modal with', questions.length, 'pilihan ganda');
    
    // Hapus modal lama
    closeAllModals();
    
    const modalId = 'testModal_' + Date.now();
    
    const modalHtml = `
        <div id="${modalId}" class="test-modal-wrapper fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 overflow-auto">
            <div class="bg-white rounded-2xl w-full max-w-3xl p-6 my-8 max-h-[90vh] overflow-y-auto relative">
                <!-- Tombol Close -->
                <button class="close-test-modal absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-all z-10">
                    ✕
                </button>
                
                <div class="flex items-center justify-between mb-6 pr-8">
                    <h3 class="text-xl font-bold">${testType === 'pretest' ? '✏️ Pretest' : '✏️ Posttest'}</h3>
                    <span class="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">
                        ${questions.length} Soal Pilihan Ganda
                    </span>
                </div>
                
                <div class="test-questions space-y-6">
                    ${questions.map((q, i) => `
                        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border-l-4 border-purple-500">
                            <div class="flex items-start justify-between mb-4">
                                <p class="font-bold text-gray-800">Soal ${i + 1}</p>
                                <span class="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded font-semibold">${i + 1}/${questions.length}</span>
                            </div>
                            
                            <p class="text-lg font-semibold text-gray-800 mb-4">${escapeHtml(q.question)}</p>
                            
                            <div class="space-y-3">
                                ${q.options.map((opt, optIdx) => {
                                    const letter = ['A', 'B', 'C', 'D', 'E'][optIdx];
                                    return opt ? `
                                        <label class="flex items-center gap-3 p-4 rounded-xl border-2 border-transparent cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all bg-white">
                                            <input type="radio" 
                                                name="studentAns${i}" 
                                                value="${letter}" 
                                                data-student-ans="${i}" 
                                                class="w-5 h-5 text-purple-600 focus:ring-purple-500">
                                            <span class="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold text-sm">
                                                ${letter}
                                            </span>
                                            <span class="flex-1 text-gray-700">${escapeHtml(opt)}</span>
                                        </label>
                                    ` : '';
                                }).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <button class="submit-test-btn w-full mt-6 py-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all text-lg">
                    ✓ Kirim Jawaban
                </button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Simpan ID modal ke state
    state.currentModalId = modalId;
    
    // Event listeners
    const modalWrapper = document.getElementById(modalId);
    
    // Tombol close
    modalWrapper.querySelector('.close-test-modal').addEventListener('click', () => {
        modalWrapper.remove();
    });
    
    // Klik di luar
    modalWrapper.addEventListener('click', (e) => {
        if (e.target === modalWrapper) {
            modalWrapper.remove();
        }
    });
    
    // Radio buttons
    modalWrapper.querySelectorAll('[data-student-ans]').forEach(input => {
        input.addEventListener('change', (e) => {
            const index = parseInt(e.target.dataset.studentAns);
            if (!isNaN(index)) {
                state.studentAnswers[index] = e.target.value; // Simpan huruf (A, B, C, D, E)
            }
        });
    });
    
    // Submit button
    modalWrapper.querySelector('.submit-test-btn').addEventListener('click', submitTest);
}

// Fungsi untuk menutup semua modal
function closeAllModals() {
    // Hapus semua modal wrapper
    document.querySelectorAll('.test-modal-wrapper, [id^="testModal_"], #testModal').forEach(el => {
        el.remove();
    });
}

// Fungsi submit test (VERSI SUPER PASTI TUTUP)
function submitTest() {
    console.log('📤 Submitting test...');
    
    // Cek apakah semua soal sudah dijawab
    if (state.studentAnswers.includes(null) || state.studentAnswers.includes(undefined)) {
        showToast('Jawab semua soal terlebih dahulu', 'error');
        return;
    }

    const questions = parseJSON(state.currentStudentTest.questions);
    let correct = 0;
    
    questions.forEach((q, i) => {
        // Bandingkan jawaban siswa (huruf) dengan jawaban benar (huruf)
        if (state.studentAnswers[i] === q.answer) {
            correct++;
        }
    });
    
    const score = Math.round((correct / questions.length) * 100);
    const isPretest = state.currentStudentTest.testType === 'pretest';

    console.log(`✅ Score: ${score}, Correct: ${correct}/${questions.length}`);

    const progress = getProgress(state.currentUser.id);
    
    const updateData = {
        ...(progress || {
            type: 'progress',
            studentId: state.currentUser.id,
            completedSubMateri: '[]',
            completedLkpd: '[]'
        }),
        [isPretest ? 'pretestDone' : 'posttestDone']: true,
        [isPretest ? 'pretestAnswers' : 'posttestAnswers']: JSON.stringify(state.studentAnswers), // Simpan array huruf
        [isPretest ? 'pretestScore' : 'posttestScore']: score
    };

    // Simpan data
    if (progress) {
        store.update(progress.id, updateData);
    } else {
        store.create(updateData);
    }

    // Tutup semua modal
    closeAllModals();
    
    // Tampilkan toast hasil
    showToast(`${isPretest ? 'Pretest' : 'Posttest'} selesai! Nilai: ${score}`, 'success');
    
    // Kembalikan ke halaman materi
    state.studentSubView = 'materi';
    
    // Render ulang
    setTimeout(() => {
        if (typeof render === 'function') {
            render();
        }
    }, 50);

    // ===== CARA BRUTAL MENUTUP SEMUA MODAL =====
    
    // Cara 1: Hapus berdasarkan ID
    const modalById = document.getElementById('testModal');
    if (modalById) {
        modalById.remove();
        console.log('✅ Modal by ID dihapus');
    }
    
    // Cara 2: Hapus semua elemen dengan class backdrop
    document.querySelectorAll('.fixed.inset-0.bg-black\\/50').forEach(el => {
        if (el.id === 'testModal' || el.querySelector('#testModal')) {
            el.remove();
            console.log('✅ Modal by class dihapus');
        }
    });
    
    // Cara 3: Hapus semua modal yang mungkin ada
    document.querySelectorAll('div[id="testModal"]').forEach(el => {
        el.remove();
        console.log('✅ Modal by selector dihapus');
    });
    
    // Cara 4: Hapus dari body langsung (paling brutal)
    const allModals = Array.from(document.body.children).filter(child => 
        child.id === 'testModal' || 
        (child.className && child.className.includes('fixed') && child.className.includes('inset-0'))
    );
    
    allModals.forEach(modal => {
        modal.remove();
        console.log('✅ Modal brutal dihapus');
    });
    
    // TAMPILKAN TOAST HASIL
    showToast(`${isPretest ? 'Pretest' : 'Posttest'} selesai! Nilai: ${score}`, 'success');
    
    // KEMBALIKAN KE HALAMAN MATERI
    state.studentSubView = 'materi';
    
    // Render ulang dengan delay
    setTimeout(() => {
        if (typeof render === 'function') {
            render();
        }
    }, 50);

}
// Fungsi helper untuk escape HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}