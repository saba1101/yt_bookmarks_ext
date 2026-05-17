import { YTBM_CONFIG } from './config.js';

export const STATE = {
  setup:    { completed: false, welcomed: false },
  folders:  [],
  settings: { theme: "frost", style: "rounded", folderView: "grid", bookmarkView: "grid", sort: "date-desc" }
};

export const UI = {
  path:           [],
  settingsOpen:   false,
  search:         "",
  multiSelect:    false,
  selectedIds:    new Set(),
  unpacked:       false,
  currentVideoId: null,
};

export function currentFolderId() {
  return UI.path.length ? UI.path[UI.path.length - 1] : null;
}

export async function loadState() {
  return new Promise(resolve => {
    chrome.storage.local.get(YTBM_CONFIG.app.storageKey, data => {
      const saved = data[YTBM_CONFIG.app.storageKey];
      if (saved) Object.assign(STATE, saved);
      resolve();
    });
  });
}

export function saveState() {
  chrome.storage.local.set({ [YTBM_CONFIG.app.storageKey]: STATE });
}

export function resetState() {
  const def = YTBM_CONFIG.defaultState;
  STATE.setup     = JSON.parse(JSON.stringify(def.setup));
  STATE.folders   = JSON.parse(JSON.stringify(def.folders));
  STATE.settings  = JSON.parse(JSON.stringify(def.settings));
}
