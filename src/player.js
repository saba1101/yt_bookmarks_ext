import { STATE } from './store.js';
import { getFolderById } from './data.js';
import { sortItems } from './utils.js';
import { showToast } from './ui/toast.js';

export function playSingleVideo(bm, folderLabel) {
  const queue = [{
    videoId:   bm.videoId,
    title:     bm.title || "Untitled",
    thumbnail: bm.thumbnail || `https://img.youtube.com/vi/${bm.videoId}/mqdefault.jpg`,
    url:       bm.url || `https://www.youtube.com/watch?v=${bm.videoId}`
  }];
  chrome.runtime.sendMessage({ type: "PLAY_ALL", folderLabel: folderLabel || "", queue });
}

export function playAllFolder(folderId) {
  const f = getFolderById(folderId);
  if (!f) return;
  const raw    = (f.items || []).filter(i => i.type === "bookmark");
  const sorted = sortItems(raw, STATE.settings.sort);
  if (!sorted.length) { showToast("No videos in this folder", "info"); return; }

  const queue = sorted.map(b => ({
    videoId:   b.videoId,
    title:     b.title || "Untitled",
    thumbnail: b.thumbnail || `https://img.youtube.com/vi/${b.videoId}/mqdefault.jpg`,
    url:       b.url || `https://www.youtube.com/watch?v=${b.videoId}`
  }));

  chrome.runtime.sendMessage({ type: "PLAY_ALL", folderLabel: f.label, queue }, (resp) => {
    if (chrome.runtime.lastError || !resp?.ok) return;
    showToast(`▶ Playing ${queue.length} video${queue.length !== 1 ? "s" : ""} from "${f.label}"`, "success");
  });
}
