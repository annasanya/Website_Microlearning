// =============== LOGIN RENDER ===============

// Di awal setiap file component, pastikan fungsi didefinisikan secara global
window.renderTeacherDashboard = renderTeacherDashboard;
window.renderStudentDashboard = renderStudentDashboard;
//window.renderTestManager = renderTestManager;
window.renderMateriManager = renderMateriManager;
window.renderRekapNilai = renderRekapNilai;
window.renderStudentMateri = renderStudentMateri;
window.renderStudentNilai = renderStudentNilai;
window.renderLogin = renderLogin;
window.exportPretestToExcel = exportPretestToExcel;
window.exportPosttestToExcel = exportPosttestToExcel;

function renderLogin() {
    return `
        <div class="min-h-full flex items-center justify-center p-4 gradient-bg">
            <div class="w-full max-w-md">
                <div class="text-center mb-8">
                    <div class="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-lg mb-4">
                        <svg class="w-12 h-12 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
                        </svg>
                    </div>
                    <h1 class="text-3xl font-bold text-white">${CONFIG.app_title}</h1>
                    <p class="text-white/80 mt-2">Sistem Pembelajaran Interaktif</p>
                </div>
                
                <div class="bg-white rounded-2xl card-shadow p-6">
                    <div class="flex mb-6 bg-gray-100 rounded-xl p-1">
                        <button id="tabGuru" class="flex-1 py-3 px-4 rounded-lg font-semibold transition-all bg-white shadow text-blue-600">👨‍🏫 Guru</button>
                        <button id="tabSiswa" class="flex-1 py-3 px-4 rounded-lg font-semibold transition-all text-gray-500">👨‍🎓 Siswa</button>
                    </div>
                    
                    <div id="formGuru">
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Nama Guru</label>
                                <input type="text" id="guruNama" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" placeholder="Masukkan nama Anda">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Kode Akses</label>
                                <input type="password" id="guruKode" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" placeholder="Masukkan kode rahasia">
                            </div>
                            <button id="loginGuru" class="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all">Masuk sebagai Guru</button>
                        </div>
                    </div>
                    
                    <div id="formSiswa" class="hidden">
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                                <input type="text" id="siswaNama" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" placeholder="Masukkan nama lengkap">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Kelas</label>
                                <select id="siswaKelas" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500">
                                    <option value="">Pilih Kelas</option>
                                    <option value="X">Kelas X</option>
                                    <option value="XI">Kelas XI</option>
                                    <option value="XII">Kelas XII</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Nama Sekolah</label>
                                <input type="text" id="siswaSekolah" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" placeholder="Masukkan nama sekolah">
                            </div>
                            <button id="loginSiswa" class="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all">Masuk sebagai Siswa</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
