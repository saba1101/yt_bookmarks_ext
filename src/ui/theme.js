import { YTBM_CONFIG } from '../config.js';

export function applyTheme(themeId) {
  const theme = YTBM_CONFIG.themes.list.find(t => t.id === themeId);
  if (!theme) return;
  const root = document.documentElement;
  Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v));
}

export function applyStyle(styleId) {
  const style = YTBM_CONFIG.styles.list.find(s => s.id === styleId);
  if (!style) return;
  const root = document.documentElement;
  Object.entries(style.vars).forEach(([k, v]) => root.style.setProperty(k, v));
}
