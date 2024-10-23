const TextProcessor = {
  cleanText(text) {
    return text
      .replace(/\s+/g, " ")
      .replace(/[^\S\r\n]+/g, " ")
      .replace(/\n\s*\n/g, "\n\n")
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join("\n");
  },

  formatArticle(content) {
    const paragraphs = content
      .split("\n")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    return paragraphs.join("\n\n");
  },

  extractSentences(text) {
    return (
      text.match(/[^.!?]+[.!?]+/g)?.map((sentence) => sentence.trim()) || []
    );
  },

  calculateReadingTime(text) {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  },
};

// Make it available globally
window.TextProcessor = TextProcessor;
