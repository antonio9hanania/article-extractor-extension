class ContentExtractor extends BaseExtractor {
  constructor() {
    super();
    this.name = "content";
    this.priority = 2;
  }

  async extract() {
    try {
      const mainContent = this.findMainContent();
      if (!mainContent) return null;

      // Process the content with better paragraph handling
      const content = this.processContent(mainContent);
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
    // Check for blog posts first
    const blogContent = this.findBlogContent();
    if (blogContent) return blogContent;

    // Then try regular article selectors
    for (const selector of window.selectors.articleSelectors.mainContent) {
      const element = document.querySelector(selector);
      if (element) return element;
    }

    // Fallback to content density analysis
    return this.findByContentDensity();
  }

  findBlogContent() {
    const siteRules = window.siteRules.getRulesForSite(window.location.href);
    const blogSelectors = [
      ...(siteRules?.blogSelectors || []),
      ...(window.selectors.articleSelectors.blog || []),
    ];

    for (const selector of blogSelectors) {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        // Create a container for all blog posts
        const container = document.createElement("div");
        elements.forEach((element, index) => {
          const cleanedElement = this.removeUnwantedElements(
            element.cloneNode(true)
          );
          if (index > 0) {
            // Add separator between posts
            const separator = document.createElement("hr");
            container.appendChild(separator);
          }
          container.appendChild(cleanedElement);
        });
        return container;
      }
    }
    return null;
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

  processContent(element) {
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
      .split(/\n\s*\n/) // Split on double newlines
      .map((para) => para.trim())
      .filter((para) => {
        return (
          para.length > 0 &&
          !this.shouldSkipLine(para) &&
          !this.isCaptionLine(para) &&
          !this.isBoilerplate(para) &&
          // Ensure minimum words per paragraph
          para.split(/\s+/).length >=
            window.patterns.validationRules.minWordsPerParagraph
        );
      });

    // Join paragraphs with double newlines
    return paragraphs.join("\n\n");
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
}

window.ContentExtractor = ContentExtractor;
