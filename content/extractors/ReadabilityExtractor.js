class ReadabilityExtractor extends BaseExtractor {
  constructor() {
    super();
    this.name = "readability";
    this.priority = 1;
  }

  async extract() {
    try {
      // Clone and pre-clean the document
      const documentClone = document.cloneNode(true);
      this.preProcess(documentClone);

      const reader = new Readability(documentClone);
      const article = reader.parse();

      if (!article) {
        return null;
      }

      // Process the content using our base methods
      let processedContent = this.processArticleContent(article.content);
      if (!this.isValidContent(processedContent)) {
        return null;
      }

      return {
        title: article.title,
        content: processedContent,
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
}

window.ReadabilityExtractor = ReadabilityExtractor;
