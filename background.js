chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ tabId: tab.id });
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setOptions({ enabled: true });
});

let Q = {
  active:       false,
  tabId:        null,
  folderLabel:  "",
  queue:        [],
  currentIndex: 0,
  isPaused:     false
};

chrome.storage.local.get("ytbm_queue", (data) => {
  if (data.ytbm_queue) Q = { ...Q, ...data.ytbm_queue };
});

function saveQ() {
  chrome.storage.local.set({ ytbm_queue: Q });
}

async function tabExists(tabId) {
  try { await chrome.tabs.get(tabId); return true; } catch { return false; }
}

async function goTo(index) {
  if (!Q.active) return;
  if (index < 0) index = 0;

  if (index >= Q.queue.length) {
    Q.active = false;
    Q.tabId  = null;
    saveQ();
    return;
  }

  Q.currentIndex = index;
  Q.isPaused     = false;
  const video    = Q.queue[index];

  try {
    if (Q.tabId && await tabExists(Q.tabId)) {
      await chrome.tabs.update(Q.tabId, { url: video.url });
    } else {
      const tab = await chrome.tabs.create({ url: video.url });
      Q.tabId   = tab.id;
    }
  } catch {
    goTo(index + 1);
    return;
  }

  saveQ();
}

chrome.tabs.onRemoved.addListener((tabId) => {
  if (Q.active && tabId === Q.tabId) {
    Q.active = false;
    Q.tabId  = null;
    saveQ();
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, info) => {
  if (tabId !== Q.tabId || info.status !== "complete" || !Q.active || !Q.isPaused) return;
  await new Promise(r => setTimeout(r, 600));
  if (Q.isPaused && Q.active && Q.tabId === tabId) {
    try { await chrome.tabs.sendMessage(tabId, { type: "PLAYER_CMD", action: "pause" }); } catch {}
  }
});

async function handleControl(action) {
  const sendCmd = async (cmd) => {
    if (!Q.tabId) return;
    if (!await tabExists(Q.tabId)) {
      Q.active = false;
      Q.tabId  = null;
      saveQ();
      return;
    }
    try { await chrome.tabs.sendMessage(Q.tabId, { type: "PLAYER_CMD", action: cmd }); } catch {}
  };

  switch (action) {
    case "play":
      Q.isPaused = false;
      saveQ();
      await sendCmd("play");
      break;
    case "pause":
      Q.isPaused = true;
      saveQ();
      await sendCmd("pause");
      break;
    case "next":
      await goTo(Q.currentIndex + 1);
      break;
    case "prev":
      await goTo(Math.max(0, Q.currentIndex - 1));
      break;
    case "stop":
      if (Q.tabId) { try { await chrome.tabs.remove(Q.tabId); } catch {} }
      Q.active   = false;
      Q.tabId    = null;
      Q.isPaused = false;
      saveQ();
      break;
  }
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  switch (msg.type) {

    case "OPEN_SIDEBAR":
      chrome.sidePanel.open({ tabId: sender.tab.id });
      sendResponse({ ok: true });
      return true;

    case "PLAY_ALL": {
      const { folderLabel, queue } = msg;
      if (!queue?.length) { sendResponse({ ok: false, reason: "empty" }); return true; }
      Q = { active: true, tabId: Q.tabId, folderLabel, queue, currentIndex: 0, isPaused: false };
      goTo(0);
      sendResponse({ ok: true });
      return true;
    }

    case "VIDEO_ENDED":
      if (Q.active && !Q.isPaused && sender.tab?.id === Q.tabId) {
        const expected = Q.queue[Q.currentIndex]?.videoId;
        if (!expected || msg.videoId === expected) goTo(Q.currentIndex + 1);
      }
      return;

    case "VIDEO_ERRORED":
      if (Q.active && sender.tab?.id === Q.tabId) goTo(Q.currentIndex + 1);
      return;

    case "VIDEO_PLAYING":
      if (Q.active && sender.tab?.id === Q.tabId) {
        if (Q.isPaused) { Q.isPaused = false; saveQ(); }
      }
      return;

    case "VIDEO_PAUSED":
      if (Q.active && sender.tab?.id === Q.tabId) {
        if (!Q.isPaused) { Q.isPaused = true; saveQ(); }
      }
      return;

    case "PLAYER_CONTROL":
      handleControl(msg.action);
      sendResponse({ ok: true });
      return true;

    case "GET_QUEUE":
      sendResponse({ queue: Q });
      return true;
  }
});
