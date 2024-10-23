class PopupManager {
  constructor() {
    this.extractButton = document.getElementById("extractButton");
    this.copyButton = document.getElementById("copyButton");
    this.closeButton = document.getElementById("closeButton");
    this.supportStatus = document.getElementById("supportStatus");
    this.extractedContent = document.getElementById("extractedContent");
    this.progressBar = document.getElementById("progressFill");
    this.progressText = document.getElementById("progressText");

    this.initializeEventListeners();
    this.checkCurrentPage();
  }

  initializeEventListeners() {
    this.extractButton.addEventListener("click", () => this.startExtraction());
    this.copyButton.addEventListener("click", () => this.copyToClipboard());
    this.closeButton.addEventListener("click", () => window.close());
  }

  addCloseButton() {
    const closeButton = document.createElement("button");
    closeButton.className = "close-button";
    closeButton.innerHTML = "✕";
    closeButton.onclick = () => window.close();

    const header = document.createElement("div");
    header.className = "popup-header";
    header.appendChild(closeButton);

    document.querySelector(".container").prepend(header);
  }

  async checkCurrentPage() {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    this.extractButton.disabled = false;
    this.supportStatus.className = "status-indicator supported";
  }

  async startExtraction() {
    this.extractButton.disabled = true;
    this.copyButton.disabled = true;
    this.extractedContent.textContent = "";
    this.updateProgress(0, "Starting extraction...");

    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    chrome.tabs.sendMessage(tab.id, {
      action: "startExtraction",
    });
  }

  updateProgress(percent, message) {
    this.progressBar.style.width = `${percent}%`;
    this.progressText.textContent = message;
  }

  setContent(content) {
    // Replace textArea with pre element
    this.extractedContent.textContent = content;
    this.copyButton.disabled = false;
    this.extractButton.disabled = false;
    this.updateProgress(100, "Extraction complete!");
  }

  async copyToClipboard() {
    try {
      await navigator.clipboard.writeText(this.extractedContent.textContent);
      this.copyButton.textContent = "Copied!";
      setTimeout(() => {
        this.copyButton.textContent = "Copy to Clipboard";
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }
}

// Initialize popup
const popup = new PopupManager();

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case "updateProgress":
      popup.updateProgress(message.percent, message.status);
      break;
    case "extractionComplete":
      popup.setContent(message.content);
      break;
  }
});
