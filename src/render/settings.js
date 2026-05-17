import { YTBM_CONFIG } from '../config.js';
import { STATE, UI, saveState, resetState } from '../store.js';
import { showModal } from '../ui/modal.js';
import { showToast } from '../ui/toast.js';
import { applyStyle } from '../ui/theme.js';

export function renderSettingsPanel(render) {
  const { theme, style, folderView, bookmarkView } = STATE.settings;

  document.getElementById("app").innerHTML = `
    <div class="settings-panel open" id="settings-panel">
      <div class="settings-header">
        <button class="label-btn" id="settings-close">Back</button>
        <h2>Settings</h2>
      </div>
      <div class="settings-body">
        <div>
          <div class="settings-section-title">Corner Style</div>
          <div class="style-grid">
            ${YTBM_CONFIG.styles.list.map(s => `
              <div class="style-option ${s.id === style ? "selected" : ""}" data-style="${s.id}">
                <div class="style-label">${s.label}</div>
                <div class="style-desc">${s.description}</div>
              </div>`).join("")}
          </div>
        </div>

        <div>
          <div class="settings-section-title">Views</div>
          <div class="setting-row">
            <label>Folder view</label>
            <div class="toggle-group">
              ${["grid", "list"].map(v => `<button class="toggle-btn ${folderView === v ? "active" : ""}" data-fview="${v}">${v === "grid" ? "Grid" : "List"}</button>`).join("")}
            </div>
          </div>
          <div class="setting-row">
            <label>Bookmark view</label>
            <div class="toggle-group">
              ${["grid", "list"].map(v => `<button class="toggle-btn ${bookmarkView === v ? "active" : ""}" data-bview="${v}">${v === "grid" ? "Grid" : "List"}</button>`).join("")}
            </div>
          </div>
        </div>

        <div>
          <div class="settings-section-title">Data</div>
          <div class="data-actions-row">
            <button class="reset-btn data-btn" id="btn-export">Export JSON</button>
            <button class="reset-btn data-btn" id="btn-import">Import JSON</button>
          </div>
          <button class="reset-btn danger" id="btn-clear-all" style="margin-top:6px;">Clear all data</button>
        </div>

        <div class="settings-about">
          <div class="settings-about-name">${YTBM_CONFIG.app.name}</div>
          <div class="settings-about-meta">Version ${YTBM_CONFIG.app.version}</div>
          <div class="settings-about-meta">Released under the MIT License</div>
          <div class="settings-about-meta">© 2025 All rights reserved</div>
        </div>
      </div>
    </div>`;

  document.getElementById("settings-close").onclick = () => { UI.settingsOpen = false; render(); };

  document.querySelectorAll("[data-style]").forEach(el => {
    el.onclick = () => {
      STATE.settings.style = el.dataset.style;
      applyStyle(el.dataset.style);
      saveState();
      renderSettingsPanel(render);
    };
  });

  document.querySelectorAll("[data-fview]").forEach(el => {
    el.onclick = () => { STATE.settings.folderView = el.dataset.fview; saveState(); renderSettingsPanel(render); };
  });

  document.querySelectorAll("[data-bview]").forEach(el => {
    el.onclick = () => { STATE.settings.bookmarkView = el.dataset.bview; saveState(); renderSettingsPanel(render); };
  });

  document.getElementById("btn-export").onclick = exportData;
  document.getElementById("btn-import").onclick = () => importData(render);

  document.getElementById("btn-clear-all").onclick = () => {
    showModal(
      "<h3>Clear all data?</h3><p style='color:var(--text-2);font-size:12px;margin-top:4px'>This will permanently delete all folders and bookmarks.</p>",
      () => {
        resetState();
        saveState();
        UI.settingsOpen = false;
        UI.path         = [];
        UI.multiSelect  = false;
        UI.selectedIds  = new Set();
        UI.unpacked     = false;
        render();
        showToast("All data cleared", "info");
      }, "Delete all", true
    );
  };
}

function exportData() {
  const payload = {
    version:    YTBM_CONFIG.app.version,
    exportedAt: new Date().toISOString(),
    folders:    STATE.folders
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `ytbm-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast("Data exported", "success");
}

function importData(render) {
  const input  = document.createElement("input");
  input.type   = "file";
  input.accept = ".json,application/json";
  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (!Array.isArray(parsed.folders)) throw new Error();
        const count = parsed.folders.length;
        showModal(
          `<h3>Import Backup?</h3>
           <p style="color:var(--text-2);font-size:12px;margin-top:6px;">
             Found <strong>${count}</strong> folder${count !== 1 ? "s" : ""}.
             This will replace all current data.
           </p>`,
          () => {
            STATE.folders = parsed.folders;
            saveState();
            UI.path = [];
            UI.settingsOpen = false;
            render();
            showToast(`Imported ${count} folder${count !== 1 ? "s" : ""}`, "success");
          }, "Import", true
        );
      } catch {
        showToast("Invalid or unsupported file", "error");
      }
    };
    reader.readAsText(file);
  };
  input.click();
}
