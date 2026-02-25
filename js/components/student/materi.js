// =============== STUDENT MATERI ===============
window.renderStudentMateri = renderStudentMateri;

function renderStudentMateri(materi, subMateri, progress, pretest, posttest, completedSubs, completedLkpd) {
    const pretestDone = progress?.pretestDone || false;
    const allSubMateriDone = subMateri.length > 0 && completedSubs.length >= subMateri.length;

    return `
        <div class="animate-fade">
            <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-6">📚 Materi & Tugas</h1>
            
            <div class="space-y-6">
                <!-- Pretest Card -->
                <div class="bg-white rounded-2xl card-shadow overflow-hidden">
                    <div class="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 ${pretestDone ? 'bg-green-50' : 'bg-orange-50'}">
                        <div class="flex items-center gap-4">
                            <div class="w-14 h-14 ${pretestDone ? 'bg-green-500' : 'bg-orange-500'} rounded-xl flex items-center justify-center text-white text-2xl">
                                ${pretestDone ? '✅' : '✏️'}
                            </div>
                            <div>
                                <h3 class="text-lg font-bold text-gray-800">Pretest</h3>
                                <p class="text-sm text-gray-500">${pretest ? parseJSON(pretest.questions).length + ' soal • Benar/Salah' : 'Belum tersedia'}</p>
                            </div>
                        </div>
                        ${pretest && !pretestDone ? `
                            <button data-start-test="pretest" class="px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all">Mulai Pretest</button>
                        ` : pretestDone ? `
                            <span class="px-4 py-2 bg-green-100 text-green-700 rounded-xl font-semibold">✔ Selesai</span>
                        ` : `
                            <span class="px-4 py-2 bg-gray-100 text-gray-500 rounded-xl">Belum tersedia</span>
                        `}
                    </div>
                </div>

                <!-- Materi Cards -->
                ${materi.map(m => {
                    const subs = getSubMateri(m.id);
                    return `
                        <div class="bg-white rounded-2xl card-shadow overflow-hidden">
                            <!-- Header Materi -->
                            <div class="p-4 md:p-6 bg-gradient-to-r from-purple-50 to-indigo-50">
                                <div class="flex items-center gap-3">
                                    <div class="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white text-2xl">
                                        📚
                                    </div>
                                    <div>
                                        <h2 class="text-xl font-bold text-gray-800">${escapeHtml(m.title)}</h2>
                                        <p class="text-sm text-gray-600">${escapeHtml(m.description || 'Klik sub materi untuk memulai pembelajaran')}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Daftar Sub Materi dalam bentuk Button Grid -->
                            <div class="p-4 md:p-6">
                                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    ${subs.map((sub, sIdx) => {
                                        const allSubsBeforeThis = subs.slice(0, sIdx);
                                        const prevSubsCompleted = allSubsBeforeThis.every(s => completedLkpd.includes(s.id));
                                        const isUnlocked = pretestDone && (sIdx === 0 || prevSubsCompleted);
                                        const isCompleted = completedSubs.includes(sub.id);
                                        const videoId = extractYoutubeId(sub.videoUrl);
                                        
                                        // Tentukan status dan warna button
                                        let statusClass = '';
                                        let statusIcon = '';
                                        let statusText = '';
                                        let disabledAttr = '';
                                        
                                        if (isCompleted) {
                                            statusClass = 'bg-green-500 hover:bg-green-600 text-white border-green-600';
                                            statusIcon = '✅';
                                            statusText = 'Selesai';
                                        } else if (isUnlocked) {
                                            statusClass = 'bg-white hover:bg-purple-50 text-gray-800 border-purple-300 hover:border-purple-500';
                                            statusIcon = '🔓';
                                            statusText = 'Mulai Belajar';
                                        } else {
                                            statusClass = 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed';
                                            statusIcon = '🔒';
                                            statusText = 'Terkunci';
                                            disabledAttr = 'disabled';
                                        }
                                        
                                        return `
                                            <button 
                                                data-sub-id="${sub.id}"
                                                data-sub-materi='${JSON.stringify({
                                                    id: sub.id,
                                                    title: sub.title,
                                                    materiTitle: m.title,
                                                    videoUrl: sub.videoUrl,
                                                    videoId: videoId,
                                                    lkpdTitle: sub.lkpdTitle,
                                                    lkpdDescription: sub.lkpdDescription,
                                                    isCompleted: isCompleted,
                                                    isUnlocked: isUnlocked
                                                }).replace(/'/g, "&apos;")}'
                                                ${disabledAttr}
                                                class="sub-materi-btn relative flex flex-col items-start p-5 rounded-xl border-2 transition-all ${statusClass} ${!disabledAttr ? 'hover:shadow-lg hover:-translate-y-1' : ''}">
                                                
                                                <!-- Icon dan Nomor -->
                                                <div class="flex items-center justify-between w-full mb-3">
                                                    <div class="flex items-center gap-2">
                                                        <span class="text-2xl">${statusIcon}</span>
                                                        <span class="text-sm font-bold ${isCompleted ? 'text-white' : 'text-gray-500'}">Sub ${sIdx + 1}</span>
                                                    </div>
                                                    ${videoId ? '<span class="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">🎬</span>' : ''}
                                                </div>
                                                
                                                <!-- Judul Sub Materi -->
                                                <h3 class="font-bold text-left ${isCompleted ? 'text-white' : 'text-gray-800'} text-base mb-2 line-clamp-2">
                                                    ${escapeHtml(sub.title)}
                                                </h3>
                                                
                                                <!-- Informasi Tambahan -->
                                                <div class="flex flex-wrap gap-2 mt-2">
                                                    ${sub.lkpdTitle ? `
                                                        <span class="text-xs px-2 py-1 ${isCompleted ? 'bg-green-400 text-white' : 'bg-amber-100 text-amber-600'} rounded-full">
                                                            📋 Tugas
                                                        </span>
                                                    ` : ''}
                                                </div>
                                                
                                                <!-- Status Text -->
                                                <div class="mt-3 w-full">
                                                    <span class="text-xs font-semibold ${isCompleted ? 'text-white' : 'text-gray-500'}">
                                                        ${statusText}
                                                    </span>
                                                </div>
                                                
                                                <!-- Progress Indicator -->
                                                ${isCompleted ? `
                                                    <div class="absolute top-2 right-2">
                                                        <span class="text-white">✓</span>
                                                    </div>
                                                ` : ''}
                                            </button>
                                        `;
                                    }).join('')}
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}

                ${materi.length === 0 ? `
                    <div class="bg-white rounded-2xl card-shadow p-12 text-center">
                        <div class="text-6xl mb-4">📚</div>
                        <h3 class="text-xl font-semibold text-gray-700 mb-2">Belum ada materi</h3>
                        <p class="text-gray-500">Guru belum menambahkan materi pembelajaran</p>
                    </div>
                ` : ''}

                <!-- Posttest Card -->
                <div class="bg-white rounded-2xl card-shadow overflow-hidden">
                    <div class="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 ${progress?.posttestDone ? 'bg-green-50' : !allSubMateriDone ? 'bg-gray-100' : 'bg-teal-50'}">
                        <div class="flex items-center gap-4">
                            <div class="w-14 h-14 ${progress?.posttestDone ? 'bg-green-500' : !allSubMateriDone ? 'bg-gray-400' : 'bg-teal-500'} rounded-xl flex items-center justify-center text-white text-2xl">
                                ${progress?.posttestDone ? '✅' : !allSubMateriDone ? '🔒' : '✏️'}
                            </div>
                            <div>
                                <h3 class="text-lg font-bold text-gray-800">Posttest</h3>
                                <p class="text-sm text-gray-500">${posttest ? parseJSON(posttest.questions).length + ' soal • Benar/Salah' : 'Belum tersedia'}</p>
                            </div>
                        </div>
                        ${posttest && allSubMateriDone && !progress?.posttestDone ? `
                            <button data-start-test="posttest" class="px-6 py-3 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-600 transition-all">Mulai Posttest</button>
                        ` : progress?.posttestDone ? `
                            <span class="px-4 py-2 bg-green-100 text-green-700 rounded-xl font-semibold">✔ Selesai</span>
                        ` : !allSubMateriDone ? `
                            <span class="px-4 py-2 bg-gray-100 text-gray-500 rounded-xl">🔒 Selesaikan semua sub materi</span>
                        ` : `
                            <span class="px-4 py-2 bg-gray-100 text-gray-500 rounded-xl">Belum tersedia</span>
                        `}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Fungsi helper untuk escape HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}