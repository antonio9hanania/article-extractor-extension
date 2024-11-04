const patterns = {
  contentPatterns: {
    skipLines: [
      // Hebrew patterns
      /^תגיות:/,
      /נושאים קשורים/,
      /קרדיט:/,
      /צילום:/,
      /^מערכת/,
      /^כתב:/,
      /^עורך:/,
      /תאריך:/,
      /^שעה:/,
      /^עודכן:/,
      /^פורסם:/,

      // English patterns
      /^Related Articles?:/i,
      /^Share:/i,
      /^Source:/i,
      /^Credit:/i,
      /^By:/i,
      /^Author:/i,
      /^Published:/i,
      /^Updated:/i,
      /^Posted:/i,

      // File extensions and numbers
      /\.(jpg|jpeg|png|gif)$/i,
      /^[\d:]+$/,
      /\d{1,2}\/\d{1,2}\/\d{2,4}/,

      // Generic
      /^copyright/i,
      /©/,
      /&nbsp;/,
      /^[\d.]+ \d{1,2}\/\d{1,2}\/\d{2,4}/,

      /^[^.]+contributed to this (article|report|story)/i,
      /^.*\s+(?:contributed|assisted|helped)(?: to)? (?:with )?this\s+(?:article|report|story)/i,
      /^(?:Write|Email|Contact|Reach|Send)\s+(?:to\s+)?[^@\n]+ at [^@\n]+@[^@\n]+\.[^@\n]+$/i,
      /^(?:Write|Email|Contact|Reach|Send)\s+(?:to\s+)?[^@\n]+ at [^@\n]+\s*$/i,
      /^Appeared in the [A-Za-z]+ \d{1,2}, \d{4},? print edition(?: as ['"].*['"])?\.*$/i,
      /^(?:Write|Email|Contact|Reach|Send)\s+(?:to\s+)?(?:[^@\n]+ at [^@\n]+@[^@\n]+\.[^@\n]+(?:\s*,\s*(?:and\s+)?)?)+$/i,
      /^[^@\n]+@[^@\n]+\.[^@\n]+$/i, // Just email address
      /^For more information, contact/i,
      /^Follow .+ on/i,
      /^You can reach/i,
      /^Get in touch/i,

      // Author bylines at the end
      /^By\s+[^@\n]+$/i,
      /^From\s+[^@\n]+$/i,
      /^—\s*[^@\n]+$/, // Em dash followed by name
      /^[-—–]\s*[^@\n]+$/, // Various dashes followed by name

      // Generic footer content
      /^Additional reporting by/i,

      /^Editing by/i,

      // Common article footer patterns
      /^This article was updated/i,
      /^This story has been updated/i,
      /^This report was updated/i,
    ],

    captions: [
      // English
      /^(Photo|Image|Video|Credit|Source):/i,
      /^\([^)]+\)$/,
      /^[^.!?]+\s+via\s+[^.!?]+$/i,
      /\.(jpg|jpeg|png|gif)\s*$/i,
      /^[^.!?]{1,50}$/,

      // Hebrew
      /^צילום:/,
      /^תמונה:/,
      /^וידאו:/,
      /^סרטון:/,
      /^קרדיט:/,
      /^מקור:/,
    ],

    boilerplate: [
      /copyright/i,
      /all rights reserved/i,
      /terms of (use|service)/i,
      /privacy policy/i,
      /newsletter subscription/i,
      /sign up for our/i,
      /follow us/i,
      /share this/i,
      /subscribe to/i,
      /powered by/i,
    ],

    hebrew: {
      sectionHeader: /^[א-ת\s]+$/,
      byline: /^מאת:?\s*/i,
      updateTime: /^עודכן ב:/i,
      publicationTime: /^פורסם ב:/i,
      tags: /^תגיות:/i,
      relatedTopics: /^נושאים קשורים:/i,
    },
  },

  validationRules: {
    minContentLength: 100,
    minWordsPerParagraph: 5,
    maxConsecutiveNewlines: 2,
    minParagraphs: 2,
    maxHeaderLength: 200,
    minHeaderLength: 10,
  },

  articleTypes: [
    "Article",
    "NewsArticle",
    "BlogPosting",
    "TechArticle",
    "ScholarlyArticle",
    "Report",
    "WebPage",
  ],

  scoreThresholds: {
    minimumScore: 10,
    goodScore: 25,
    excellentScore: 50,
  },
};

window.patterns = patterns;
