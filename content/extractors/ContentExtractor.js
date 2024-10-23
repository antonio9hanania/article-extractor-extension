class ContentExtractor extends BaseExtractor {
  constructor() {
    super();
    this.name = "content";
    this.priority = 4;
  }

  async extract() {
    try {
      const mainContent = this.findMainContent();
      if (!mainContent) return null;

      const content = this.extractContent(mainContent);
      if (!this.isValidContent(content)) return null;

      return {
        title: this.findTitle(),
        content: content,
        author: this.findAuthor(),
      };
    } catch (error) {
      console.error("Content extraction error:", error);
      return null;
    }
  }

  findMainContent() {
    // Try direct article container selectors
    for (const selector of window.selectors.articleSelectors.mainContent) {
      const element = document.querySelector(selector);
      if (element) return element;
    }

    // Fallback to content density analysis
    return this.findByContentDensity();
  }

  findByContentDensity() {
    let bestElement = null;
    let bestScore = window.patterns.scoreThresholds.minimumScore;

    const walk = (node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const score = this.calculateScore(node);
        if (score > bestScore) {
          bestScore = score;
          bestElement = node;
        }
        Array.from(node.children).forEach(walk);
      }
    };

    walk(document.body);
    return bestElement;
  }

  extractContent(element) {
    const cleaned = this.removeUnwantedElements(element);
    return this.clean(cleaned.textContent);
  }

  findTitle() {
    for (const selector of window.selectors.articleSelectors.title) {
      const element = document.querySelector(selector);
      if (element) {
        const title = element.textContent.trim();
        if (
          title.length >= window.patterns.validationRules.minHeaderLength &&
          title.length <= window.patterns.validationRules.maxHeaderLength
        ) {
          return this.cleanTitle(title);
        }
      }
    }

    return this.cleanTitle(document.title);
  }

  findAuthor() {
    for (const selector of window.selectors.articleSelectors.author) {
      const element = document.querySelector(selector);
      if (element) {
        const author = element.textContent.trim();
        if (author && !this.shouldSkipLine(author)) {
          return author;
        }
      }
    }
    return null;
  }

  cleanTitle(title) {
    if (!title) return "";

    const parts = title.split(/[|\-–—]/);
    title = parts[0].trim();

    window.patterns.contentPatterns.skipLines.forEach((pattern) => {
      title = title.replace(pattern, "");
    });

    return title;
  }

  formatContent(content) {
    if (!content) return "";

    return content
      .split("\n")
      .map((para) => para.trim())
      .filter((para) => {
        return (
          para.length > 0 &&
          !this.shouldSkipLine(para) &&
          !this.isCaptionLine(para) &&
          !this.isBoilerplate(para)
        );
      })
      .join("\n\n");
  }
}

window.ContentExtractor = ContentExtractor;
