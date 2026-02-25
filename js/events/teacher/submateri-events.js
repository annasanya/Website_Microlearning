// =============== SUB MATERI EVENT LISTENERS ===============
function attachSubMateriEventListeners() {
    // Add Sub
    document.querySelectorAll('[data-add-sub]').forEach(btn => {
        btn.addEventListener('click', () => {
            state.selectedMateriForSub = btn.dataset.addSub;
            state.editingSubMateri = null;
            document.getElementById('modalSubTitle').textContent = 'Tambah Sub Materi';
            document.getElementById('subTitle').value = '';
            document.getElementById('subVideo').value = '';
            document.getElementById('lkpdTitle').value = '';
            document.getElementById('lkpdDesc').value = '';
            document.getElementById('modalSubMateri').classList.remove('hidden');
        });
    });

    // Edit Sub
    document.querySelectorAll('[data-edit-sub]').forEach(btn => {
        btn.addEventListener('click', () => {
            const sub = store.getById(btn.dataset.editSub);
            if (sub) {
                state.editingSubMateri = sub;
                state.selectedMateriForSub = sub.materiId;
                document.getElementById('modalSubTitle').textContent = 'Edit Sub Materi';
                document.getElementById('subTitle').value = sub.title;
                document.getElementById('subVideo').value = sub.videoUrl || '';
                document.getElementById('lkpdTitle').value = sub.lkpdTitle || '';
                document.getElementById('lkpdDesc').value = sub.lkpdDescription || '';
                document.getElementById('modalSubMateri').classList.remove('hidden');
            }
        });
    });

    // Cancel Sub
    document.getElementById('cancelSub')?.addEventListener('click', () => {
        document.getElementById('modalSubMateri').classList.add('hidden');
    });

    // Save Sub
    document.getElementById('saveSub')?.addEventListener('click', () => {
        const title = document.getElementById('subTitle').value.trim();
        if (!title) {
            showToast('Judul sub materi harus diisi', 'error');
            return;
        }

        const data = {
            type: 'submateri',
            materiId: state.selectedMateriForSub,
            title,
            videoUrl: document.getElementById('subVideo').value.trim(),
            lkpdTitle: document.getElementById('lkpdTitle').value.trim(),
            lkpdDescription: document.getElementById('lkpdDesc').value.trim()
        };

        if (state.editingSubMateri) {
            store.update(state.editingSubMateri.id, data);
        } else {
            store.create(data);
        }

        document.getElementById('modalSubMateri').classList.add('hidden');
        showToast(state.editingSubMateri ? 'Sub materi diperbarui' : 'Sub materi ditambahkan');
    });

    // Delete Sub
    document.querySelectorAll('[data-delete-sub]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const subId = e.currentTarget.dataset.deleteSub;
            store.delete(subId);
            showToast('Sub materi dihapus');
        });
    });

    // Delete Sub - perbaiki
    document.querySelectorAll('[data-delete-sub]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const subId = e.currentTarget.dataset.deleteSub;
            store.delete(subId);
            
            // Bersihkan data orphan
            store.cleanOrphanData();
            
            showToast('Sub materi dihapus');
            render();
        });
    });
}
