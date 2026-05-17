import { STATE, saveState } from './store.js';
import { uid } from './utils.js';

export function getFolderById(id) {
  function search(folders) {
    for (const f of folders) {
      if (f.id === id) return f;
      for (const item of (f.items || [])) {
        if (item.type === "folder" && item.id === id) return item;
      }
      const child = search((f.items || []).filter(i => i.type === "folder"));
      if (child) return child;
    }
    return null;
  }
  return search(STATE.folders);
}

export function getFolderContents(folderId) {
  if (!folderId) return { subFolders: STATE.folders, bookmarks: [] };
  const f = getFolderById(folderId);
  if (!f) return { subFolders: [], bookmarks: [] };
  return {
    subFolders: (f.items || []).filter(i => i.type === "folder"),
    bookmarks:  (f.items || []).filter(i => i.type === "bookmark")
  };
}

export function getParentFolder(id) {
  function search(items, parent) {
    for (const item of items) {
      if (item.id === id) return parent;
      if (item.type === "folder") {
        const found = search(item.items || [], item);
        if (found !== undefined) return found;
      }
    }
    return undefined;
  }
  for (const f of STATE.folders) {
    if (f.id === id) return null;
    const found = search(f.items || [], f);
    if (found !== undefined) return found;
  }
  return null;
}

export function findBookmarkByVideoId(videoId) {
  function search(items, folder) {
    for (const item of items) {
      if (item.type === "bookmark" && item.videoId === videoId) return { bookmark: item, folder };
      if (item.type === "folder") {
        const found = search(item.items || [], item);
        if (found) return found;
      }
    }
    return null;
  }
  for (const f of STATE.folders) {
    const found = search(f.items || [], f);
    if (found) return found;
  }
  return null;
}

export function getAllBookmarksFlat() {
  const result = [];
  function collect(items, folderLabel, folderId) {
    for (const item of items) {
      if (item.type === "bookmark") result.push({ bookmark: item, folderLabel, folderId });
      else if (item.type === "folder") collect(item.items || [], item.label, item.id);
    }
  }
  for (const f of STATE.folders) collect(f.items || [], f.label, f.id);
  return result;
}

export function getFlatBookmarksFromFolder(rootFolderId) {
  const result = [];
  function collect(items, flabel, fid) {
    for (const item of items) {
      if (item.type === "bookmark") result.push({ bookmark: item, folderLabel: flabel, folderId: fid });
      else if (item.type === "folder") collect(item.items || [], item.label, item.id);
    }
  }
  const f = getFolderById(rootFolderId);
  if (f) collect(f.items || [], f.label, f.id);
  return result;
}

export function findItemById(id) {
  function search(items, parentId) {
    for (const item of items) {
      if (item.id === id) return { type: item.type, parentId };
      if (item.type === "folder") {
        const found = search(item.items || [], item.id);
        if (found) return found;
      }
    }
    return null;
  }
  for (const f of STATE.folders) {
    if (f.id === id) return { type: "folder", parentId: null };
    const found = search(f.items || [], f.id);
    if (found) return found;
  }
  return null;
}

export function getBMById(bmId, folderId) {
  const f = getFolderById(folderId);
  return (f?.items || []).find(i => i.id === bmId);
}

export function addFolder(label, colorId, parentId = null) {
  const folder = { id: uid(), type: "folder", label, color: colorId, items: [], createdAt: Date.now() };
  if (parentId) {
    const parent = getFolderById(parentId);
    if (parent) { parent.items = parent.items || []; parent.items.unshift(folder); }
  } else {
    STATE.folders.unshift(folder);
  }
  saveState();
  return folder;
}

export function deleteFolder(id, parentId = null) {
  if (parentId) {
    const parent = getFolderById(parentId);
    if (parent) parent.items = (parent.items || []).filter(i => i.id !== id);
  } else {
    STATE.folders = STATE.folders.filter(f => f.id !== id);
  }
  saveState();
}

export function renameFolder(id, newLabel) {
  const f = getFolderById(id);
  if (f) { f.label = newLabel; saveState(); }
}

export function recolorFolder(id, colorId) {
  const f = getFolderById(id);
  if (f) { f.color = colorId; saveState(); }
}

export function addBookmark(folderId, data) {
  const item = { id: uid(), type: "bookmark", ...data, addedAt: Date.now() };
  const f = getFolderById(folderId);
  if (f) { f.items = f.items || []; f.items.unshift(item); }
  saveState();
  return item;
}

export function deleteBookmark(bookmarkId, folderId) {
  const f = getFolderById(folderId);
  if (f) { f.items = (f.items || []).filter(i => i.id !== bookmarkId); saveState(); }
}

export function renameBookmark(bookmarkId, folderId, newTitle) {
  const f = getFolderById(folderId);
  if (f) {
    const bm = (f.items || []).find(i => i.id === bookmarkId);
    if (bm) { bm.title = newTitle; saveState(); }
  }
}

export function recolorBookmark(bookmarkId, folderId, colorId) {
  const f = getFolderById(folderId);
  if (f) {
    const bm = (f.items || []).find(i => i.id === bookmarkId);
    if (bm) { bm.color = colorId; saveState(); }
  }
}
