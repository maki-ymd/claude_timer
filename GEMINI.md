# AI Usage Tracker - Project Context

## Project Overview
**AI Usage Tracker** is a Chrome Extension (Manifest V3) designed to monitor Claude's message limit reset time.
- **Claude:** Tracks the "reset time" for message limits and displays it in the extension badge.
- **Quick Access:** Clicking the extension icon opens the Claude usage settings page.

## Key Configuration (`manifest.json`)
- **Version:** 1.7
- **Permissions:** `storage`, `alarms`.
- **Host Permissions:** `https://claude.ai/*`.
- **Action:** Empty (handled by `chrome.action.onClicked` in `background.js`).

## File Structure & Logic

### Core Files
- **`background.js`**: The service worker.
    - Listens for `SET_RESET_TIME` messages.
    - Updates local storage with `resetAt`.
    - Updates the extension badge with a countdown or "OK".
    - Sets up a 1-minute alarm to refresh the badge.
    - **New:** Opens `https://claude.ai/settings/usage` when the extension icon is clicked.
- **`content_claude.js`**:
    - Runs on `https://claude.ai/settings/usage`.
    - Scrapes the text containing "リセット" (Reset) to extract hours/minutes.
    - Sends `SET_RESET_TIME` message to `background.js`.
    - Uses `MutationObserver` to handle dynamic content changes.

## Data Flow & Storage
1.  **Claude Flow:**
    - `content_claude.js` -> `chrome.runtime.sendMessage({ type: "SET_RESET_TIME", ... })`
    - `background.js` -> `chrome.storage.local.set({ resetAt: ... })`
    - Badge updates based on `resetAt`.

## Development & Usage
1.  **Installation:**
    - Open `chrome://extensions/`
    - Enable "Developer mode".
    - Click "Load unpacked" and select this directory.
2.  **Usage:**
    - Click the extension icon to go to the Claude usage settings page and update the timer.
    - The remaining time until reset will appear on the extension icon badge.

## Known Issues / TODOs
- **Localization:** The scraper logic in `content_claude.js` is hardcoded for Japanese text ("リセット", "時間", "分").
