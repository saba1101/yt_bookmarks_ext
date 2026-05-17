# Youtube Bookmarks

A Chrome sidebar extension for saving YouTube videos into folders and playing them back.

## What it does

- Create folders with a name and colour tag
- Save videos by pasting a YouTube URL into a folder or dragging a link onto one
- Click a video to open it in a tab, or use **Play All** to play every video in a folder one after another in the same tab
- Bookmark cards show a **Now Playing** badge when the matching video is open in any YouTube tab — clears automatically when the tab closes
- Search and sort videos by name, date, or tag colour
- Select multiple items to delete in bulk
- **Unpack** view shows all saved videos across every folder in one flat list
- Subfolders are supported
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
