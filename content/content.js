(function () {
  // Check if already initialized
  if (window.articleExtractor) {
    return;
  }

  function initializeContentManager() {
    if (!window.contentManager) {
      class ContentManager extends BaseExtractor {
        constructor() {
          if (window.contentManager) {
            return window.contentManager;
          }

          super();
          this.setupExtractors();
          this.setupMessageListener();

          window.contentManager = this;
        }

        setupExtractors() {
          this.extractors = [
            new ReadabilityExtractor(),
            new OpenGraphExtractor(),
            new SchemaExtractor(),
            new ContentExtractor(),
          ].sort((a, b) => a.priority - b.priority);
        }

        setupMessageListener() {
          this.messageListener = (message, sender, sendResponse) => {
            if (message.action === "startExtraction") {
              this.handleExtraction();
            }
            return true;
          };

          chrome.runtime.onMessage.addListener(this.messageListener);
        }

        async handleExtraction() {
          try {
            this.sendProgress(0, "Starting extraction...");

            for (let i = 0; i < this.extractors.length; i++) {
              const extractor = this.extractors[i];
              const progress = (i / this.extractors.length) * 100;

              this.sendProgress(
                progress,
                `Trying ${extractor.name} extractor...`
              );

              try {
                const result = await extractor.extract();
                if (result && result.content) {
                  const formattedContent = this.formatOutput(result);
                  this.sendSuccess(formattedContent);
                  return;
                }
              } catch (error) {
                console.error(`Extractor ${extractor.name} failed:`, error);
                continue;
              }
            }

            this.sendProgress(100, "No valid content found");
          } catch (error) {
            console.error("Extraction failed:", error);
            this.sendProgress(100, "Extraction failed");
          }
        }

        formatOutput(result) {
          let output = "";

          // Add title if available
          if (result.title && !this.shouldSkipLine(result.title)) {
            output += result.title.trim() + "\n\n";
          }

          // Keep the existing paragraph structure
          if (result.content) {
            let content = result.content
              .split("\n")
              .map((line) => line.trim())
              .filter((line) => {
                return (
                  line.length > 0 &&
                  !this.shouldSkipLine(line) &&
                  !this.isBoilerplate(line)
                );
              })
              .join("\n");

            if (content) {
              if (output) {
                output += "\n\n";
              }
              output += content;
            }
          }

          return this.finalClean(output);
        }

        finalClean(text) {
          return (
            text
              // Remove unwanted elements
              .replace(/Show audio player/g, "")
              .replace(/\[object Object\]/g, "")
              .replace(/undefined/g, "")
              // Clean up spaces within lines but preserve line breaks
              .split("\n")
              .map((line) => line.trim())
              .filter((line) => line.length > 0)
              .join("\n")
              .replace(/\n{3,}/g, "\n\n")
              .trim()
          );
        }

        sendProgress(percent, status) {
          chrome.runtime.sendMessage({
            action: "updateProgress",
            percent,
            status,
          });
        }

        sendSuccess(content) {
          chrome.runtime.sendMessage({
            action: "extractionComplete",
            content: content,
          });
        }

        cleanup() {
          // Remove event listeners
          if (this.messageListener) {
            chrome.runtime.onMessage.removeListener(this.messageListener);
          }

          // Clean up extractors
          if (this.extractors) {
            this.extractors.forEach((extractor) => {
              if (extractor.cleanup) {
                extractor.cleanup();
              }
            });
          }

          // Clear references
          this.extractors = null;
          window.contentManager = null;
        }
      }

      new ContentManager();
    }
  }

  // Clean initialization based on document state
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeContentManager, {
      once: true,
    });
  } else {
    initializeContentManager();
  }

  // Optional: Clean up on page unload
  window.addEventListener("unload", () => {
    if (window.contentManager) {
      window.contentManager.cleanup();
    }
  });
})();
