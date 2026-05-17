import { YTBM_CONFIG } from '../config.js';
import { STATE, saveState } from '../store.js';
import { esc } from '../utils.js';

const WC_ICONS = {
  folder: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
  play:   `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>`,
  sync:   `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>`,
};

export function renderWelcome(render) {
  document.getElementById("app").innerHTML = `
    <div class="welcome-screen">
      <div class="welcome-hero">
        <div class="welcome-logo-mark">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        </div>
        <h1 class="welcome-title">${esc(YTBM_CONFIG.app.name)}</h1>
        <p class="welcome-sub">A quick overview before you start</p>
      </div>

      <div class="welcome-cards">
        <div class="welcome-card">
          <div class="wc-icon-wrap">${WC_ICONS.folder}</div>
          <div class="wc-body">
            <div class="wc-title">Folders &amp; Saving</div>
            <div class="wc-desc">Press <strong>+ New</strong> to create a folder. Open it, then <strong>drag a YouTube link</strong> in or paste a URL to save a video. Use <strong>⋯</strong> to rename, recolour, or delete anything.</div>
          </div>
        </div>
        <div class="welcome-card">
          <div class="wc-icon-wrap">${WC_ICONS.play}</div>
          <div class="wc-body">
            <div class="wc-title">Playing &amp; Browsing</div>
            <div class="wc-desc">Click a video to open it, or press <strong>▶ Play All</strong> to queue the whole folder. Use <strong>Unpack</strong> in the toolbar to see every saved video at once.</div>
          </div>
        </div>
        <div class="welcome-card">
          <div class="wc-icon-wrap">${WC_ICONS.sync}</div>
          <div class="wc-body">
            <div class="wc-title">Settings &amp; Backup</div>
            <div class="wc-desc">Customise views and corner style in <strong>Settings</strong>. Use <strong>Export / Import JSON</strong> to back up or restore all your data.</div>
          </div>
        </div>
      </div>

      <button class="btn-primary welcome-cta" id="welcome-start">Get Started</button>
    </div>`;

  document.getElementById("welcome-start").onclick = () => {
    STATE.setup.welcomed = true;
    saveState();
    render();
  };
}
