(() => {
  let videoEl          = null;
  let endedHandler     = null;
  let errorHandler     = null;
  let playHandler      = null;
  let pauseHandler     = null;
  let pauseDebounceTid = null;
  let trackedVid       = null;

  function getVideoId() {
    return new URL(location.href).searchParams.get("v");
  }

  function attachVideoListeners() {
    const vid = getVideoId();
    if (!vid || vid === trackedVid) return;

    const el = document.querySelector("video.html5-main-video") || document.querySelector("video");
    if (!el) return;

    if (videoEl) {
      if (endedHandler)  videoEl.removeEventListener("ended",  endedHandler);
      if (errorHandler)  videoEl.removeEventListener("error",  errorHandler);
      if (playHandler)   videoEl.removeEventListener("play",   playHandler);
      if (pauseHandler)  videoEl.removeEventListener("pause",  pauseHandler);
      if (pauseDebounceTid) { clearTimeout(pauseDebounceTid); pauseDebounceTid = null; }
    }

    videoEl    = el;
    trackedVid = vid;

    endedHandler = () => {
      try { chrome.runtime.sendMessage({ type: "VIDEO_ENDED",   videoId: vid }); } catch (_) {}
    };
    errorHandler = () => {
      try { chrome.runtime.sendMessage({ type: "VIDEO_ERRORED", videoId: vid }); } catch (_) {}
    };
    playHandler = () => {
      if (pauseDebounceTid) { clearTimeout(pauseDebounceTid); pauseDebounceTid = null; }
      if (pauseGuardClear) return;
      try { chrome.runtime.sendMessage({ type: "VIDEO_PLAYING", videoId: vid }); } catch (_) {}
    };
    pauseHandler = () => {
      if (el.ended) return;
      clearTimeout(pauseDebounceTid);
      pauseDebounceTid = setTimeout(() => {
        pauseDebounceTid = null;
        try { chrome.runtime.sendMessage({ type: "VIDEO_PAUSED", videoId: vid }); } catch (_) {}
      }, 400);
    };

    videoEl.addEventListener("ended",  endedHandler);
    videoEl.addEventListener("error",  errorHandler);
    videoEl.addEventListener("play",   playHandler);
    videoEl.addEventListener("pause",  pauseHandler);
  }

  let pauseGuardClear = null;

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type !== "PLAYER_CMD") return;
    applyCmd(msg.action, 0);
  });

  function applyCmd(action, attempt) {
    const video = document.querySelector("video.html5-main-video") || document.querySelector("video");
    if (!video) {
      if (attempt < 15) setTimeout(() => applyCmd(action, attempt + 1), 200);
      return;
    }

    if (pauseGuardClear) { pauseGuardClear(); pauseGuardClear = null; }

    if (action === "pause") {
      video.pause();
      const rePause = () => video.pause();
      video.addEventListener("play", rePause, { once: true });
      const tid = setTimeout(() => {
        video.removeEventListener("play", rePause);
        pauseGuardClear = null;
      }, 1500);
      pauseGuardClear = () => {
        video.removeEventListener("play", rePause);
        clearTimeout(tid);
        pauseGuardClear = null;
      };
    }
    if (action === "play") {
      video.play().catch(() => {});
    }
  }

  const observer = new MutationObserver(() => {
    try { if (!chrome.runtime.id) throw new Error(); } catch (_) {
      observer.disconnect();
      return;
    }
    if (location.pathname === "/watch" && getVideoId()) attachVideoListeners();
  });

  observer.observe(document.body, { childList: true, subtree: true });
  if (location.pathname === "/watch") attachVideoListeners();
})();
