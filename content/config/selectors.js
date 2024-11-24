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
      ".news_body",
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
      "#bookmark-toast",
      ".header__container",

      // Sidebars
      "aside",
      ".recirculation__text",
      '[role="complementary"]',
      ".sidebar",
      ".widget-area",
      ".preview-header",
      '[class*="offcanvas"]',
      '[class*="main_infoblock"]',

      // Social & Sharing
      '[class*="social"]',
      '[class*="share"]',
      '[id*="share"]',
      ".follow",

      // Ads
      '[class*="ad-"]',
      '[class*="ad_"]',
      '[class*="ads-"]',
      '[id*="ad-"]',
      '[id*="ads-"]',
      '[class*="advertisement"]',
      '[class*="sponsored"]',
      ".promoted",
      ".advertisement",
      "#browsi_adWrapper_ai_2_ati_1_rc_0",
      "#browsi_adWrapper_ai_2_ati_1_rc_1",
      "#Taboola-inline-video",

      // Comments
      '[class*="comment"]',
      "#comments",
      ".comments-section",
      ".response",
      ".talkback",
      "#spotim-container",
      '[class*="main_feedbacks"]',

      // Media elements
      "figcaption",
      ".caption",
      '[class*="caption"]',
      ".credit",
      ".image-credit",
      ".photo-credit",
      ".trinity",
      ".live-story-lede",
      ".featured featured-video video-ct",
      ".featured-video",
      '[class^="ArticleAudio_"]',
      '[class^="ArticleRelatedContentLink_"]',

      // Related content
      '[class*="related"]',
      '[class*="recommended"]',
      ".more-articles",
      ".suggested",
      ".recommender-articles",
      ".read-next-recommended",
      ".related-column",
      ".article-preview-container preview-right",
      ".article-preview",
      ".not-for-print",
      ".bottom-of-article",
      ".js-magnet-data",
      ".main_news_relations",
      ".news_relations_blocks",
      ".dynamic_news",

      // Utility
      '[class*="tags"]',
      '[class*="meta"]',
      '[class*="utility"]',
      '[class*="toolbar"]',
      "script",

      // Newsletter & Subscribe
      ".email__toaster-component out-of-view",
      ".privacy",
      "#Mirror-DailyNewsletter",
      ".email-slidein-form-container",
      '[class*="newsletter"]',
      '[class*="subscribe"]',
      ".subscription",
      ".mailing-list",
      '[class*="banners"]',

      // Time & Date
      "time",
      '[class*="time"]',
      '[class*="date"]',
      ".timestamp",
      ".published",
      ".originalLaunchDate",

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
