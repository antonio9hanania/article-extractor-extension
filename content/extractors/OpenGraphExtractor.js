class OpenGraphExtractor extends BaseExtractor {
  constructor() {
    super();
    this.name = "opengraph";
    this.priority = 3;
  }

  async extract() {
    try {
      const mainContent = this.findMainContent();
      if (!mainContent || !this.isValidContent(mainContent)) {
        return null;
      }

      return {
        title: this.getMetaContent("og:title") || document.title,
        content: mainContent,
        author: this.getMetaContent("article:author"),
        siteName: this.getMetaContent("og:site_name"),
      };
    } catch (error) {
      console.error("OpenGraph extraction error:", error);
      return null;
    }
  }

  findMainContent() {
    for (const selector of window.selectors.articleSelectors.mainContent) {
      const element = document.querySelector(selector);
      if (element) {
        // First clean the element
        const cleaned = this.removeUnwantedElements(element.cloneNode(true));

        // Convert block elements to newlines before cleaning HTML
        window.cleaners.htmlElements.blockElements.forEach((tag) => {
          cleaned.querySelectorAll(tag).forEach((el) => {
            // Add double newline after block elements
            el.insertAdjacentText("afterend", "\n\n");
          });
        });

        // Clean and get text content
        let content = this.clean(cleaned.textContent);

        // Process paragraphs
        const paragraphs = content
          .split(/\n\s*\n/)
          .map((para) => para.trim())
          .filter((para) => {
            return (
              para.length > 0 &&
              !this.shouldSkipLine(para) &&
              !this.isCaptionLine(para) &&
              !this.isBoilerplate(para) &&
              para.split(/\s+/).length >=
                window.patterns.validationRules.minWordsPerParagraph
            );
          });

        // Join paragraphs with double newlines
        return paragraphs.join("\n\n");
      }
    }
    return null;
  }

  getMetaContent(property) {
    const meta = document.querySelector(
      `meta[property="${property}"], meta[name="${property}"]`
    );
    return meta ? meta.getAttribute("content") : null;
  }
}

window.OpenGraphExtractor = OpenGraphExtractor;
