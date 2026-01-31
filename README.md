# SurfLoop

A Chrome extension that transforms Surfline surf report pages into a fullscreen webcam display with automatic rotation between your favorite surf spots.

## Features

- **Fullscreen Webcam View**: Automatically detects and expands the webcam player to fill your screen with a clean 16:9 aspect ratio
- **Auto-Rotation**: Cycles through configured surf spots on a timer (default: 3 minutes)
- **Location Groups**: Organize spots into groups (e.g., "SF Bay", "Hawaii") - rotation stays within the current group
- **Configurable Settings**: Add, edit, and remove spots through the extension's options page
- **Sync Across Devices**: Settings sync via Chrome's storage API to all your logged-in browsers
- **Import/Export**: Backup and share your spot configurations as JSON

## Installation

### From Source

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the extension:
   ```bash
   npm run build
   ```
4. Open Chrome and navigate to `chrome://extensions`
5. Enable "Developer mode" (top right)
6. Click "Load unpacked" and select the `dist/` folder

### Development

Run with hot reload:
```bash
npm run dev
```

## Usage

1. Navigate to any Surfline surf report page (e.g., https://www.surfline.com/surf-report/pipeline/...)
2. The extension automatically activates and displays the webcam in fullscreen
3. **For the best experience, maximize your Chrome browser** (F11 or View → Enter Full Screen)
4. Use keyboard shortcuts to control playback

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←` | Previous spot in group |
| `→` | Next spot in group |
| `S` | Toggle auto-rotation on/off |
| `D` | Toggle debug mode |
| `Esc` | Exit fullscreen overlay |

### Configuring Spots

1. Right-click the extension icon and select "Options" (or go to `chrome://extensions`, find Surfline, click "Details" → "Extension options")
2. Add groups to organize your spots by region
3. Add spots to each group with a name and Surfline URL
4. Drag spots to reorder them within a group
5. Adjust the rotation delay in the Settings section

### Default Spots

The extension comes pre-configured with spots in two groups:

**SF Bay**: Linda Mar, Ocean Beach, Pleasure Point, Cowells, Steamer Lane, Mavericks, Half Moon Bay

**Hawaii**: Pipeline, Waikiki Beach, Laniakea, Honolua Bay

## Configuration Format

Export your configuration to share or backup. The JSON format:

```json
{
  "locationGroups": [
    {
      "id": "sf-bay",
      "name": "SF Bay",
      "spots": [
        {
          "id": "pipeline",
          "name": "Pipeline",
          "url": "https://www.surfline.com/surf-report/pipeline/..."
        }
      ]
    }
  ],
  "settings": {
    "autoNavigationEnabled": true,
    "rotationDelay": 180000
  }
}
```

## Tech Stack

- Chrome Extension Manifest V3
- Vite + @crxjs/vite-plugin for building
- jQuery for DOM manipulation
- Chrome Storage Sync API for settings persistence
