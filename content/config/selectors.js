const selectors = {
  articleSelectors: {
    mainContent: [
      "article",
      '[role="article"]',
      ".article-content",
      ".post-content",
      "#article-content",
      ".entry-content",
      "main article",
      '[class*="article-body"]',
      '[class*="story-body"]',
      '[itemprop="articleBody"]',
      ".post-body",
      ".article__content",
      "#article-text",
      ".article-text",
      ".story-content",
    ],

    title: [
      'h1[class*="title"]',
      "h1.entry-title",
      "h1",
      ".article-title",
      ".post-title",
      ".entry-title",
      '[itemprop="headline"]',
      ".headline",
      ".article__title",
      ".story-title",
    ],

    author: [
      '[class*="author"]',
      '[rel="author"]',
      ".byline",
      '[itemprop="author"]',
      ".writer",
      ".reporter",
      ".article__author",
      ".article__byline",
      ".article-byline",
      ".story-author",
    ],

    unwantedElements: [
      // Navigation
      "header",
      "footer",
      "nav",
      '[role="navigation"]',
      ".menu",
      ".navbar",

      // Sidebars
      "aside",
      '[role="complementary"]',
      ".sidebar",
      ".widget-area",

      // Social & Sharing
      '[class*="social"]',
      '[class*="share"]',
      '[id*="share"]',
      ".follow",

      // Ads
      '[class*="ad-"]',
      '[class*="ads-"]',
      '[id*="ad-"]',
      '[id*="ads-"]',
      '[class*="advertisement"]',
      '[class*="sponsored"]',
      ".promoted",
      ".advertisement",

      // Comments
      '[class*="comment"]',
      "#comments",
      ".comments-section",
      ".response",

      // Media elements
      "figcaption",
      ".caption",
      '[class*="caption"]',
      ".credit",
      ".image-credit",
      ".photo-credit",

      // Related content
      '[class*="related"]',
      '[class*="recommended"]',
      ".more-articles",
      ".suggested",

      // Utility
      '[class*="tags"]',
      '[class*="meta"]',
      '[class*="utility"]',
      '[class*="toolbar"]',

      // Newsletter & Subscribe
      '[class*="newsletter"]',
      '[class*="subscribe"]',
      ".subscription",
      ".mailing-list",

      // Time & Date
      "time",
      '[class*="time"]',
      '[class*="date"]',
      ".timestamp",
      ".published",

      // Site-specific elements
      '[class*="cookie"]',
      '[class*="popup"]',
      '[class*="modal"]',
      '[class*="overlay"]',
      '[class*="lightbox"]',

      // Hebrew specific
      ".credit-hebrew",
      ".writer-hebrew",
      ".date-hebrew",
      ".tags-hebrew",
    ],
  },

  // Score modifiers for content relevance
  scoreModifiers: {
    positive: [
      { selector: "article", score: 5 },
      { selector: '[itemprop="articleBody"]', score: 4 },
      { selector: ".article-content", score: 4 },
      { selector: ".post-content", score: 3 },
      { selector: "p", score: 1 },
    ],
    negative: [
      { selector: ".comments", score: -3 },
      { selector: ".sidebar", score: -3 },
      { selector: '[class*="ad"]', score: -2 },
      { selector: "nav", score: -2 },
    ],
  },
};

window.selectors = selectors;
