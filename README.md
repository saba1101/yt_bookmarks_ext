# Youtube Bookmarks

A Chrome sidebar extension for saving YouTube videos into colour-tagged folders and playing them back — no account, no sync, no backend.

---

## Screenshots

### Welcome & Onboarding

<p align="center">
  <img src="screenshots/Screenshot%202026-05-17%20at%2018.35.14.png" width="320" alt="Onboarding screen">
</p>

The first time you open the extension you get a clean three-step overview — **Folders & Saving**, **Playing & Browsing**, and **Settings & Backup** — before hitting **Get Started**.

---

### Home — Folder Grid

<p align="center">
  <img src="screenshots/Screenshot%202026-05-17%20at%2018.36.04.png" width="560" alt="Empty home screen">
  &nbsp;&nbsp;
  <img src="screenshots/Screenshot%202026-05-17%20at%2018.42.22.png" width="560" alt="Home screen with folders and context menu">
</p>

The home screen lists all your folders in a grid. The toolbar gives you **+ New**, **Select** (bulk actions), **Settings**, a live search bar, Grid/List toggle, a sort dropdown, and **Unpack**.  
Right-clicking any folder opens a context menu to **Rename**, **Change color**, **Open**, or **Delete** it.

---

### Creating a Folder

<p align="center">
  <img src="screenshots/Screenshot%202026-05-17%20at%2018.38.07.png" width="320" alt="New folder dialog">
</p>

The **New Folder** dialog lets you type a name (emoji-friendly) and pick from a palette of colour tags that are shown on the folder card — handy for telling collections apart at a glance.

---

### Inside a Folder — Adding Videos

<p align="center">
  <img src="screenshots/Screenshot%202026-05-17%20at%2018.38.36.png" width="560" alt="Empty folder with drop zone and URL input">
</p>

Inside an empty folder you see two ways to add videos: a **drag-and-drop zone** at the top for dropping links straight from the YouTube tab bar, and a **Paste YouTube URL** input below it.

---

### Grid View & Now Playing

<p align="center">
  <img src="screenshots/Screenshot%202026-05-17%20at%2018.40.21.png" width="560" alt="Folder in grid view with Now Playing badge">
</p>

Once a folder has videos, grid view shows rich thumbnails alongside the video title and channel. The **▶ Play All** button queues the entire folder in a single tab. The card with a green **Now Playing** badge is the video currently open in any YouTube tab — the badge clears automatically when that tab closes.

---

### List View

<p align="center">
  <img src="screenshots/Screenshot%202026-05-17%20at%2018.40.43.png" width="560" alt="Folder in list view">
</p>

Switch to **List** for a denser layout with full titles. The same search, sort, and Play All controls stay in place.

---

### Settings

<p align="center">
  <img src="screenshots/Screenshot%202026-05-17%20at%2018.42.42.png" width="320" alt="Settings panel">
</p>

Settings lets you choose a **Corner Style** (Smooth for soft curves, Cubic for sharp edges), set your preferred default view for folders and bookmarks independently, and manage your data with **Export / Import JSON** or **Clear all data**.

---

### JSON Export

<p align="center">
  <img src="screenshots/Screenshot%202026-05-17%20at%2018.43.25.png" width="560" alt="Exported JSON data file">
</p>

Export drops a single `.json` file with a versioned snapshot of all your folders, subfolders, and bookmarks — every URL, title, thumbnail, and timestamp included. Import restores it in full.

---

## Features

- Create folders with a name and colour tag
- Save videos by pasting a YouTube URL or dragging a link into a folder
- Click a video to open it in a tab, or use **Play All** to queue every video in a folder into the same tab
- **Now Playing** badge appears on the matching card whenever that video is open in any YouTube tab — clears when the tab closes
- Search and sort by name, date, or colour tag
- Select multiple items for bulk delete
- **Unpack** view shows all saved videos across every folder in one flat list
- Subfolders supported
- Export all data as JSON or restore from a backup in Settings

## Installation

1. Download or clone this repo
2. Go to `chrome://extensions` in Chrome
3. Enable **Developer mode**
4. Click **Load unpacked** and select the project folder

## Permissions

| Permission | Why |
|---|---|
| `storage` | Saves folders and bookmarks locally |
| `sidePanel` | Shows the sidebar |
| `tabs` | Checks open YouTube tabs to drive the Now Playing badge |
| `activeTab` | Opens the sidebar when the toolbar icon is clicked |
| `host_permissions` (`*.youtube.com`) | Runs a content script that tracks video playback for queue functionality |

## Tech

- Chrome Manifest V3
- Vanilla JS, HTML, CSS — no build step, no dependencies
- Everything stored locally, no backend

## License

MIT — see [LICENSE](LICENSE).
