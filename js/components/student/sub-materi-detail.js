// =============== SUB MATERI DETAIL ===============
window.renderSubMateriDetail = renderSubMateriDetail;

function renderSubMateriDetail() {
    const sub = state.currentSubMateri;
    const progress = getProgress(state.currentUser.id);
    const completedSubs = progress ? parseJSON(progress.completedSubMateri) : [];
    const isCompleted = completedSubs.includes(sub?.id);
    
    // Ambil link yang sudah disimpan (kalau ada)
    const savedLink = progress?.lkpdLinks ? parseJSON(progress.lkpdLinks)[sub.id] : '';

    // Jika tidak ada data sub materi, kembali ke halaman materi
    if (!sub) {
        state.studentSubView = 'materi';
        render();
        return;
    }

    return `
        <div class="animate-fade max-w-4xl mx-auto px-4 md:px-0">
            <!-- Breadcrumb Navigation -->
            <div class="flex flex-wrap items-center gap-2 text-sm mb-6">
                <button onclick="window.handleBackToMateri()" 
                class="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-all hover:gap-3 shadow-sm">
                    <span>←</span>
                    <span>Kembali ke Materi</span>
                </button>
            </div>

            <!-- Header Sub Materi - FINAL OPTIMIZED VERSION -->
<div class="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl md:rounded-2xl p-3 md:p-6 text-white mb-3 md:mb-4 shadow-lg">
    <div class="flex items-center gap-2 md:gap-4">
        <!-- Icon - lebih kecil di mobile -->
        <div class="w-10 h-10 md:w-16 md:h-16 bg-white/20 rounded-lg md:rounded-xl flex items-center justify-center text-xl md:text-3xl backdrop-blur flex-shrink-0">
            📖
        </div>
        
        <!-- Container untuk judul dan status -->
        <div class="flex-1 min-w-0 flex items-start justify-between gap-2">
            <!-- Judul dan materi -->
            <div class="flex-1 min-w-0">
                <h1 class="text-sm md:text-xl font-bold break-words line-clamp-2 leading-tight md:leading-normal">
                    ${escapeHtml(sub.title)}
                </h1>
                <div class="flex items-center gap-1 mt-0.5 md:mt-1">
                    <span class="text-[10px] md:text-xs bg-white/10 px-1.5 md:px-2 py-0.5 md:py-1 rounded-full truncate max-w-[150px] md:max-w-none">
                        📚 ${escapeHtml(sub.materiTitle || 'Materi')}
                    </span>
                </div>
            </div>
            
            <!-- Status Badge - sangat compact di mobile -->
            <div class="flex-shrink-0">
                ${isCompleted ? `
                    <div class="bg-green-500 px-2 py-1 md:px-4 md:py-2 rounded-lg md:rounded-xl font-semibold flex items-center gap-0.5 md:gap-1 shadow-md">
                        <span class="text-xs md:text-base">✅</span>
                        <span class="text-[10px] md:text-sm whitespace-nowrap hidden xs:inline">Selesai</span>
                        <span class="text-[10px] md:text-sm whitespace-nowrap inline xs:hidden">✓</span>
                    </div>
                ` : `
                    <div class="bg-yellow-500 px-2 py-1 md:px-4 md:py-2 rounded-lg md:rounded-xl font-semibold flex items-center gap-0.5 md:gap-1 shadow-md">
                        <span class="text-xs md:text-base">🔓</span>
                        <span class="text-[10px] md:text-sm whitespace-nowrap hidden xs:inline">Belum</span>
                        <span class="text-[10px] md:text-sm whitespace-nowrap inline xs:hidden">🔓</span>
                    </div>
                `}
            </div>
        </div>
    </div>
</div>

            <div class="space-y-6">
                <!-- Video Section -->
                ${sub.videoId ? `
                    <div class="bg-white rounded-2xl card-shadow overflow-hidden">
                        <div class="p-4 md:p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                            <h2 class="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
                                <span class="text-2xl">🎬</span>
                                <span>Video</span>
                                <span class="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full ml-2">${escapeHtml(sub.title)}</span>
                            </h2>
                        </div>
                        <div class="p-4 md:p-6">
                            <div class="bg-gray-900 rounded-xl overflow-hidden shadow-xl">
                                <div class="relative" style="padding-bottom: 56.25%;">
                                    <iframe 
                                        class="absolute top-0 left-0 w-full h-full"
                                        src="https://www.youtube.com/embed/${sub.videoId}?enablejsapi=1&origin=${window.location.origin}"
                                        frameborder="0"
                                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowfullscreen
                                        title="Video Pembelajaran: ${escapeHtml(sub.title)}">
                                    </iframe>
                                </div>
                            </div>
                            <p class="text-sm text-gray-500 mt-3 flex items-center gap-2">
                                <span>📺</span>
                                <span>Klik play untuk memulai video pembelajaran</span>
                            </p>
                        </div>
                    </div>
                ` : ''}

                <!-- LKPD Section dengan Form Upload Link -->
                ${sub.lkpdTitle ? `
                    <div class="bg-white rounded-2xl card-shadow overflow-hidden">
                        <div class="p-4 md:p-6 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-yellow-50">
                            <h2 class="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
                                <span class="text-2xl">📋</span>
                                <span>LKPD</span>
                                <span class="text-xs px-2 py-1 bg-amber-100 text-amber-600 rounded-full ml-2">${escapeHtml(sub.title)}</span>
                            </h2>
                        </div>
                        <div class="p-4 md:p-6">
                            <div class="bg-amber-50 rounded-xl p-6 border-2 border-amber-200">
                                <!-- Deskripsi LKPD -->
                                <div class="mb-6">
                                    <span class="text-xs font-semibold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                                        Lembar Kerja Peserta Didik
                                    </span>
                                    
                                    <div class="bg-white rounded-lg p-5 border border-amber-100 mt-4">
                                        <p class="text-gray-700 whitespace-pre-wrap break-words leading-relaxed">
                                            ${escapeHtml(sub.lkpdDescription || 'Tidak ada deskripsi untuk LKPD ini.')}
                                        </p>
                                    </div>
                                </div>
                                
                                <!-- FORM UPLOAD LINK GOOGLE DRIVE -->
                                <div class="bg-white rounded-xl p-5 border-2 border-amber-200 mb-5">
                                    <h3 class="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                        <span class="text-xl">🔗</span>
                                        <span>Upload Tugas LKPD</span>
                                    </h3>
                                    
                                    <p class="text-sm text-gray-600 mb-4">
                                        Upload file tugas kamu ke Google Drive, lalu paste linknya di bawah ini:
                                    </p>
                                    
                                    <div class="space-y-4">
                                        <!-- Input Link -->
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                                Link Google Drive
                                            </label>
                                            <input type="url" 
                                                id="lkpdLinkInput"
                                                value="${savedLink || ''}"
                                                placeholder="https://drive.google.com/file/d/..."
                                                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-400 focus:ring-2 focus:ring-amber-200 transition-all"
                                                ${isCompleted ? 'disabled' : ''}>
                                            <p class="text-xs text-gray-500 mt-2">
                                                💡 Pastikan link sudah diset ke "Siapa saja yang memiliki link bisa melihat"
                                            </p>
                                        </div>
                                        
                                        <!-- Tombol Simpan Link -->
                                        ${!isCompleted ? `
                                            <button 
                                                onclick="window.handleSaveLkpdLink('${sub.id}')"
                                                class="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all font-semibold flex items-center justify-center gap-2 shadow-md">
                                                <span class="text-xl">💾</span>
                                                <span>Simpan Link Tugas</span>
                                            </button>
                                        ` : ''}
                                        
                                        <!-- Preview Link (kalau sudah disimpan) -->
                                        ${savedLink ? `
                                            <div class="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
                                                <p class="text-sm font-semibold text-gray-700 mb-2">✅ Link tersimpan:</p>
                                                <a href="${savedLink}" target="_blank" 
                                                    class="text-amber-600 hover:text-amber-800 break-all flex items-center gap-2">
                                                    <span>🔗</span>
                                                    ${savedLink.substring(0, 50)}...
                                                </a>
                                            </div>
                                        ` : ''}
                                    </div>
                                </div>
                                
                                <!-- Tombol Tandai Selesai (hanya muncul kalau link sudah diisi) -->
                                ${!isCompleted ? `
                                    <button 
                                        onclick="window.handleMarkSubMateriCompleted('${sub.id}')"
                                        class="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg
                                        ${!savedLink ? 'opacity-50 cursor-not-allowed' : ''}"
                                        ${!savedLink ? 'disabled' : ''}>
                                        <span class="text-xl">✅</span>
                                        <span>Tandai Selesai</span>
                                    </button>
                                    ${!savedLink ? `
                                        <p class="text-sm text-amber-600 mt-2">
                                            ⚠️ Simpan link tugas terlebih dahulu sebelum menandai selesai
                                        </p>
                                    ` : ''}
                                ` : `
                                    <div class="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl font-semibold">
                                        <span class="text-xl">✅</span>
                                        <span>Sudah Selesai</span>
                                    </div>
                                `}
                            </div>
                        </div>
                    </div>
                ` : `
                    <!-- Jika tidak ada LKPD, tampilkan tombol selesai saja -->
                    ${!isCompleted ? `
                        <div class="bg-white rounded-2xl card-shadow p-6 md:p-8 text-center">
                            <div class="text-5xl mb-4">🎉</div>
                            <h3 class="text-xl md:text-2xl font-bold text-gray-800 mb-3">Selesaikan Materi Ini</h3>
                            <p class="text-gray-600 mb-6 max-w-lg mx-auto">
                                ${sub.videoId ? 'Tonton video pembelajaran di atas, lalu tandai sebagai selesai.' : 'Klik tombol di bawah untuk menandai materi ini selesai.'}
                            </p>
                            <button 
                                onclick="window.handleMarkSubMateriCompleted('${sub.id}')"
                                class="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all font-semibold inline-flex items-center gap-3 shadow-lg hover:shadow-xl">
                                <span class="text-2xl">✅</span>
                                <span class="text-lg">Tandai Selesai</span>
                            </button>
                        </div>
                    ` : ''}
                `}
            </div>
        </div>
    `;
}

// Handler untuk kembali ke halaman materi (global function)
window.handleBackToMateri = function() {
    state.studentSubView = 'materi';
    state.currentSubMateri = null; // Hapus data sub materi dari state
    render();
};

// Handler untuk menyimpan link LKPD
window.handleSaveLkpdLink = function(subId) {
    const linkInput = document.getElementById('lkpdLinkInput');
    const link = linkInput.value.trim();
    
    if (!link) {
        showToast('Masukkan link Google Drive terlebih dahulu', 'error');
        return;
    }
    
    // Validasi link Google Drive (opsional)
    if (!link.includes('drive.google.com')) {
        showToast('Harap masukkan link Google Drive yang valid', 'error');
        return;
    }
    
    saveLkpdLink(subId, link);
    showToast('Link tugas berhasil disimpan!');
    
    // Update tampilan
    setTimeout(() => {
        render();
    }, 100);
};

// Handler untuk menandai sub materi selesai (global function)
// Update fungsi markSubMateriCompleted
window.handleMarkSubMateriCompleted = function(subId) {
    const progress = getProgress(state.currentUser.id);
    const links = progress?.lkpdLinks ? parseJSON(progress.lkpdLinks) : {};
    
    // Cek apakah ada link untuk sub materi ini (kalau ada LKPD)
    const sub = store.getById(subId);
    if (sub?.lkpdTitle && !links[subId]) {
        showToast('Harap upload link tugas LKPD terlebih dahulu', 'error');
        return;
    }
    
    markSubMateriCompleted(subId);
    showToast('Sub materi ditandai selesai!');
    
    setTimeout(() => {
        render();
    }, 100);
};

function markSubMateriCompleted(subId) {
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
            // lkpdLinks tetap, tidak perlu diubah
        });
    } else {
        store.create({
            type: 'progress',
            studentId: state.currentUser.id,
            completedSubMateri: JSON.stringify(completedSubs),
            completedLkpd: JSON.stringify(completedLkpd),
            lkpdLinks: '{}',
            pretestDone: false,
            posttestDone: false
        });
    }
}

// Fungsi untuk menandai sub materi selesai
function markSubMateriCompleted(subId) {
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
            pretestDone: false,
            posttestDone: false
        });
    }
}

// Fungsi untuk menyimpan link ke database
function saveLkpdLink(subId, link) {
    const progress = getProgress(state.currentUser.id);
    
    // Ambil links yang sudah ada
    const existingLinks = progress?.lkpdLinks ? parseJSON(progress.lkpdLinks) : {};
    
    // Update link untuk sub materi ini
    existingLinks[subId] = link;
    
    if (progress) {
        // Update progress yang sudah ada
        store.update(progress.id, {
            lkpdLinks: JSON.stringify(existingLinks)
        });
    } else {
        // Buat progress baru
        store.create({
            type: 'progress',
            studentId: state.currentUser.id,
            completedSubMateri: '[]',
            completedLkpd: '[]',
            lkpdLinks: JSON.stringify(existingLinks),
            pretestDone: false,
            posttestDone: false
        });
    }
}
