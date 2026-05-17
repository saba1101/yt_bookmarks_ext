import { UI } from '../store.js';
import { getFolderById, getBMById, addBookmark, findBookmarkByVideoId } from '../data.js';
import { playSingleVideo, playAllFolder } from '../player.js';
import { isYouTubeUrl, extractYouTubeId, fetchYTMeta } from '../youtube.js';
import { showToast } from '../ui/toast.js';
import { showCtxMenu } from '../ui/ctxmenu.js';
import { toggleSelect } from '../ui/selection.js';
import { showRenameModal, showRecolorModal, confirmDelete } from '../modals.js';
import { bindDropZone, bindContentAreaDrop, bindFolderDropTargets } from './drop.js';

export function bindContentEvents(folderId, render) {
  document.querySelectorAll("[data-play-folder]").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      playAllFolder(btn.dataset.playFolder);
    });
  });

  document.querySelectorAll(".folder-wrap[data-folder-id], .folder-list-row[data-folder-id]").forEach(el => {
    el.addEventListener("click", e => {
      if (!UI.multiSelect && e.target.closest("[data-folder-menu]")) return;
      if (!UI.multiSelect && e.target.closest("[data-play-folder]")) return;
      if (UI.multiSelect) { toggleSelect(el.dataset.folderId); return; }
      UI.search = "";
      UI.path.push(el.dataset.folderId);
      render();
    });
  });

  if (!UI.multiSelect) {
    document.querySelectorAll("[data-folder-menu]").forEach(btn => {
      btn.onclick = e => {
        e.stopPropagation();
        const id       = btn.dataset.folderMenu;
        const f        = getFolderById(id);
        const parentId = UI.path.length > 0 ? UI.path[UI.path.length - 1] : null;
        showCtxMenu(e.clientX, e.clientY, [
          { label: "Rename",       action: () => showRenameModal("folder", id, f?.label, render) },
          { label: "Change color", action: () => showRecolorModal("folder", id, render) },
          { label: "Open",         action: () => { UI.search = ""; UI.path.push(id); render(); } },
          "sep",
          { label: "Delete", action: () => confirmDelete("folder", id, f?.label, parentId || null, render), danger: true }
        ]);
      };
    });
  }

  if (!UI.multiSelect) {
    document.querySelectorAll(".bm-copy-btn[data-copy-url]").forEach(btn => {
      btn.addEventListener("click", e => {
        e.stopPropagation();
        navigator.clipboard.writeText(btn.dataset.copyUrl)
          .then(() => showToast("Link copied", "success"))
          .catch(() => showToast("Copy failed", "error"));
      });
    });
  }

  document.querySelectorAll(".bm-card[data-bm-id], .bm-list-row[data-bm-id]").forEach(el => {
    el.addEventListener("click", e => {
      if (!UI.multiSelect && e.target.closest("[data-bm-menu]")) return;
      if (!UI.multiSelect && e.target.closest(".bm-copy-btn")) return;
      if (UI.multiSelect) { toggleSelect(el.dataset.bmId); return; }
      const bm = getBMById(el.dataset.bmId, el.dataset.folderId);
      if (bm) playSingleVideo(bm, getFolderById(el.dataset.folderId)?.label || "");
    });
  });

  if (!UI.multiSelect) {
    document.querySelectorAll("[data-bm-menu]").forEach(btn => {
      btn.onclick = e => {
        e.stopPropagation();
        const bmId = btn.dataset.bmMenu;
        const fId  = btn.dataset.bmFolder;
        const bm   = getBMById(bmId, fId);
        showCtxMenu(e.clientX, e.clientY, [
          { label: "Open in tab",  action: () => chrome.tabs.create({ url: bm?.url }) },
          { label: "Copy link",    action: () => navigator.clipboard.writeText(bm?.url || `https://www.youtube.com/watch?v=${bm?.videoId}`).then(() => showToast("Link copied", "success")) },
          { label: "Rename",       action: () => showRenameModal("bookmark", bmId, bm?.title, render, fId) },
          { label: "Change color", action: () => showRecolorModal("bookmark", bmId, render, fId) },
          "sep",
          { label: "Delete", action: () => confirmDelete("bookmark", bmId, bm?.title, fId, render), danger: true }
        ]);
      };
    });
  }

  bindDropZone(folderId, render);
  bindContentAreaDrop(folderId, render);

  const urlIn     = document.getElementById("url-input");
  const urlAddBtn = document.getElementById("btn-add-url");
  if (urlIn && urlAddBtn) {
    urlAddBtn.onclick  = () => addYTUrl(urlIn.value, folderId, urlIn, render);
    urlIn.onkeydown = e => { if (e.key === "Enter") addYTUrl(urlIn.value, folderId, urlIn, render); };
  }

  if (!UI.multiSelect) bindFolderDropTargets(render);
}

async function addYTUrl(rawUrl, folderId, inputEl, render) {
  const url = rawUrl.trim();
  if (!url) return;
  if (!isYouTubeUrl(url)) { showToast("Not a valid YouTube URL", "error"); return; }
  const videoId = extractYouTubeId(url);
  if (!videoId) { showToast("Could not extract video ID", "error"); return; }

  const existing = findBookmarkByVideoId(videoId);
  if (existing) { showToast(`Already in "${existing.folder.label}"`, "info"); return; }

  const urlBtn = document.getElementById("btn-add-url");
  if (urlBtn) { urlBtn.disabled = true; urlBtn.innerHTML = `<div class="spinner"></div>`; }

  const meta = await fetchYTMeta(videoId);
  addBookmark(folderId, meta);
  if (inputEl) inputEl.value = "";
  if (urlBtn)  { urlBtn.disabled = false; urlBtn.textContent = "Add"; }
  const shortTitle = meta.title.length > 30 ? meta.title.slice(0, 30) + "…" : meta.title;
  showToast(`Saved: ${shortTitle}`, "success");
  render();
}
