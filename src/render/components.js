import { UI } from '../store.js';
import { colorHex, esc, relativeDate } from '../utils.js';

const COPY_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;

const THUMB_POSITIONS = [
  "top:-4px;right:-6px;width:44px;height:32px;transform:rotate(9deg);opacity:0.38",
  "bottom:-4px;left:-6px;width:40px;height:28px;transform:rotate(-11deg);opacity:0.32",
  "top:6px;left:-8px;width:34px;height:24px;transform:rotate(-5deg);opacity:0.24",
  "bottom:6px;right:-6px;width:36px;height:26px;transform:rotate(14deg);opacity:0.28",
];

export function renderFolderCard(f, idx = 0) {
  const hex     = colorHex(f.color);
  const count   = (f.items || []).length;
  const initial = esc(f.label.charAt(0).toUpperCase());
  const isSel   = UI.multiSelect && UI.selectedIds.has(f.id);

  const thumbs = (f.items || [])
    .filter(i => i.type === "bookmark")
    .slice(0, 4)
    .map((b, i) => {
      const src = b.thumbnail || `https://img.youtube.com/vi/${b.videoId}/mqdefault.jpg`;
      return `<img class="folder-thumb" src="${src}" style="${THUMB_POSITIONS[i]}" alt="" loading="lazy" />`;
    }).join("");

  return `<div class="folder-wrap${isSel ? " item-selected" : ""}" data-folder-id="${f.id}"
    style="--i:${idx};--card-accent:${hex};--card-badge:${hex}38;--card-border:${hex}28;--card-tab-w:46%">
    <div class="folder-body">
      ${thumbs}
      ${UI.multiSelect ? `<div class="select-check${isSel ? " checked" : ""}">${isSel ? "✓" : ""}</div>` : ""}
      <div class="folder-initial">${initial}</div>
      <div class="folder-name">${esc(f.label)}</div>
      <div class="folder-count">${count} item${count !== 1 ? "s" : ""}</div>
      ${!UI.multiSelect ? `
        <button class="card-play-btn" data-play-folder="${f.id}" title="Play all">▶</button>
        <button class="card-menu-btn" data-folder-menu="${f.id}">⋯</button>` : ""}
    </div>
  </div>`;
}

export function renderFolderListRow(f, idx = 0) {
  const hex     = colorHex(f.color);
  const count   = (f.items || []).length;
  const initial = esc(f.label.charAt(0).toUpperCase());
  const isSel   = UI.multiSelect && UI.selectedIds.has(f.id);

  return `<div class="folder-list-row${isSel ? " item-selected" : ""}" data-folder-id="${f.id}"
    style="--i:${idx};--card-accent:${hex};--card-bg:${hex}18;--card-border:${hex}38">
    ${UI.multiSelect ? `<div class="select-check-list${isSel ? " checked" : ""}">${isSel ? "✓" : ""}</div>` : ""}
    <div class="folder-initial-sm">${initial}</div>
    <div class="row-info">
      <div class="row-name">${esc(f.label)}</div>
      <div class="row-meta">${count} item${count !== 1 ? "s" : ""} · ${relativeDate(f.createdAt)}</div>
    </div>
    <div class="row-actions">
      ${!UI.multiSelect ? `
        <button class="icon-btn" data-play-folder="${f.id}" title="Play all" style="font-size:11px;color:var(--accent)">▶</button>
        <button class="icon-btn" data-folder-menu="${f.id}">⋯</button>` : ""}
    </div>
  </div>`;
}

export function renderBMCard(b, folderId, idx = 0, folderLabel = null) {
  const isCurrent = UI.currentVideoId && b.videoId === UI.currentVideoId;
  const isSel     = UI.multiSelect && UI.selectedIds.has(b.id);
  const thumb     = b.thumbnail || `https://img.youtube.com/vi/${b.videoId}/mqdefault.jpg`;
  const colorDot  = b.color ? `<div class="bm-tag-dot" style="background:${colorHex(b.color)}"></div>` : "";

  return `<div class="bm-card${isCurrent ? " bm-current" : ""}${isSel ? " item-selected" : ""}"
    data-bm-id="${b.id}" data-folder-id="${folderId}" style="--i:${idx}">
    <div class="bm-thumbnail-wrap">
      ${UI.multiSelect ? `<div class="select-check${isSel ? " checked" : ""}">${isSel ? "✓" : ""}</div>` : ""}
      <img src="${thumb}" alt="" loading="lazy" />
      ${colorDot}
      ${isCurrent ? `<div class="now-playing-badge">▶ Now Playing</div>` : ""}
    </div>
    <div class="bm-info">
      <div class="bm-title">${esc(b.title || "Untitled")}</div>
      ${b.channelName ? `<div class="bm-channel">${esc(b.channelName)}</div>` : ""}
      ${folderLabel ? `<div class="bm-folder-tag">📁 ${esc(folderLabel)}</div>` : ""}
      <div class="bm-date">${relativeDate(b.addedAt)}</div>
    </div>
    ${!UI.multiSelect ? `<button class="bm-copy-btn" data-copy-url="${esc(b.url || `https://www.youtube.com/watch?v=${b.videoId}`)}">${COPY_ICON}</button>` : ""}
    ${!UI.multiSelect ? `<button class="card-menu-btn" data-bm-menu="${b.id}" data-bm-folder="${folderId}">⋯</button>` : ""}
  </div>`;
}

export function renderBMListRow(b, folderId, idx = 0, folderLabel = null) {
  const isCurrent = UI.currentVideoId && b.videoId === UI.currentVideoId;
  const isSel     = UI.multiSelect && UI.selectedIds.has(b.id);
  const thumb     = b.thumbnail || `https://img.youtube.com/vi/${b.videoId}/mqdefault.jpg`;
  const colorDot  = b.color ? `<span class="tag-badge" style="background:${colorHex(b.color)}"></span>` : "";

  return `<div class="bm-list-row${isCurrent ? " bm-current" : ""}${isSel ? " item-selected" : ""}"
    data-bm-id="${b.id}" data-folder-id="${folderId}" style="--i:${idx}">
    ${UI.multiSelect ? `<div class="select-check-list${isSel ? " checked" : ""}">${isSel ? "✓" : ""}</div>` : ""}
    <img class="bm-list-thumb${isCurrent ? " bm-current-thumb" : ""}" src="${thumb}" alt="" loading="lazy" />
    <div class="bm-list-info">
      <div class="bm-list-title">${colorDot} ${esc(b.title || "Untitled")}</div>
      <div class="bm-list-meta">
        ${b.channelName ? `<span>${esc(b.channelName)}</span>` : ""}
        ${folderLabel ? `<span class="bm-folder-tag">📁 ${esc(folderLabel)}</span>` : ""}
        <span>${relativeDate(b.addedAt)}</span>
      </div>
    </div>
    <div class="bm-list-actions">
      ${!UI.multiSelect ? `<button class="icon-btn bm-copy-btn" data-copy-url="${esc(b.url || `https://www.youtube.com/watch?v=${b.videoId}`)}">${COPY_ICON}</button>` : ""}
      ${!UI.multiSelect ? `<button class="icon-btn" data-bm-menu="${b.id}" data-bm-folder="${folderId}" style="font-size:14px">⋯</button>` : ""}
    </div>
  </div>`;
}
