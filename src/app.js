import { YTBM_CONFIG } from './config.js';
import { STATE, UI, loadState, saveState, currentFolderId } from './store.js';
import { extractYouTubeId } from './youtube.js';
import { findBookmarkByVideoId, getBMById } from './data.js';
import { applyTheme, applyStyle } from './ui/theme.js';
import { closeCtxMenu } from './ui/ctxmenu.js';
import { closeModal } from './ui/modal.js';
import { renderWelcome } from './render/welcome.js';
import { renderMain } from './render/main.js';
import { renderSettingsPanel } from './render/settings.js';

export function render() {
  applyTheme(STATE.settings.theme);
  applyStyle(STATE.settings.style);
  if (!STATE.setup.welcomed) { renderWelcome(render); return; }
  if (UI.settingsOpen)        { renderSettingsPanel(render); return; }
  renderMain(render);
}

async function updateCurrentVideoId() {
  try {
    const tabs = await chrome.tabs.query({ url: "*://*.youtube.com/watch*" });
    tabs.sort((a, b) => (b.active ? 1 : 0) - (a.active ? 1 : 0));

    let matchId = null;
    for (const tab of tabs) {
      const vid = tab.url ? extractYouTubeId(tab.url) : null;
      if (!vid) continue;
      if (findBookmarkByVideoId(vid)) { matchId = vid; break; }
    }

    if (matchId !== UI.currentVideoId) {
      const oldId = UI.currentVideoId;
      UI.currentVideoId = matchId;
      return { changed: true, oldId };
    }
  } catch { /* ignore */ }
  return { changed: false };
}

function updateCurrentVideoHighlight(oldId, newId) {
  document.querySelectorAll(".bm-card[data-bm-id], .bm-list-row[data-bm-id]").forEach(el => {
    const bm = getBMById(el.dataset.bmId, el.dataset.folderId);
    if (!bm) return;
    const isNew = !!newId && bm.videoId === newId;
    const isOld = !!oldId && bm.videoId === oldId;
    if (!isNew && !isOld) return;

    el.classList.toggle("bm-current", isNew);

    const thumbWrap = el.querySelector(".bm-thumbnail-wrap");
    if (thumbWrap) {
      thumbWrap.querySelector(".now-playing-badge")?.remove();
      if (isNew) {
        const badge = document.createElement("div");
        badge.className = "now-playing-badge";
        badge.textContent = "▶ Now Playing";
        thumbWrap.appendChild(badge);
      }
    }

    el.querySelector(".bm-list-thumb")?.classList.toggle("bm-current-thumb", isNew);
  });
}

async function syncVideoHighlight() {
  const { changed, oldId } = await updateCurrentVideoId();
  if (changed && STATE.setup.completed && !UI.settingsOpen) {
    updateCurrentVideoHighlight(oldId, UI.currentVideoId);
  }
}

setInterval(syncVideoHighlight, 2000);

if (chrome.tabs?.onActivated) chrome.tabs.onActivated.addListener(syncVideoHighlight);
if (chrome.tabs?.onUpdated)   chrome.tabs.onUpdated.addListener((_id, info) => {
  if (info.url !== undefined || info.status === "complete") syncVideoHighlight();
});
if (chrome.tabs?.onRemoved)   chrome.tabs.onRemoved.addListener(syncVideoHighlight);

document.addEventListener("click", () => closeCtxMenu());
document.addEventListener("keydown", e => {
  if (e.key === "Escape") { closeCtxMenu(); closeModal(); }
});

async function init() {
  await loadState();
  STATE.setup.completed = true;
  if (!STATE.setup.welcomed && STATE.folders.length > 0) {
    STATE.setup.welcomed = true;
    saveState();
  }
  if (!STATE.settings.theme) STATE.settings.theme = YTBM_CONFIG.themes.default;
  if (!STATE.settings.style) STATE.settings.style = YTBM_CONFIG.styles.default;
  applyTheme(STATE.settings.theme);
  applyStyle(STATE.settings.style);
  await updateCurrentVideoId();
  render();
}

init();
