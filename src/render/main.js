import { YTBM_CONFIG } from '../config.js';
import { STATE, UI, currentFolderId } from '../store.js';
import { getFolderById, getFolderContents, getAllBookmarksFlat, getFlatBookmarksFromFolder } from '../data.js';
import { sortItems, esc } from '../utils.js';
import { renderFolderCard, renderFolderListRow, renderBMCard, renderBMListRow } from './components.js';
import { bindMainEvents } from '../events/main.js';
import { bindContentEvents } from '../events/content.js';

export function renderMain(render) {
  const folderId   = currentFolderId();
  const folder     = folderId ? getFolderById(folderId) : null;
  const { subFolders, bookmarks } = getFolderContents(folderId);
  const sortId     = STATE.settings.sort;
  const folderView = STATE.settings.folderView;
  const bmView     = STATE.settings.bookmarkView;
  const search     = UI.search.toLowerCase();
  const selCount   = UI.selectedIds.size;

  const filtSubFolders = sortItems(
    subFolders.filter(f => !search || f.label.toLowerCase().includes(search)), sortId);
  const filtBM = sortItems(
    bookmarks.filter(b => !search || b.title?.toLowerCase().includes(search)), sortId);

  const showBreadcrumbs = UI.path.length > 0;
  const showBMView      = folderId || UI.unpacked;

  document.getElementById("app").innerHTML = `
    <div class="app-header">
      <div class="logo">YT</div>
      <div class="header-title">${folder ? esc(folder.label) : YTBM_CONFIG.app.name}</div>
      <div class="header-actions">
        ${UI.multiSelect ? `
          <button class="label-btn danger" id="btn-delete-sel" style="${selCount === 0 ? "display:none" : ""}">Delete (${selCount})</button>
          <button class="label-btn" id="btn-cancel-sel">Cancel</button>
        ` : `
          ${folderId ? `<button class="label-btn" id="btn-back">Back</button>` : ""}
          ${!folderId ? `<button class="label-btn accent" id="btn-add">+ New</button>` : ""}
          <button class="label-btn" id="btn-select">Select</button>
          <button class="label-btn" id="btn-settings">Settings</button>
        `}
      </div>
    </div>

    ${showBreadcrumbs ? `
    <div class="breadcrumbs" id="breadcrumbs">
      <div class="bc-item" data-bcid="">Home</div>
      ${UI.path.map((id, i) => {
        const f = getFolderById(id);
        return `<span class="bc-sep">›</span>
                <div class="bc-item ${i === UI.path.length - 1 ? "active" : ""}" data-bcid="${id}">
                  ${f?.label || "Folder"}
                </div>`;
      }).join("")}
    </div>` : ""}

    <div class="toolbar">
      <div class="search-input-wrap">
        <input type="text" placeholder="Search…" id="search-input" value="${UI.search}" />
      </div>
      <div class="toolbar-group">
        <button class="tb-btn ${(showBMView ? bmView : folderView) === "grid" ? "active" : ""}" data-view-mode="grid">Grid</button>
        <button class="tb-btn ${(showBMView ? bmView : folderView) === "list" ? "active" : ""}" data-view-mode="list">List</button>
      </div>
      <select class="sort-select" id="sort-select">
        ${YTBM_CONFIG.sorting.options.map(o => `<option value="${o.id}" ${sortId === o.id ? "selected" : ""}>${o.label}</option>`).join("")}
      </select>
      <button class="tb-btn ${UI.unpacked ? "active" : ""}" id="btn-unpack" title="Show all videos flat">Unpack</button>
    </div>

    <div class="content-area" id="content-area">
      ${UI.unpacked
        ? renderUnpackedView(folderId)
        : folderId
          ? renderFolderContents(filtSubFolders, filtBM, folderId, bmView)
          : renderRootFolders(filtSubFolders, folderView)}
    </div>
  `;

  bindMainEvents(folderId, render, renderContent);
}

export function renderContent(folderId, render) {
  const { subFolders, bookmarks } = getFolderContents(folderId);
  const sortId = STATE.settings.sort;
  const bmView = STATE.settings.bookmarkView;
  const search = UI.search.toLowerCase();
  const filtSubs = sortItems(subFolders.filter(f => !search || f.label.toLowerCase().includes(search)), sortId);
  const filtBM   = sortItems(bookmarks.filter(b => !search || b.title?.toLowerCase().includes(search)), sortId);
  const ca = document.getElementById("content-area");
  if (!ca) return;
  ca.innerHTML = UI.unpacked
    ? renderUnpackedView(folderId)
    : folderId
      ? renderFolderContents(filtSubs, filtBM, folderId, bmView)
      : renderRootFolders(filtSubs, STATE.settings.folderView);
  bindContentEvents(folderId, render);
}

function renderUnpackedView(folderId) {
  const sortId = STATE.settings.sort;
  const bmView = STATE.settings.bookmarkView;
  const search = UI.search.toLowerCase();

  let entries = folderId ? getFlatBookmarksFromFolder(folderId) : getAllBookmarksFlat();
  if (search) entries = entries.filter(e => e.bookmark.title?.toLowerCase().includes(search));

  const bms    = sortItems(entries.map(e => e.bookmark), sortId);
  const sorted = bms.map(bm => entries.find(e => e.bookmark.id === bm.id)).filter(Boolean);

  if (sorted.length === 0) {
    return `<div class="empty-state">
      <div class="empty-title">No videos yet</div>
      <div class="empty-sub">Add videos to your folders to see them here</div>
    </div>`;
  }

  if (bmView === "list") {
    return `<div class="items-list">${sorted.map(({ bookmark: b, folderId: fId, folderLabel }, i) =>
      renderBMListRow(b, fId, i, folderLabel)).join("")}</div>`;
  }
  return `<div class="items-grid">${sorted.map(({ bookmark: b, folderId: fId, folderLabel }, i) =>
    renderBMCard(b, fId, i, folderLabel)).join("")}</div>`;
}

function renderRootFolders(folders, view) {
  if (folders.length === 0) {
    return `<div class="empty-state">
      <div class="empty-title">No folders yet</div>
      <div class="empty-sub">Press + New to create your first folder</div>
    </div>`;
  }
  if (view === "list") {
    return `<div class="items-list">${folders.map((f, i) => renderFolderListRow(f, i)).join("")}</div>`;
  }
  return `<div class="items-grid folder-grid">${folders.map((f, i) => renderFolderCard(f, i)).join("")}</div>`;
}

function renderFolderContents(subFolders, bookmarks, folderId, bmView) {
  const dropZone = `
    <div class="drop-zone" id="drop-zone">
      <div class="dz-text">Drop a YouTube link here</div>
    </div>
    <div class="add-url-wrap">
      <input type="text" id="url-input" placeholder="Paste YouTube URL…" />
      <button class="btn-primary" id="btn-add-url">Add</button>
    </div>`;

  let content = "";

  if (subFolders.length > 0) {
    const fview = STATE.settings.folderView;
    content += `<div class="subfolders-section">
      <div class="section-label">Subfolders</div>
      ${fview === "list"
        ? `<div class="items-list">${subFolders.map((f, i) => renderFolderListRow(f, i)).join("")}</div>`
        : `<div class="items-grid folder-grid">${subFolders.map((f, i) => renderFolderCard(f, i)).join("")}</div>`
      }
    </div>`;
  }

  if (bookmarks.length === 0 && subFolders.length === 0) {
    content = `<div class="empty-state">
      <div class="empty-title">Folder is empty</div>
      <div class="empty-sub">Drop a YouTube link onto this folder or paste a URL below</div>
    </div>`;
  } else if (bookmarks.length > 0) {
    content += `
      <div class="videos-section-hd" style="margin-top:${subFolders.length > 0 ? "8px" : "0"}">
        <button class="play-all-videos-btn" data-play-folder="${folderId}">▶ Play All</button>
        <span class="videos-label">Videos</span>
      </div>`;
    if (bmView === "list") {
      content += `<div class="items-list">${bookmarks.map((b, i) => renderBMListRow(b, folderId, i)).join("")}</div>`;
    } else {
      content += `<div class="items-grid">${bookmarks.map((b, i) => renderBMCard(b, folderId, i)).join("")}</div>`;
    }
  }

  return dropZone + content;
}
