export function extractYouTubeId(url) {
  try {
    const u = new URL(url.trim());
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1).split(/[?#]/)[0];
    return u.searchParams.get("v");
  } catch { return null; }
}

export function isYouTubeUrl(url) {
  return /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(url.trim());
}

export async function fetchYTMeta(videoId) {
  const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
  try {
    const res  = await fetch(oembedUrl);
    const data = await res.json();
    return {
      videoId,
      title:       data.title || `Video ${videoId}`,
      channelName: data.author_name || "",
      thumbnail:   `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      url:         `https://www.youtube.com/watch?v=${videoId}`
    };
  } catch {
    return {
      videoId,
      title:       "YouTube Video",
      channelName: "",
      thumbnail:   `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      url:         `https://www.youtube.com/watch?v=${videoId}`
    };
  }
}
