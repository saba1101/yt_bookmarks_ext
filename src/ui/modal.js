export function showModal(html, onConfirm, confirmLabel = "Save", dangerConfirm = false) {
  const overlay   = document.getElementById("modal-overlay");
  const container = document.getElementById("modal-container");
  overlay.classList.remove("hidden");
  container.innerHTML = `
    <div class="modal" id="active-modal">
      ${html}
      <div class="modal-actions">
        <button class="btn-secondary" id="modal-cancel">Cancel</button>
        <button class="btn-primary" id="modal-confirm"
          style="${dangerConfirm ? "background:var(--accent);" : ""}">${confirmLabel}</button>
      </div>
    </div>`;
  document.getElementById("modal-cancel").onclick = closeModal;
  document.getElementById("modal-confirm").onclick = () => { if (onConfirm() !== false) closeModal(); };
}

export function closeModal() {
  document.getElementById("modal-overlay").classList.add("hidden");
  document.getElementById("modal-container").innerHTML = "";
}

export function bindModalSwatches(customPickerId) {
  document.querySelectorAll("#modal-container .color-swatch").forEach(sw => {
    sw.onclick = () => {
      document.querySelectorAll("#modal-container .color-swatch").forEach(s => s.classList.remove("selected"));
      sw.classList.add("selected");
    };
  });
  const cpick = customPickerId ? document.getElementById(customPickerId) : null;
  if (cpick) {
    cpick.oninput = () => {
      document.querySelectorAll("#modal-container .color-swatch").forEach(s => s.classList.remove("selected"));
    };
  }
}
