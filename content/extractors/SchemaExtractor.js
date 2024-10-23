class SchemaExtractor extends BaseExtractor {
  constructor() {
    super();
    this.name = "schema";
    this.priority = 3;
  }

  async extract() {
    try {
      const schemas = this.findSchemaData();
      for (const schema of schemas) {
        if (this.isArticleSchema(schema)) {
          const content = schema.articleBody || schema.description;
          if (content && this.isValidContent(content)) {
            return {
              title: this.cleanTitle(schema.headline || schema.name),
              content: this.formatContent(content),
              author: this.getAuthor(schema),
              datePublished: schema.datePublished,
              siteName: this.getSiteName(schema),
            };
          }
        }
      }
      return null;
    } catch (error) {
      console.error("Schema extraction error:", error);
      return null;
    }
  }

  findSchemaData() {
    const schemas = [];
    const scripts = document.querySelectorAll(
      'script[type="application/ld+json"]'
    );

    scripts.forEach((script) => {
      try {
        const data = JSON.parse(script.textContent);
        if (Array.isArray(data)) {
          schemas.push(...data);
        } else {
          schemas.push(data);
        }
      } catch (e) {
        // Ignore JSON parse errors
      }
    });

    return schemas;
  }

  isArticleSchema(data) {
    return (
      data["@type"] && window.patterns.articleTypes.includes(data["@type"])
    );
  }

  getAuthor(schema) {
    if (!schema.author) return null;

    if (typeof schema.author === "string") {
      return schema.author;
    }

    if (Array.isArray(schema.author)) {
      return schema.author
        .map((author) => (typeof author === "string" ? author : author.name))
        .filter(Boolean)
        .join(", ");
    }

    return schema.author.name || null;
  }

  getSiteName(schema) {
    if (schema.publisher) {
      return typeof schema.publisher === "string"
        ? schema.publisher
        : schema.publisher.name;
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

window.SchemaExtractor = SchemaExtractor;
