// =============== AUTH EVENT LISTENERS ===============
function attachAuthEventListeners() {
    // Login tabs
    document.getElementById('tabGuru')?.addEventListener('click', () => {
        document.getElementById('formGuru')?.classList.remove('hidden');
        document.getElementById('formSiswa')?.classList.add('hidden');
        document.getElementById('tabGuru')?.classList.add('bg-white', 'shadow', 'text-purple-600');
        document.getElementById('tabGuru')?.classList.remove('text-gray-500');
        document.getElementById('tabSiswa')?.classList.remove('bg-white', 'shadow', 'text-green-600');
        document.getElementById('tabSiswa')?.classList.add('text-gray-500');
    });

    document.getElementById('tabSiswa')?.addEventListener('click', () => {
        document.getElementById('formSiswa')?.classList.remove('hidden');
        document.getElementById('formGuru')?.classList.add('hidden');
        document.getElementById('tabSiswa')?.classList.add('bg-white', 'shadow', 'text-green-600');
        document.getElementById('tabSiswa')?.classList.remove('text-gray-500');
        document.getElementById('tabGuru')?.classList.remove('bg-white', 'shadow', 'text-purple-600');
        document.getElementById('tabGuru')?.classList.add('text-gray-500');
    });

    // Teacher Login
    document.getElementById('loginGuru')?.addEventListener('click', () => {
        const nama = document.getElementById('guruNama')?.value.trim();
        const kode = document.getElementById('guruKode')?.value.trim();
        
        if (!nama || !kode) {
            showToast('Mohon isi semua field', 'error');
            return;
        }
        if (kode !== TEACHER_CODE) {
            showToast('Kode akses salah', 'error');
            return;
        }
        
        state.currentUser = { name: nama, role: 'teacher' };
        state.currentView = 'teacher';
        state.teacherSubView = 'dashboard';
        render();
        showToast(`Selamat datang, ${nama}!`);
    });

    // Student Login
    document.getElementById('loginSiswa')?.addEventListener('click', () => {
        const nama = document.getElementById('siswaNama')?.value.trim();
        const kelas = document.getElementById('siswaKelas')?.value;
        const sekolah = document.getElementById('siswaSekolah')?.value.trim();
        
        if (!nama || !kelas || !sekolah) {
            showToast('Mohon isi semua field', 'error');
            return;
        }

        const existingStudent = getStudents().find(s => 
            s.name?.toLowerCase() === nama.toLowerCase() && 
            s.kelas === kelas && 
            s.sekolah?.toLowerCase() === sekolah.toLowerCase()
        );

        if (existingStudent) {
            state.currentUser = existingStudent;
            state.currentView = 'student';
            state.studentSubView = 'dashboard';
            render();
            showToast(`Selamat datang kembali, ${nama}!`);
            return;
        }

        const newStudent = store.create({
            type: 'student',
            name: nama,
            kelas: kelas,
            sekolah: sekolah
        });

        state.currentUser = newStudent;
        state.currentView = 'student';
        state.studentSubView = 'dashboard';
        render();
        showToast(`Selamat datang, ${nama}!`);
    });

    // Logout
    const logout = () => {
        state.currentUser = null;
        state.currentView = 'login';
        render();
        showToast('Berhasil keluar');
    };

    document.getElementById('logoutTeacher')?.addEventListener('click', logout);
    document.getElementById('logoutTeacherMobile')?.addEventListener('click', logout);
    document.getElementById('logoutStudent')?.addEventListener('click', logout);
    document.getElementById('logoutStudentMobile')?.addEventListener('click', logout);
}