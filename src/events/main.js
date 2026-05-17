import { UI, STATE, saveState } from '../store.js';
import { findItemById, deleteFolder, deleteBookmark, getFolderById } from '../data.js';
import { showModal } from '../ui/modal.js';
import { showToast } from '../ui/toast.js';
import { showCreateFolderModal } from '../modals.js';
import { bindContentEvents } from './content.js';

export function bindMainEvents(folderId, render, renderContent) {
  const cancelSelBtn = document.getElementById("btn-cancel-sel");
  if (cancelSelBtn) cancelSelBtn.onclick = () => {
    UI.multiSelect = false;
    UI.selectedIds = new Set();
    render();
  };

  const deleteSelBtn = document.getElementById("btn-delete-sel");
  if (deleteSelBtn) deleteSelBtn.onclick = () => deleteSelected(render);

  const settingsBtn = document.getElementById("btn-settings");
  if (settingsBtn) settingsBtn.onclick = () => { UI.settingsOpen = true; render(); };

  const backBtn = document.getElementById("btn-back");
  if (backBtn) backBtn.onclick = () => { UI.path.pop(); render(); };

  const addBtn = document.getElementById("btn-add");
  if (addBtn) addBtn.onclick = () => showCreateFolderModal(null, render);

  const selectBtn = document.getElementById("btn-select");
  if (selectBtn) selectBtn.onclick = () => { UI.multiSelect = true; UI.selectedIds = new Set(); render(); };

  const unpackBtn = document.getElementById("btn-unpack");
  if (unpackBtn) unpackBtn.onclick = () => { UI.unpacked = !UI.unpacked; render(); };

  const searchIn = document.getElementById("search-input");
  if (searchIn) {
    searchIn.oninput = () => { UI.search = searchIn.value; renderContent(folderId, render); };
  }

  const sortSel = document.getElementById("sort-select");
  if (sortSel) sortSel.onchange = () => { STATE.settings.sort = sortSel.value; saveState(); render(); };

  document.querySelectorAll("[data-view-mode]").forEach(btn => {
    btn.onclick = () => {
      const mode       = btn.dataset.viewMode;
      const showBMView = folderId || UI.unpacked;
      if (showBMView) STATE.settings.bookmarkView = mode;
      else            STATE.settings.folderView   = mode;
      saveState();
      render();
    };
  });

  document.querySelectorAll(".bc-item").forEach(item => {
    item.onclick = () => {
      const id = item.dataset.bcid;
      if (id === "") { UI.path = []; }
      else { UI.path = UI.path.slice(0, UI.path.indexOf(id) + 1); }
      UI.multiSelect = false;
      UI.selectedIds = new Set();
      render();
    };
  });

  bindContentEvents(folderId, render);
}

function deleteSelected(render) {
  const count = UI.selectedIds.size;
  if (!count) return;
  showModal(
    `<h3>Delete ${count} item${count !== 1 ? "s" : ""}?</h3>
     <p style="color:var(--text-2);font-size:12px;margin-top:6px;">
       Permanently delete ${count} selected item${count !== 1 ? "s" : ""}.
     </p>`,
    () => {
      const toProcess = [...UI.selectedIds]
        .map(id => ({ id, ...findItemById(id) }))
        .filter(x => x.type);
      toProcess.filter(x => x.type === "folder").forEach(x => deleteFolder(x.id, x.parentId));
      toProcess.filter(x => x.type === "bookmark").forEach(x => deleteBookmark(x.id, x.parentId));
      UI.selectedIds = new Set();
      UI.multiSelect = false;
      render();
      showToast(`Deleted ${count} item${count !== 1 ? "s" : ""}`, "info");
    }, "Delete all", true
  );
}
