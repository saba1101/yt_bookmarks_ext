import { isYouTubeUrl, extractYouTubeId, fetchYTMeta } from '../youtube.js';
import { addBookmark, findBookmarkByVideoId, getFolderById } from '../data.js';
import { showToast } from '../ui/toast.js';

function parseDropUrl(e) {
  const uriList = e.dataTransfer.getData("text/uri-list");
  if (uriList) {
    const line = uriList.split(/\r?\n/).find(l => l.trim() && !l.startsWith("#"));
    if (line) return line.trim();
  }
  return e.dataTransfer.getData("text/plain").trim();
}

export function bindDropZone(folderId, render) {
  const dz = document.getElementById("drop-zone");
  if (!dz || !folderId) return;

  dz.addEventListener("dragover", e => { e.preventDefault(); e.stopPropagation(); dz.classList.add("drag-over"); });
  dz.addEventListener("dragleave", () => dz.classList.remove("drag-over"));
  dz.addEventListener("drop", async e => {
    e.preventDefault();
    e.stopPropagation();
    dz.classList.remove("drag-over");
    const url = parseDropUrl(e);
    if (!url || !isYouTubeUrl(url)) { showToast("Drop a YouTube URL", "error"); return; }
    const vid = extractYouTubeId(url);
    if (!vid) return;
    const existing = findBookmarkByVideoId(vid);
    if (existing) { showToast(`Already in "${existing.folder.label}"`, "info"); return; }
    const meta = await fetchYTMeta(vid);
    addBookmark(folderId, meta);
    showToast(`Saved: ${meta.title.slice(0, 28)}…`, "success");
    render();
  });
}

export function bindContentAreaDrop(folderId, render) {
  const ca = document.getElementById("content-area");
  if (!ca || !folderId) return;

  ca.addEventListener("dragover", e => {
    e.preventDefault();
    ca.classList.add("ca-drag-over");
  });

  ca.addEventListener("dragleave", e => {
    if (!ca.contains(e.relatedTarget)) ca.classList.remove("ca-drag-over");
  });

  ca.addEventListener("drop", async e => {
    e.preventDefault();
    ca.classList.remove("ca-drag-over");
    const url = parseDropUrl(e);
    if (!url || !isYouTubeUrl(url)) { showToast("Drop a YouTube URL", "error"); return; }
    const vid = extractYouTubeId(url);
    if (!vid) return;
    const existing = findBookmarkByVideoId(vid);
    if (existing) { showToast(`Already in "${existing.folder.label}"`, "info"); return; }
    const meta = await fetchYTMeta(vid);
    addBookmark(folderId, meta);
    showToast(`Saved: ${meta.title.slice(0, 28)}…`, "success");
    render();
  });
}

export function bindFolderDropTargets(render) {
  document.querySelectorAll("[data-folder-id]").forEach(el => {
    if (el.dataset.bmId) return;

    el.addEventListener("dragover", e => {
      e.preventDefault();
      e.stopPropagation();
      el.classList.add("folder-drop-target");
    });

    el.addEventListener("dragleave", () => el.classList.remove("folder-drop-target"));

    el.addEventListener("drop", async e => {
      e.preventDefault();
      e.stopPropagation();
      el.classList.remove("folder-drop-target");
      const url = parseDropUrl(e);
      if (!url || !isYouTubeUrl(url)) { showToast("Drop a YouTube URL onto a folder", "error"); return; }
      const vid = extractYouTubeId(url);
      if (!vid) return;
      const existing = findBookmarkByVideoId(vid);
      if (existing) { showToast(`Already in "${existing.folder.label}"`, "info"); return; }
      const fId  = el.dataset.folderId;
      const meta = await fetchYTMeta(vid);
      addBookmark(fId, meta);
      showToast(`Saved to "${getFolderById(fId)?.label || "folder"}"`, "success");
      render();
    });
  });
}
