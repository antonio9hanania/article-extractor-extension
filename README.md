# Article Extractor Chrome Extension

A Chrome extension that extracts the main content from articles while removing ads, sidebars, and other distracting elements. The extension uses multiple extraction strategies with fallbacks to ensure reliable content extraction.

## Features

- Clean article extraction without ads, popups, or unnecessary content
- Multiple extraction strategies (Readability, OpenGraph, Schema, Custom Content)
- Supports multiple languages (including RTL languages like Hebrew)
- Maintains proper paragraph formatting
- Easy-to-use popup interface
- Copy to clipboard functionality
- Progress indication during extraction

## Installation

### For Users

1. Download the extension files:

   - Click on the green "Code" button and select "Download ZIP" from this repository
   - Extract the ZIP file to a folder on your computer

2. Install in Chrome:

   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" by toggling the switch in the top right corner
   - Click "Load unpacked" button that appears
   - Navigate to and select the folder where you extracted the extension files
   - The extension should now appear in your Chrome toolbar

3. Pin the Extension (Optional but Recommended):
   - Click the puzzle piece icon in Chrome toolbar
   - Find "Article Extractor" in the dropdown
   - Click the pin icon to keep it easily accessible

### Using the Extension

1. Navigate to any article page you want to extract
2. Click the extension icon in your Chrome toolbar
3. Click "Extract Article"
4. The cleaned article content will appear in the popup window
5. Use the "Copy to Clipboard" button to copy the content

### For Developers

1. Clone the repository:

```bash
git clone https://github.com/antonio9hanania/article-extractor-extension.git
```

2. Open Chrome and go to `chrome://extensions/`

3. Enable "Developer mode" in the top right corner

4. Click "Load unpacked" and select the extension directory

## Project Structure

```
article-extractor-extension/
├── LICENSE
├── README.md
├── manifest.json
├── background/
│   └── background.js
├── content/
│   ├── content.js
│   ├── extractors/
│   │   ├── BaseExtractor.js
│   │   ├── ReadabilityExtractor.js
│   │   ├── OpenGraphExtractor.js
│   │   ├── SchemaExtractor.js
│   │   └── ContentExtractor.js
│   └── config/
│       ├── cleaners.js        # HTML cleaning configurations
│       ├── selectors.js       # DOM selectors for content types
│       └── patterns.js        # Regular expressions and patterns
├── popup/
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
└── libs/
    └── readability.js
```

## Usage

1. Navigate to any article page
2. Click the extension icon in your Chrome toolbar
3. Click "Extract Article"
4. Wait for the extraction to complete
5. Use the "Copy to Clipboard" button to copy the cleaned content

## How It Works

The extension uses a multi-strategy approach to extract article content:

1. **Readability**: Uses Mozilla's Readability algorithm (primary method)
2. **OpenGraph**: Extracts content using OpenGraph metadata
3. **Schema**: Uses Schema.org article markup
4. **Custom Content**: Falls back to custom content extraction logic

Each strategy is tried in sequence until one succeeds in extracting valid content.

## Contributing

### Adding New Features

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/your-feature-name
```

3. Make your changes
4. Test thoroughly
5. Submit a Pull Request

### Areas for Improvement

1. **Content Extraction**:

   - Add support for more websites
   - Improve content cleaning patterns
   - Add more extraction strategies

2. **Pattern Management**:

   - Add more cleaning patterns to `patterns.js`
   - Improve selector patterns in `selectors.js`
   - Add site-specific rules

3. **User Interface**:

   - Add dark mode support
   - Add customization options
   - Improve progress indicators

4. **Performance**:

   - Optimize extraction algorithms
   - Implement caching
   - Improve load times

5. **Features**:
   - Add support for saving articles
   - Add export options (PDF, markdown, etc.)
   - Add sharing capabilities
   - Add article summarization

### Adding New Patterns

To add new patterns for content cleaning:

1. Open `content/config/patterns.js`
2. Add patterns to relevant sections:

```javascript
skipLines: [
    // Add new patterns here
    /your-pattern/,
],
```

### Adding New Selectors

To add new selectors for content identification:

1. Open `content/config/selectors.js`
2. Add selectors to relevant sections:

```javascript
articleSelectors: {
    mainContent: [
        // Add new selectors here
        '.your-selector',
    ],
}
```

## Testing

1. Load the unpacked extension in Chrome
2. Test on various news sites and articles
3. Check console for any errors
4. Verify content cleaning and formatting
5. Test on different languages and layouts

## Dependencies

- [Readability.js](https://github.com/mozilla/readability) - Mozilla's Readability implementation

### Third-Party Licenses

- Readability.js is licensed under Apache License 2.0

## Support

If you find a bug or want to suggest a feature:

1. Check existing issues
2. Create a new issue with:
   - Clear description
   - Steps to reproduce
   - Expected behavior
   - Screenshots if applicable

## Development Guidelines

1. Follow existing code style
2. Comment complex logic
3. Update documentation
4. Test thoroughly
5. Keep the code modular
