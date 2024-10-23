class BackgroundManager {
  constructor() {
    this.supportedDomains = new Set([
      "medium.com",
      "nytimes.com",
      "washingtonpost.com",
      "theguardian.com",
      "bbc.com",
      "cnn.com",
      // Add more supported domains
    ]);

    this.initializeMessageListeners();
  }

  initializeMessageListeners() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      switch (message.action) {
        case "checkSupport":
          sendResponse({ supported: this.isUrlSupported(message.url) });
          break;
        case "extract":
          this.handleExtraction(message.tabId);
          break;
      }
      return true; // Keep message channel open for async responses
    });
  }

  isUrlSupported(url) {
    try {
      const domain = new URL(url).hostname;
      return (
        this.supportedDomains.has(domain) || this.hasArticleStructure(domain)
      );
    } catch {
      return false;
    }
  }

  async hasArticleStructure(domain) {
    // Implement detection of article structure
    // This could check for common article elements
    return true; // For now, assume all domains are supported
  }

  async handleExtraction(tabId) {
    try {
      // Inject content script
      await chrome.scripting.executeScript({
        target: { tabId },
        files: ["content/content.js"],
      });

      // Start extraction
      chrome.tabs.sendMessage(tabId, { action: "startExtraction" });
    } catch (error) {
      console.error("Extraction failed:", error);
      this.sendProgressUpdate(0, "Extraction failed");
    }
  }

  sendProgressUpdate(percent, status) {
    chrome.runtime.sendMessage({
      action: "updateProgress",
      percent,
      status,
    });
  }
}
chrome.runtime.onInstalled.addListener(() => {
  // Set initial popup height
  chrome.action.setPopup({
    popup: "popup/popup.html",
  });
});

// Listen for the popup being opened
chrome.action.onClicked.addListener((tab) => {
  chrome.action.openPopup();
});

// Keep the popup open
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "keepAlive") {
    port.onDisconnect.addListener(() => {
      // Handle popup closing if needed
    });
  }
});

// Initialize background manager
const backgroundManager = new BackgroundManager();
