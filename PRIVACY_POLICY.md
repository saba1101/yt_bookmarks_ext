# Privacy Policy

**Youtube Bookmarks** — Chrome Extension  
Last updated: May 2026

## Summary

This extension does not collect, transmit, or share any personal data. Everything is stored locally in your browser.

## Data collected

The extension stores the following data exclusively in Chrome's local storage (`chrome.storage.local`) on your device:

- Folder names and tag colours you create
- YouTube video titles, channel names, thumbnail URLs, and video IDs that you choose to save
- Your settings preferences (view mode, sort order, corner style)
- A flag indicating whether you have seen the first-run guide

No data ever leaves your device. There is no server, no account, and no analytics.

## Data you enter

When you save a video, the extension reads the video title, channel name, and video ID from the YouTube page you are already viewing. No additional browsing activity is monitored or recorded.

## Permissions explained

| Permission | Purpose |
|---|---|
| `storage` | Saves your bookmarks and settings locally in the browser |
| `sidePanel` | Displays the sidebar panel within Chrome |
| `tabs` | Reads the URL of the active tab to detect which video is open and to send play/pause commands to the YouTube player |
| `activeTab` | Allows communication with the currently active YouTube tab |
| `host_permissions` (`*.youtube.com`) | Injects the Save button on YouTube pages and listens for playback events |

The `tabs` permission is used solely to detect YouTube watch URLs and control playback. No tab history, browsing data, or other URLs are read or stored.

## Third-party services

The extension fetches video metadata (title, channel name) from YouTube's public oEmbed API (`https://www.youtube.com/oembed`) when you add a video by pasting a URL. This request is made directly from your browser to YouTube and is subject to Google's own privacy policy. No intermediary server is involved.

Thumbnail images are loaded directly from YouTube's CDN (`img.youtube.com`) in the same way any webpage would display them.

## Data retention and deletion

All data is stored locally and persists until you:

- Use **Settings → Clear all data** to delete everything, or
- Remove the extension from Chrome, which clears all associated storage automatically.

## Changes to this policy

If this policy is updated, the "Last updated" date above will change. Continued use of the extension after an update constitutes acceptance of the revised policy.

## Contact

For questions or concerns, contact: sabakhara44@gmail.com
