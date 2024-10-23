const cleaners = {
  htmlElements: {
    // Elements to remove completely
    removeElements: [
      "script",
      "style",
      "iframe",
      "time",
      "footer",
      "noscript",
      "figcaption",
      "figure",
      "form",
      "header",
      "button",
      "input",
      "textarea",
      "iframe",
      "video",
      "audio",
    ],

    // Elements to convert to paragraph breaks
    blockElements: [
      "p",
      "br",
      "div",
      "section",
      "article",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "blockquote",
      "pre",
    ],

    // Elements to convert to space
    inlineElements: [
      "div",
      "li",
      "tr",
      "th",
      "td",
      "span",
      "a",
      "strong",
      "em",
      "i",
      "b",
    ],
  },

  entityReplacements: [
    { pattern: /&nbsp;/g, replacement: " " },
    { pattern: /&amp;/g, replacement: "&" },
    { pattern: /&lt;/g, replacement: "<" },
    { pattern: /&gt;/g, replacement: ">" },
    { pattern: /&quot;/g, replacement: '"' },
    { pattern: /&#39;/g, replacement: "'" },
    { pattern: /&rdquo;/g, replacement: '"' },
    { pattern: /&ldquo;/g, replacement: '"' },
    { pattern: /&lsquo;/g, replacement: "'" },
    { pattern: /&rsquo;/g, replacement: "'" },
    { pattern: /&mdash;/g, replacement: "-" },
    { pattern: /&ndash;/g, replacement: "-" },
    { pattern: /&bull;/g, replacement: "*" },
    { pattern: /&hellip;/g, replacement: "..." },
    { pattern: /&#x200B;/g, replacement: "" }, // Zero-width space
    { pattern: /&#8203;/g, replacement: "" }, // Zero-width space
    { pattern: /\u200B/g, replacement: "" }, // Unicode zero-width space
  ],

  whitespaceRules: [
    // First clean up newlines
    {
      pattern: /\r\n|\r|\n/g,
      replacement: "\n",
    },
    // Remove extra whitespace within lines
    {
      pattern: /[ \t]+/g,
      replacement: " ",
    },
    // Ensure proper paragraph separation
    {
      pattern: /\n\s*\n\s*\n+/g,
      replacement: "\n\n",
    },
    // Clean up spaces at start/end of lines
    {
      pattern: /^ +| +$/gm,
      replacement: "",
    },
  ],

  cleaningMethods: {
    preClean: function (content) {
      // Remove comments
      content = content.replace(/<!--[\s\S]*?-->/g, "");
      // Remove hidden elements
      content = content.replace(
        /<[^>]+style\s*=\s*['"]?[^'"]*display\s*:\s*none[^>]*>/g,
        ""
      );
      return content;
    },

    postClean: function (content) {
      return (
        content
          // First normalize all newlines to \n
          .replace(/\r\n|\r/g, "\n")
          // Remove more than 2 consecutive newlines
          .replace(/\n{3,}/g, "\n\n")
          // Normalize spaces within each paragraph
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0)
          // Join back with double newlines to preserve paragraphs
          .join("\n\n")
          // Trim final result
          .trim()
      );
    },
  },
};

window.cleaners = cleaners;
