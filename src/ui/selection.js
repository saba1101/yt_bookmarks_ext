import { UI } from '../store.js';

export function toggleSelect(id) {
  if (UI.selectedIds.has(id)) UI.selectedIds.delete(id);
  else UI.selectedIds.add(id);
  updateSelectionUI();
}

export function updateSelectionUI() {
  const selCount = UI.selectedIds.size;

  document.querySelectorAll(".bm-card[data-bm-id], .bm-list-row[data-bm-id]").forEach(el => {
    const isSel = UI.selectedIds.has(el.dataset.bmId);
    el.classList.toggle("item-selected", isSel);
    const chk = el.querySelector(".select-check, .select-check-list");
    if (chk) { chk.classList.toggle("checked", isSel); chk.textContent = isSel ? "✓" : ""; }
  });

  document.querySelectorAll(".folder-wrap[data-folder-id], .folder-list-row[data-folder-id]").forEach(el => {
    const isSel = UI.selectedIds.has(el.dataset.folderId);
    el.classList.toggle("item-selected", isSel);
    const chk = el.querySelector(".select-check, .select-check-list");
    if (chk) { chk.classList.toggle("checked", isSel); chk.textContent = isSel ? "✓" : ""; }
  });

  const deleteBtn = document.getElementById("btn-delete-sel");
  if (deleteBtn) {
    deleteBtn.textContent = `Delete (${selCount})`;
    deleteBtn.style.display = selCount > 0 ? "" : "none";
  }
}
