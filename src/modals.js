import { YTBM_CONFIG } from './config.js';
import {
  addFolder, deleteFolder, renameFolder, recolorFolder,
  deleteBookmark, renameBookmark, recolorBookmark,
  getFolderById, getBMById
} from './data.js';
import { colorHex, esc } from './utils.js';
import { showModal, bindModalSwatches } from './ui/modal.js';
import { showToast } from './ui/toast.js';

export function showCreateFolderModal(parentId, render) {
  showModal(`
    <h3>New Folder</h3>
    <div class="folder-form" style="margin-top:12px;">
      <div class="form-group">
        <label class="form-label">Name</label>
        <input type="text" id="mf-name" placeholder="Folder name…" maxlength="40" />
      </div>
      <div class="form-group">
        <label class="form-label">Color</label>
        <div class="cp-swatches">
          ${YTBM_CONFIG.colors.palette.map((c, i) => `
            <div class="color-swatch ${i === 0 ? "selected" : ""}" style="background:${c.hex}" data-color="${c.id}" title="${c.label}"></div>
          `).join("")}
          <input type="color" class="custom-color-input" id="m-cpick" value="#ef4444" />
        </div>
      </div>
    </div>`,
    () => {
      const name = document.getElementById("mf-name")?.value.trim();
      if (!name) { showToast("Enter a folder name", "error"); return false; }
      const selSwatch = document.querySelector("#modal-container .color-swatch.selected");
      const cpick     = document.getElementById("m-cpick");
      const color     = selSwatch ? selSwatch.dataset.color : (cpick?.value || "lime");
      addFolder(name, color, parentId);
      showToast(`Folder "${name}" created`, "success");
      render();
    }, "Create");

  bindModalSwatches("m-cpick");
  setTimeout(() => document.getElementById("mf-name")?.focus(), 50);
}

export function showRenameModal(type, id, currentLabel, render, folderId = null) {
  showModal(`
    <h3>Rename ${type === "folder" ? "Folder" : "Bookmark"}</h3>
    <div style="margin-top:12px;">
      <input type="text" id="rename-input" value="${esc(currentLabel || "")}" maxlength="${type === "folder" ? 40 : 100}" />
    </div>`,
    () => {
      const val = document.getElementById("rename-input")?.value.trim();
      if (!val) { showToast("Name cannot be empty", "error"); return false; }
      if (type === "folder")   renameFolder(id, val);
      if (type === "bookmark") renameBookmark(id, folderId, val);
      render();
    }, "Rename");

  setTimeout(() => {
    const inp = document.getElementById("rename-input");
    if (inp) { inp.focus(); inp.select(); }
  }, 50);
}

export function showRecolorModal(type, id, render, folderId = null) {
  const current = type === "folder"
    ? getFolderById(id)?.color
    : getBMById(id, folderId)?.color;

  showModal(`
    <h3>Choose ${type === "folder" ? "Folder" : "Tag"} Color</h3>
    <div style="margin-top:14px;">
      <div class="cp-swatches">
        ${YTBM_CONFIG.colors.palette.map(c => `
          <div class="color-swatch ${c.id === current ? "selected" : ""}"
            style="background:${c.hex}" data-color="${c.id}" title="${c.label}"></div>`).join("")}
        <input type="color" class="custom-color-input" id="rc-cpick" value="${colorHex(current || "red")}" title="Custom" />
      </div>
    </div>`,
    () => {
      const sel   = document.querySelector("#modal-container .color-swatch.selected");
      const cpick = document.getElementById("rc-cpick");
      const color = sel ? sel.dataset.color : (cpick?.value || "red");
      if (type === "folder")   recolorFolder(id, color);
      if (type === "bookmark") recolorBookmark(id, folderId, color);
      render();
    }, "Apply");

  bindModalSwatches("rc-cpick");
}

export function confirmDelete(type, id, label, parentId, render) {
  showModal(`
    <h3>Delete ${type === "folder" ? "Folder" : "Bookmark"}?</h3>
    <p style="color:var(--text-2);font-size:12px;margin-top:6px;">
      "${esc(label || "")}" will be permanently deleted${type === "folder" ? " along with all its contents" : ""}.
    </p>`,
    () => {
      if (type === "folder")   deleteFolder(id, parentId);
      if (type === "bookmark") deleteBookmark(id, parentId);
      render();
      showToast("Deleted", "info");
    }, "Delete", true);
}
