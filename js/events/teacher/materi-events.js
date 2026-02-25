// =============== MATERI EVENT LISTENERS ===============
function attachMateriEventListeners() {
    // Add Materi
    document.getElementById('addMateri')?.addEventListener('click', () => {
        state.editingMateri = null;
        document.getElementById('modalMateriTitle').textContent = 'Tambah Materi';
        document.getElementById('materiTitle').value = '';
        document.getElementById('materiDesc').value = '';
        document.getElementById('modalMateri').classList.remove('hidden');
    });

    // Edit Materi
    document.querySelectorAll('[data-edit-materi]').forEach(btn => {
        btn.addEventListener('click', () => {
            const materi = store.getById(btn.dataset.editMateri);
            if (materi) {
                state.editingMateri = materi;
                document.getElementById('modalMateriTitle').textContent = 'Edit Materi';
                document.getElementById('materiTitle').value = materi.title;
                document.getElementById('materiDesc').value = materi.description || '';
                document.getElementById('modalMateri').classList.remove('hidden');
            }
        });
    });

    // Cancel Materi
    document.getElementById('cancelMateri')?.addEventListener('click', () => {
        document.getElementById('modalMateri').classList.add('hidden');
    });

    // Save Materi
    document.getElementById('saveMateri')?.addEventListener('click', () => {
        const title = document.getElementById('materiTitle').value.trim();
        if (!title) {
            showToast('Judul materi harus diisi', 'error');
            return;
        }

        if (state.editingMateri) {
            store.update(state.editingMateri.id, {
                title,
                description: document.getElementById('materiDesc').value.trim()
            });
        } else {
            store.create({
                type: 'materi',
                title,
                description: document.getElementById('materiDesc').value.trim()
            });
        }

        document.getElementById('modalMateri').classList.add('hidden');
        showToast(state.editingMateri ? 'Materi diperbarui' : 'Materi ditambahkan');
    });

    // Delete Materi
    document.querySelectorAll('[data-delete-materi]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const btn = e.currentTarget;
            const materiId = btn.dataset.deleteMateri;
            
            if (btn.dataset.confirming === 'true') {
                btn.disabled = true;
                
                store.delete(materiId);
                const subs = getSubMateri(materiId);
                for (const sub of subs) {
                    store.delete(sub.id);
                }
                
                showToast('Materi dan sub materi dihapus');
            } else {
                btn.dataset.confirming = 'true';
                btn.innerHTML = '⚠️ Konfirmasi?';
                setTimeout(() => {
                    if (btn) {
                        btn.dataset.confirming = 'false';
                        btn.innerHTML = '🗑️ Hapus';
                    }
                }, 3000);
            }
        });
    });

    // Delete Materi - perbaiki
    document.querySelectorAll('[data-delete-materi]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const btn = e.currentTarget;
            const materiId = btn.dataset.deleteMateri;
            
            if (btn.dataset.confirming === 'true') {
                btn.disabled = true;
                btn.innerHTML = 'Menghapus...';
                
                // Hapus materi
                store.delete(materiId);
                
                // Hapus semua sub materi yang terkait
                const subs = store.getByType('submateri').filter(sub => sub.materiId === materiId);
                for (const sub of subs) {
                    store.delete(sub.id);
                }
                
                // Bersihkan data orphan
                store.cleanOrphanData();
                
                showToast('Materi dan sub materi dihapus');
                btn.dataset.confirming = 'false';
                render();
            } else {
                btn.dataset.confirming = 'true';
                btn.innerHTML = '⚠️ Konfirmasi?';
                setTimeout(() => {
                    if (btn) {
                        btn.dataset.confirming = 'false';
                        btn.innerHTML = '🗑️ Hapus';
                    }
                }, 3000);
            }
        });
    });
}