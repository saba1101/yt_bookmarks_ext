import { YTBM_CONFIG } from './config.js';

export function uid() {
  return Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
}

export function esc(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function colorHex(colorId) {
  const c = YTBM_CONFIG.colors.palette.find(p => p.id === colorId);
  return c ? c.hex : colorId;
}

export function colorLabel(colorId) {
  const c = YTBM_CONFIG.colors.palette.find(p => p.id === colorId);
  return c ? c.label : colorId;
}

export function formatDate(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function relativeDate(ts) {
  if (!ts) return "";
  const diff = Date.now() - ts;
  const min = 60000, hr = 3600000, day = 86400000;
  if (diff < min)    return "just now";
  if (diff < hr)     return `${Math.floor(diff / min)}m ago`;
  if (diff < day)    return `${Math.floor(diff / hr)}h ago`;
  if (diff < day*7)  return `${Math.floor(diff / day)}d ago`;
  return formatDate(ts);
}

export function sortItems(items, sortId) {
  const arr = [...items];
  const tagOrder = ["red", "orange", "lime", "white", "black"];
  switch (sortId) {
    case "alpha-asc":  return arr.sort((a, b) => (a.label||a.title||"").localeCompare(b.label||b.title||""));
    case "alpha-desc": return arr.sort((a, b) => (b.label||b.title||"").localeCompare(a.label||a.title||""));
    case "date-asc":   return arr.sort((a, b) => (a.createdAt||a.addedAt||0) - (b.createdAt||b.addedAt||0));
    case "date-desc":  return arr.sort((a, b) => (b.createdAt||b.addedAt||0) - (a.createdAt||a.addedAt||0));
    case "tag":        return arr.sort((a, b) => tagOrder.indexOf(a.color) - tagOrder.indexOf(b.color));
    default:           return arr;
  }
}
