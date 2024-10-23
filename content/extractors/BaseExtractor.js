class BaseExtractor {
  constructor() {
    this.name = "base";
    this.priority = 0;
  }

  clean(content) {
    if (!content) return "";

    // Pre-cleaning
    content = window.cleaners.cleaningMethods.preClean(content);

    // Remove unwanted HTML elements using configuration
    window.cleaners.htmlElements.removeElements.forEach((tag) => {
      const regex = new RegExp(`<${tag}[^>]*>.*?<\/${tag}>`, "gis");
      content = content.replace(regex, "");
    });

    // Convert block elements to newlines using configuration
    window.cleaners.htmlElements.blockElements.forEach((tag) => {
      // Handle both self-closing and regular tags
      if (tag === "br") {
        content = content.replace(/<br\s*\/?>/gi, "\n\n");
      } else {
        content = content
          .replace(new RegExp(`<${tag}[^>]*>`, "gi"), "\n\n")
          .replace(new RegExp(`<\/${tag}>`, "gi"), "\n\n");
      }
    });

    // Convert inline elements to spaces using configuration
    window.cleaners.htmlElements.inlineElements.forEach((tag) => {
      content = content.replace(new RegExp(`<\/${tag}>`, "gi"), " ");
    });

    // Remove remaining HTML tags
    content = content.replace(/<[^>]+>/g, " ");

    // Replace HTML entities using configuration
    window.cleaners.entityReplacements.forEach(({ pattern, replacement }) => {
      content = content.replace(pattern, replacement);
    });

    // Clean up whitespace using configuration
    window.cleaners.whitespaceRules.forEach(({ pattern, replacement }) => {
      content = content.replace(pattern, replacement);
    });

    // Post-cleaning
    return window.cleaners.cleaningMethods.postClean(content);
  }

  removeUnwantedElements(element) {
    const clone = element.cloneNode(true);
    window.selectors.articleSelectors.unwantedElements.forEach((selector) => {
      clone.querySelectorAll(selector).forEach((el) => el.remove());
    });
    return clone;
  }

  isValidContent(text) {
    if (!text) return false;
    const cleanText = text.trim();

    // Basic length check
    if (cleanText.length < window.patterns.validationRules.minContentLength) {
      console.log("Content too short:", cleanText.length);
      return false;
    }

    // Word count check
    const wordCount = cleanText.split(/\s+/).length;
    if (wordCount < window.patterns.validationRules.minWordsPerParagraph) {
      console.log("Not enough words:", wordCount);
      return false;
    }

    // Either we have multiple paragraphs OR a single long paragraph
    const paragraphs = cleanText
      .split(/\n\s*\n/)
      .filter((p) => p.trim().length > 0);
    const hasSufficientParagraphs =
      paragraphs.length >= window.patterns.validationRules.minParagraphs;
    const isLongSingleParagraph =
      paragraphs.length === 1 && cleanText.length > 500;

    return hasSufficientParagraphs || isLongSingleParagraph;
  }

  shouldSkipLine(line) {
    return window.patterns.contentPatterns.skipLines.some((pattern) =>
      pattern.test(line)
    );
  }

  isCaptionLine(line) {
    return window.patterns.contentPatterns.captions.some((pattern) =>
      pattern.test(line)
    );
  }

  isBoilerplate(line) {
    return window.patterns.contentPatterns.boilerplate.some((pattern) =>
      pattern.test(line)
    );
  }

  calculateScore(element) {
    let score = 0;

    // Apply scoring modifiers from configuration
    window.selectors.scoreModifiers.positive.forEach(
      ({ selector, score: value }) => {
        if (element.matches(selector) || element.querySelector(selector)) {
          score += value;
        }
      }
    );

    window.selectors.scoreModifiers.negative.forEach(
      ({ selector, score: value }) => {
        if (element.matches(selector) || element.querySelector(selector)) {
          score += value;
        }
      }
    );

    return score;
  }
}

window.BaseExtractor = BaseExtractor;
