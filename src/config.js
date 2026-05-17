export const YTBM_CONFIG = {
  app: {
    name:       "Youtube Bookmarks",
    version:    "1.0.0",
    storageKey: "ytbm_data",
  },

  colors: {
    palette: [
      { id: "red",    label: "Crimson",   hex: "#ef4444" },
      { id: "orange", label: "Tangerine", hex: "#f97316" },
      { id: "lime",   label: "Lime",      hex: "#84cc16" },
      { id: "white",  label: "Pearl",     hex: "#f1f5f9" },
      { id: "black",  label: "Obsidian",  hex: "#1e293b" }
    ]
  },

  themes: {
    default: "frost",
    list: [
      {
        id: "frost",
        label: "Frost",
        previewBg: "#171719",
        previewText: "#84cc16",
        vars: {
          "--bg-base":      "#0f0f11",
          "--bg-surface":   "#171719",
          "--bg-elevated":  "#1e1e22",
          "--bg-hover":     "#262629",
          "--bg-input":     "#121214",
          "--bg-glass":     "rgba(255,255,255,0.03)",
          "--bg-glass-2":   "rgba(255,255,255,0.06)",
          "--text-1":       "#f5f5f8",
          "--text-2":       "#a8a8c0",
          "--text-3":       "#6c6c84",
          "--border":       "rgba(255,255,255,0.06)",
          "--border-2":     "rgba(255,255,255,0.11)",
          "--accent":       "#84cc16",
          "--accent-hover": "#65a30d",
          "--accent-dim":   "rgba(132,204,22,0.10)",
          "--accent-glow":  "rgba(132,204,22,0.16)",
          "--shadow":       "0 4px 20px rgba(0,0,0,0.55)"
        }
      }
    ]
  },

  styles: {
    default: "rounded",
    list: [
      {
        id: "rounded",
        label: "Smooth",
        icon: "◯",
        description: "Soft curves and fluid design",
        vars: {
          "--r-xs":   "4px",
          "--r-sm":   "8px",
          "--r-md":   "12px",
          "--r-lg":   "16px",
          "--r-xl":   "20px",
          "--r-full": "9999px"
        }
      },
      {
        id: "sharp",
        label: "Cubic",
        icon: "□",
        description: "Sharp corners and grid precision",
        vars: {
          "--r-xs":   "0px",
          "--r-sm":   "2px",
          "--r-md":   "2px",
          "--r-lg":   "4px",
          "--r-xl":   "4px",
          "--r-full": "2px"
        }
      }
    ]
  },

  views: {
    folder:   { default: "grid", options: ["grid", "list"] },
    bookmark: { default: "grid", options: ["grid", "list"] }
  },

  sorting: {
    default: "date-desc",
    options: [
      { id: "alpha-asc",  label: "A → Z",       icon: "↑A" },
      { id: "alpha-desc", label: "Z → A",        icon: "↓A" },
      { id: "date-asc",   label: "Oldest First", icon: "⏱" },
      { id: "date-desc",  label: "Newest First", icon: "★" },
      { id: "tag",        label: "By Tag Color", icon: "◉" }
    ]
  },

  defaultState: {
    setup:   { completed: false, welcomed: false },
    folders: [],
    settings: {
      theme:        "frost",
      style:        "rounded",
      folderView:   "grid",
      bookmarkView: "grid",
      sort:         "date-desc"
    }
  }
};
