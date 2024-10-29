class ReadabilityExtractor extends BaseExtractor {
  constructor() {
    super();
    this.name = "readability";
    this.priority = 1;
  }

  async extract() {
    try {
      // Make sure we have a proper document
      if (!document || !document.documentElement) {
        throw new Error("Invalid document");
      }

      // Create a clone of the document
      const documentClone = document.cloneNode(true);

      // Pre-clean using both standard and site-specific rules
      const cleanedDoc = this.removeUnwantedElements(documentClone);

      const reader = new Readability(cleanedDoc);
      const article = reader.parse();

      if (!article) {
        return null;
      }

      // Clean the content again after Readability processing
      const cleanedContent = this.processContent(article.content);
      if (!this.isValidContent(cleanedContent)) {
        return null;
      }

      return {
        title: article.title,
        content: cleanedContent,
        author: article.byline,
        siteName: article.siteName,
      };
    } catch (error) {
      console.error("Readability extraction error:", error);
      return null;
    }
  }

  preProcess(doc) {
    // Remove unwanted elements before Readability processing
    window.selectors.articleSelectors.unwantedElements.forEach((selector) => {
      doc.querySelectorAll(selector).forEach((el) => el.remove());
    });
  }

  processContent(content) {
    if (!content) return "";

    // First process as HTML to apply site-specific rules
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    const cleanedElement = this.removeUnwantedElements(tempDiv);

    // Convert block elements to newlines before cleaning HTML
    window.cleaners.htmlElements.blockElements.forEach((tag) => {
      cleanedElement.querySelectorAll(tag).forEach((el) => {
        // Add double newline after block elements
        el.insertAdjacentText("afterend", "\n\n");
      });
    });

    // Clean and get text content
    const cleanText = this.clean(cleanedElement.innerHTML);

    // Process paragraphs
    const paragraphs = cleanText
      .split(/\n\s*\n/)
      .map((para) => para.trim())
      .filter((para) => {
        return (
          para.length > 0 &&
          !this.shouldSkipLine(para) &&
          !this.isCaptionLine(para) &&
          !this.isBoilerplate(para)
        );
      });

    // Join paragraphs with double newlines
    return paragraphs.join("\n\n");
  }

  processArticleContent(content) {
    // First, clean the content
    let cleanedContent = this.clean(content);

    // Split into paragraphs and process each one
    const paragraphs = cleanedContent
      .split(/\n\s*\n/)
      .map((para) => para.trim())
      .filter((para) => {
        return (
          para.length > 0 &&
          !this.shouldSkipLine(para) &&
          !this.isCaptionOrBoilerplate(para)
        );
      });

    // Join paragraphs with double newlines
    return paragraphs.join("\n\n");
  }

  isCaptionOrBoilerplate(line) {
    return this.isCaptionLine(line) || this.isBoilerplate(line);
  }

  formatContent(content) {
    if (!content) return "";

    const cleanContent = this.clean(content);
    const paragraphs = cleanContent
      .split(/\n\s*\n/)
      .map((para) => para.trim())
      .filter((para) => {
        return (
          para.length > 0 &&
          !this.shouldSkipLine(para) &&
          !this.isCaptionLine(para) &&
          !this.isBoilerplate(para)
        );
      });

    return paragraphs.join("\n\n");
  }
}

window.ReadabilityExtractor = ReadabilityExtractor;
