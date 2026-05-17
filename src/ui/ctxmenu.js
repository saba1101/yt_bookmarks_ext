let activeCtxMenu = null;

export function closeCtxMenu() {
  if (activeCtxMenu) { activeCtxMenu.remove(); activeCtxMenu = null; }
}

export function showCtxMenu(x, y, items) {
  closeCtxMenu();
  const menu = document.createElement("div");
  menu.className = "ctx-menu";

  items.forEach(item => {
    if (item === "sep") {
      const sep = document.createElement("div");
      sep.className = "ctx-sep";
      menu.appendChild(sep);
      return;
    }
    const el = document.createElement("div");
    el.className = "ctx-item" + (item.danger ? " danger" : "");
    el.textContent = item.label;
    el.addEventListener("click", () => { closeCtxMenu(); item.action(); });
    menu.appendChild(el);
  });

  document.body.appendChild(menu);
  activeCtxMenu = menu;

  const mw = menu.offsetWidth || 160;
  const mh = menu.offsetHeight || 200;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  menu.style.left = (x + mw > vw ? vw - mw - 8 : x) + "px";
  menu.style.top  = (y + mh > vh ? vh - mh - 8 : y) + "px";
}
