// =============== MATERI MANAGER ===============

// Di awal setiap file component, pastikan fungsi didefinisikan secara global
//window.renderTeacherDashboard = renderTeacherDashboard;
//window.renderStudentDashboard = renderStudentDashboard;
//window.renderTestManager = renderTestManager;
window.renderMateriManager = renderMateriManager;
//window.renderRekapNilai = renderRekapNilai;
//window.renderStudentMateri = renderStudentMateri;
//window.renderStudentNilai = renderStudentNilai;
//window.renderLogin = renderLogin;
//window.exportPretestToExcel = exportPretestToExcel;
//window.exportPosttestToExcel = exportPosttestToExcel;

function renderMateriManager(materi, allSubMateri) {
    // Filter sub materi yang masih memiliki materi induk yang valid
    const validSubMateri = allSubMateri.filter(sub => 
        materi.some(m => m.id === sub.materiId)
    );

    return `
        <div class="animate-fade">
            <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h1 class="text-2xl md:text-3xl font-bold text-gray-800">📚 Kelola Materi</h1>
                <button id="addMateri" class="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all">
                    + Tambah Materi
                </button>
            </div>

            ${materi.length === 0 ? `
                <div class="bg-white rounded-2xl card-shadow p-12 text-center">
                    <div class="text-6xl mb-4">📚</div>
                    <h3 class="text-xl font-semibold text-gray-700 mb-2">Belum ada materi</h3>
                    <p class="text-gray-500">Klik tombol "Tambah Materi" untuk memulai</p>
                </div>
            ` : `
                <div class="space-y-4">
                    ${materi.map((m, idx) => {
                        // Ambil sub materi khusus untuk materi ini
                        const subs = validSubMateri.filter(sub => sub.materiId === m.id);
                        return `
                            <div class="bg-white rounded-2xl card-shadow overflow-hidden">
                                <div class="p-4 md:p-6 border-b border-gray-100">
                                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div class="flex items-center gap-4">
                                            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">${idx + 1}</div>
                                            <div>
                                                <h3 class="text-lg font-bold text-gray-800">${m.title}</h3>
                                                <p class="text-sm text-gray-500">${m.description || 'Tidak ada deskripsi'}</p>
                                            </div>
                                        </div>
                                        <div class="flex gap-2">
                                            <button data-add-sub="${m.id}" class="px-4 py-2 bg-green-100 text-green-600 rounded-xl hover:bg-green-200 transition-all text-sm font-medium">+ Sub Materi</button>
                                            <button data-edit-materi="${m.id}" class="px-4 py-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-all text-sm font-medium">✏️ Edit</button>
                                            <button data-delete-materi="${m.id}" class="px-4 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all text-sm font-medium">🗑️ Hapus</button>
                                        </div>
                                    </div>
                                </div>
                                ${subs.length > 0 ? `
                                    <div class="p-4 bg-gray-50">
                                        <div class="space-y-3">
                                            ${subs.map((sub, sIdx) => {
                                                const youtubeThumb = getYoutubeThumbnail(sub.videoUrl);
                                                return `
                                                    <div class="bg-white rounded-xl p-4">
                                                        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                            <div class="flex items-center gap-3 flex-1">
                                                                <div class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-sm font-bold text-indigo-600">${sIdx + 1}</div>
                                                                <div class="flex-1">
                                                                    <h4 class="font-semibold text-gray-800">${sub.title}</h4>
                                                                    <div class="flex flex-wrap gap-2 mt-1">
                                                                        ${sub.videoUrl ? '<span class="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">🎬 YouTube</span>' : ''}
                                                                        ${sub.lkpdTitle ? '<span class="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full">📋 LKPD</span>' : ''}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="flex gap-2">
                                                                <button data-edit-sub="${sub.id}" class="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all">✏️</button>
                                                                <button data-delete-sub="${sub.id}" class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all">🗑️</button>
                                                            </div>
                                                        </div>
                                                        ${youtubeThumb ? `
                                                            <div class="mt-3 rounded-lg overflow-hidden">
                                                                <img src="${youtubeThumb}" alt="Video" class="w-full h-32 object-cover">
                                                                <p class="text-xs text-gray-500 p-2 bg-gray-50">Preview YouTube</p>
                                                            </div>
                                                        ` : ''}
                                                        ${sub.lkpdTitle ? `
                                                            <div class="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                                                                <h5 class="font-semibold text-gray-800 mb-1">📋 ${sub.lkpdTitle}</h5>
                                                                <p class="text-sm text-gray-600 text-break">${sub.lkpdDescription || 'Tidak ada deskripsi'}</p>
                                                            </div>
                                                        ` : ''}
                                                    </div>
                                                `;
                                            }).join('')}
                                        </div>
                                    </div>
                                ` : `
                                    <div class="p-4 bg-gray-50 text-center text-gray-400 text-sm">Belum ada sub materi</div>
                                `}
                            </div>
                        `;
                    }).join('')}
                </div>
            `}
        </div>

        <!-- Modal Materi -->
        <div id="modalMateri" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-2xl w-full max-w-md p-6">
                <h3 class="text-xl font-bold mb-4" id="modalMateriTitle">Tambah Materi</h3>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Judul Materi</label>
                        <input type="text" id="materiTitle" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" placeholder="Masukkan judul materi">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                        <textarea id="materiDesc" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" rows="3" placeholder="Masukkan deskripsi (opsional)"></textarea>
                    </div>
                    <div class="flex gap-3">
                        <button id="cancelMateri" class="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all">Batal</button>
                        <button id="saveMateri" class="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all">Simpan</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Sub Materi -->
        <div id="modalSubMateri" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-auto">
            <div class="bg-white rounded-2xl w-full max-w-lg p-6 my-8">
                <h3 class="text-xl font-bold mb-4" id="modalSubTitle">Tambah Sub Materi</h3>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Judul Sub Materi</label>
                        <input type="text" id="subTitle" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" placeholder="Masukkan judul">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Link YouTube</label>
                        <input type="text" id="subVideo" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" placeholder="https://youtube.com/watch?v=...">
                        <p class="text-xs text-gray-400 mt-1">Link video YouTube (akan ditampilkan preview)</p>
                    </div>
                    <div class="border-t pt-4">
                        <h4 class="font-semibold text-gray-700 mb-3">📋 LKPD (Lembar Kerja)</h4>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Judul LKPD</label>
                            <input type="text" id="lkpdTitle" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" placeholder="Masukkan judul LKPD">
                        </div>
                        <div class="mt-3">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Deskripsi Penugasan</label>
                            <textarea id="lkpdDesc" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" rows="3" placeholder="Jelaskan tugas yang harus dilakukan siswa"></textarea>
                        </div>
                    </div>
                    <div class="flex gap-3">
                        <button id="cancelSub" class="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all">Batal</button>
                        <button id="saveSub" class="flex-1 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all">Simpan</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

