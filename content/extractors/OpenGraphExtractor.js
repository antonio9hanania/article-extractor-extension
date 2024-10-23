class OpenGraphExtractor extends BaseExtractor {
  constructor() {
    super();
    this.name = "opengraph";
    this.priority = 2;
  }

  async extract() {
    try {
      const mainContent = this.findMainContent();
      if (!mainContent || !this.isValidContent(mainContent)) {
        return null;
      }

      const metadata = {
        title:
          this.getMetaContent("og:title") ||
          this.getMetaContent("twitter:title") ||
          document.title,
        description:
          this.getMetaContent("og:description") ||
          this.getMetaContent("twitter:description"),
        author:
          this.getMetaContent("article:author") ||
          this.getMetaContent("author"),
        siteName: this.getMetaContent("og:site_name"),
        content: mainContent,
      };

      return {
        title: this.cleanTitle(metadata.title),
        content: this.formatContent(metadata.content),
        author: metadata.author,
        siteName: metadata.siteName,
      };
    } catch (error) {
      console.error("OpenGraph extraction error:", error);
      return null;
    }
  }

  getMetaContent(property) {
    const meta = document.querySelector(
      `meta[property="${property}"], meta[name="${property}"]`
    );
    return meta ? meta.getAttribute("content") : null;
  }

  findMainContent() {
    for (const selector of window.selectors.articleSelectors.mainContent) {
      const element = document.querySelector(selector);
      if (element) {
        const cleaned = this.removeUnwantedElements(element);
        return this.clean(cleaned.textContent);
      }
    }
    return null;
  }

  cleanTitle(title) {
    if (!title) return "";

    // Split on common title separators and take the first part
    const parts = title.split(/[|\-–—]/);
    title = parts[0].trim();

    // Remove any remaining unwanted patterns
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

window.OpenGraphExtractor = OpenGraphExtractor;
