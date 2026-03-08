// =============== SUB MATERI DETAIL DENGAN UPLOAD LKPD ===============
window.renderSubMateriDetail = renderSubMateriDetail;

function renderSubMateriDetail() {
    const sub = state.currentSubMateri;
    const progress = getProgress(state.currentUser.id);
    const completedSubs = progress ? parseJSON(progress.completedSubMateri) : [];
    const isCompleted = completedSubs.includes(sub?.id);
    
    // Ambil data submission LKPD
    const submissions = progress ? parseJSON(progress.lkpdSubmissions) : {};
    const submittedLink = submissions[sub?.id] || '';
    
    if (!sub) {
        state.studentSubView = 'materi';
        render();
        return;
    }

    return `
        <div class="animate-fade max-w-4xl mx-auto px-4 md:px-0">
            <!-- Breadcrumb -->
            <div class="flex flex-wrap items-center gap-2 text-sm mb-6">
                <button onclick="window.handleBackToMateri()" 
                    class="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-all">
                    <span>←</span>
                    <span>Kembali ke Materi</span>
                </button>
            </div>

            <!-- Header Sub Materi -->
            <div class="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 md:p-6 text-white mb-4 shadow-lg">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-xl md:text-2xl font-bold">${escapeHtml(sub.title)}</h1>
                        <p class="text-white/80 mt-1">${escapeHtml(sub.materiTitle || 'Materi')}</p>
                    </div>
                    ${isCompleted ? `
                        <div class="bg-green-500 px-4 py-2 rounded-lg font-semibold flex items-center gap-2">
                            <span>✅</span>
                            <span>Selesai</span>
                        </div>
                    ` : ''}
                </div>
            </div>

            <div class="space-y-6">
                <!-- VIDEO SECTION -->
                ${sub.videoId ? `
                    <div class="bg-white rounded-2xl card-shadow overflow-hidden">
                        <div class="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                            <h2 class="text-lg font-bold flex items-center gap-2">
                                <span>🎬</span>
                                <span>Video Pembelajaran</span>
                            </h2>
                        </div>
                        <div class="p-4">
                            <div class="bg-gray-900 rounded-xl overflow-hidden">
                                <div class="relative" style="padding-bottom: 56.25%;">
                                    <iframe class="absolute top-0 left-0 w-full h-full"
                                        src="https://www.youtube.com/embed/${sub.videoId}?enablejsapi=1&origin=${window.location.origin}"
                                        frameborder="0" allowfullscreen></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                ` : ''}

                <!-- LKPD SECTION DENGAN FORM UPLOAD -->
                ${sub.lkpdTitle ? `
                    <div class="bg-white rounded-2xl card-shadow overflow-hidden">
                        <div class="p-4 border-b bg-gradient-to-r from-amber-50 to-yellow-50">
                            <h2 class="text-lg font-bold flex items-center gap-2">
                                <span>📋</span>
                                <span>LKPD: ${escapeHtml(sub.lkpdTitle)}</span>
                            </h2>
                        </div>
                        
                        <div class="p-4 md:p-6">
                            <div class="bg-amber-50 rounded-xl p-6 border-2 border-amber-200">
                                
                                <!-- DESKRIPSI TUGAS -->
                                <div class="mb-6">
                                    <h3 class="font-semibold text-gray-700 mb-2">Deskripsi Tugas:</h3>
                                    <div class="bg-white p-4 rounded-lg border border-amber-100 whitespace-pre-wrap">
                                        ${escapeHtml(sub.lkpdDescription || 'Tidak ada deskripsi')}
                                    </div>
                                </div>
                                
                                <!-- FORM UPLOAD LINK GDRIVE -->
                                <div class="mb-6">
                                    <h3 class="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <span class="text-lg">📎</span>
                                        <span>Upload Tugas LKPD</span>
                                    </h3>
                                    
                                    <!-- PETUNJUK -->
                                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 text-sm text-blue-700">
                                        <p class="flex items-start gap-2">
                                            <span class="text-lg">💡</span>
                                            <span>
                                                <strong>Petunjuk:</strong><br>
                                                1. Upload file tugas kamu ke Google Drive<br>
                                                2. Klik kanan file → <strong>Bagikan</strong> → <strong>Bagikan</strong><br>
                                                3. Set akses ke <strong>"Siapa pun dengan link"</strong><br>
                                                4. Copy link dan paste di bawah ini
                                            </span>
                                        </p>
                                    </div>
                                    
                                    <!-- INPUT LINK DAN TOMBOL SIMPAN -->
                                    <div class="flex flex-col gap-3">
                                        <label class="block text-sm font-medium text-gray-700">
                                            Link Google Drive
                                        </label>
                                        <div class="flex flex-col md:flex-row gap-3">
                                            <input type="url" 
                                                id="lkpdLinkInput" 
                                                class="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500" 
                                                placeholder="https://drive.google.com/file/d/..."
                                                value="${escapeHtml(submittedLink)}"
                                                ${isCompleted ? 'disabled' : ''}>
                                            <button id="saveLkpdLink" 
                                                    class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all ${isCompleted ? 'opacity-50 cursor-not-allowed' : ''}"
                                                    ${isCompleted ? 'disabled' : ''}>
                                                💾 Simpan Link
                                            </button>
                                        </div>
                                        
                                        <!-- LINK TERSIMPAN - TAMPILKAN JIKA ADA -->
                                        ${submittedLink ? `
                                            <div class="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                                                <p class="text-sm text-green-700 flex items-center gap-2">
                                                    <span>✅</span>
                                                    <span class="font-medium">Link tersimpan:</span>
                                                </p>
                                                <a href="${submittedLink}" target="_blank" 
                                                class="text-sm text-blue-600 hover:underline break-all block mt-1">
                                                    ${submittedLink}
                                                </a>
                                            </div>
                                        ` : ''}
                                    </div>

                                    <!-- TOMBOL SELESAI -->
                                    <div class="border-t border-amber-200 pt-6">
                                        ${!isCompleted ? `
                                            <div class="mb-3 text-sm ${!submittedLink ? 'text-red-500' : 'text-green-600'}">
                                                ${!submittedLink ? 
                                                    '⚠️ Simpan link tugas terlebih dahulu sebelum menandai selesai' : 
                                                    '✓ Link sudah tersimpan, silakan tandai selesai'}
                                            </div>
                                            <button 
                                                id="markCompletedBtn"
                                                class="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all font-semibold inline-flex items-center justify-center gap-3 shadow-lg ${!submittedLink ? 'opacity-50 cursor-not-allowed' : ''}"
                                                ${!submittedLink ? 'disabled' : ''}>
                                                <span class="text-2xl">✅</span>
                                                <span class="text-lg">Tandai Selesai</span>
                                            </button>
                                        ` : `
                                            <div class="flex items-center gap-3 p-4 bg-green-100 text-green-700 rounded-xl">
                                                <span class="text-3xl">✅</span>
                                                <div>
                                                    <p class="font-bold">Tugas Selesai!</p>
                                                    <p class="text-sm break-all">Link: <a href="${submittedLink}" target="_blank" class="underline">${submittedLink}</a></p>
                                                </div>
                                            </div>
                                        `}
                                    </div>
                ` : ''}
                
                <!-- TOMBOL SELESAI (JIKA TIDAK ADA LKPD) -->
                ${!sub.lkpdTitle && !isCompleted ? `
                    <div class="bg-white rounded-2xl card-shadow p-8 text-center">
                        <button onclick="window.handleMarkSubMateriCompleted('${sub.id}')"
                            class="px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 font-semibold">
                            ✅ Tandai Selesai
                        </button>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// =============== EVENT HANDLERS ===============

// Setup listener untuk tombol upload
function setupLkpdUploadListeners() {
    console.log('🔧 Setup LKPD upload listeners');
    
    const saveBtn = document.getElementById('saveLkpdLink');
    const linkInput = document.getElementById('lkpdLinkInput');
    const markBtn = document.getElementById('markCompletedBtn');
    const sub = state.currentSubMateri;
    
    if (!sub) {
        console.log('❌ Sub materi tidak ditemukan di state');
        return;
    }
    
    console.log('📌 Sub materi:', sub.id, sub.title);
    
    // Event listener untuk tombol simpan
    if (saveBtn && linkInput) {
        // Hapus listener lama (pakai clone)
        const newSaveBtn = saveBtn.cloneNode(true);
        saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
        
        newSaveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('➕ Tombol simpan diklik');
            
            const link = linkInput.value.trim();
            console.log('🔗 Link input:', link);
            
            if (!link) {
                showToast('Link tidak boleh kosong', 'error');
                return;
            }
            
            if (!link.includes('drive.google.com')) {
                showToast('Harap masukkan link Google Drive yang valid', 'error');
                return;
            }
            
            // Simpan link
            saveLkpdLink(sub.id, link);
        });
    } else {
        console.log('❌ Tombol simpan atau input tidak ditemukan');
    }
    
    // Event listener untuk tombol tandai selesai
    if (markBtn) {
        // Hapus listener lama
        const newMarkBtn = markBtn.cloneNode(true);
        markBtn.parentNode.replaceChild(newMarkBtn, markBtn);
        
        newMarkBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('✅ Tombol tandai selesai diklik');
            
            const progress = getProgress(state.currentUser.id);
            const submissions = progress ? parseJSON(progress.lkpdSubmissions) : {};
            console.log('📋 Cek submissions:', submissions);
            console.log('🔍 Apakah ada link untuk sub ini?', submissions[sub.id]);
            
            if (!submissions[sub.id]) {
                showToast('Simpan link tugas terlebih dahulu!', 'error');
                return;
            }
            
            window.handleMarkSubMateriCompleted(sub.id);
        });
    }
}

// Fungsi menyimpan link ke database (VERSI DIPERBAIKI)
function saveLkpdLink(subId, link) {
    console.log('💾 Menyimpan link:', link, 'untuk sub:', subId);
    
    const progress = getProgress(state.currentUser.id);
    console.log('📊 Progress sebelum:', progress);
    
    // ========== PERBAIKAN PENTING ==========
    // Ambil submissions yang sudah ada, pastikan berupa OBJECT
    let submissions = {};
    
    if (progress && progress.lkpdSubmissions) {
        try {
            const parsed = JSON.parse(progress.lkpdSubmissions);
            // Jika parsed adalah array, konversi ke object
            if (Array.isArray(parsed)) {
                console.log('⚠️ Data submissions masih array, konversi ke object');
                submissions = {};
                // Jika array berisi link, kita perlu mapping? 
                // Asumsikan array kosong, jadi object kosong
            } else if (typeof parsed === 'object' && parsed !== null) {
                submissions = parsed;
            }
        } catch (e) {
            console.error('❌ Error parsing submissions:', e);
            submissions = {};
        }
    }
    // =======================================
    
    console.log('📋 Submissions sebelum (object):', submissions);
    
    // Update link untuk sub materi ini
    submissions[subId] = link;
    console.log('📋 Submissions setelah:', submissions);
    
    if (progress) {
        // UPDATE PROGRESS YANG SUDAH ADA
        store.update(progress.id, {
            lkpdSubmissions: JSON.stringify(submissions) // Simpan sebagai object
        });
        console.log('✅ Progress diupdate dengan ID:', progress.id);
    } else {
        // BUAT PROGRESS BARU
        store.create({
            type: 'progress',
            studentId: state.currentUser.id,
            completedSubMateri: '[]',
            completedLkpd: '[]',
            lkpdSubmissions: JSON.stringify(submissions), // Simpan sebagai object
            pretestDone: false,
            posttestDone: false
        });
        console.log('✅ Progress baru dibuat');
    }
    
    showToast('Link tugas berhasil disimpan!', 'success');
    
    // Render ulang
    setTimeout(() => {
        console.log('🔄 Render ulang setelah simpan link');
        render();
    }, 100);
}

// Handler kembali ke materi
window.handleBackToMateri = function() {
    state.studentSubView = 'materi';
    state.currentSubMateri = null;
    render();
};

// Handler tandai selesai
window.handleMarkSubMateriCompleted = function(subId) {
    const progress = getProgress(state.currentUser.id);
    const completedSubs = progress ? parseJSON(progress.completedSubMateri) : [];
    const completedLkpd = progress ? parseJSON(progress.completedLkpd) : [];

    if (!completedSubs.includes(subId)) {
        completedSubs.push(subId);
    }
    
    const sub = store.getById(subId);
    if (sub?.lkpdTitle && !completedLkpd.includes(subId)) {
        completedLkpd.push(subId);
    }

    if (progress) {
        store.update(progress.id, {
            completedSubMateri: JSON.stringify(completedSubs),
            completedLkpd: JSON.stringify(completedLkpd)
        });
    } else {
        store.create({
            type: 'progress',
            studentId: state.currentUser.id,
            completedSubMateri: JSON.stringify(completedSubs),
            completedLkpd: JSON.stringify(completedLkpd),
            lkpdSubmissions: '{}',
            pretestDone: false,
            posttestDone: false
        });
    }
    
    showToast('Sub materi ditandai selesai!');
    setTimeout(() => render(), 100);
};

// Helper
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
// Tambahkan fungsi ini untuk debugging
// =============== FUNGSI DEBUGGING LANJUTAN ===============
function cekProgressSiswa() {
    console.log('========== DEBUG PROGRESS SISWA ==========');
    console.log('👤 Current User:', state.currentUser);
    
    const progress = getProgress(state.currentUser?.id);
    console.log('📊 Data Progress Lengkap:', progress);
    
    if (progress) {
        // Cek tipe data lkpdSubmissions
        console.log('📋 lkpdSubmissions (raw):', progress.lkpdSubmissions);
        
        let submissions;
        try {
            submissions = JSON.parse(progress.lkpdSubmissions || '{}');
            console.log('📋 lkpdSubmissions (parsed):', submissions);
            console.log('📋 Tipe data:', Array.isArray(submissions) ? 'ARRAY' : 'OBJECT');
        } catch (e) {
            console.error('❌ Error parsing:', e);
            submissions = {};
        }
        
        console.log('✅ completedLkpd:', parseJSON(progress.completedLkpd));
        console.log('📚 completedSubMateri:', parseJSON(progress.completedSubMateri));
        
        // Cek untuk sub materi saat ini
        if (state.currentSubMateri) {
            console.log('🔗 Link untuk sub ini:', submissions[state.currentSubMateri.id]);
            console.log('🔑 Key:', state.currentSubMateri.id);
            console.log('📋 Semua keys:', Object.keys(submissions));
        }
        
        // Test simpan ulang
        console.log('💡 Untuk reset submissions, ketik: resetSubmissions()');
    } else {
        console.log('❌ Belum ada progress untuk siswa ini');
    }
    console.log('==========================================');
}

// Fungsi untuk reset submissions (jika perlu)
window.resetSubmissions = function() {
    const progress = getProgress(state.currentUser?.id);
    if (progress) {
        store.update(progress.id, {
            lkpdSubmissions: '{}'
        });
        console.log('✅ Submissions direset ke object kosong');
        render();
    }
};

window.cekProgressSiswa = cekProgressSiswa;

// Panggil di console browser untuk cek: cekProgressSiswa()
window.cekProgressSiswa = cekProgressSiswa;