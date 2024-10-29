const siteRules = {
  // Rules for specific websites
  siteSpecificRules: {
    "foxnews.com": {
      // Additional selectors to remove
      removeSelectors: [
        // Regular selectors
        ".related-links",
        ".inline-video",

        // Function to check complex conditions
        (element) => {
          if (element.tagName === "P") {
            const link = element.querySelector('a[target="_blank"]');
            if (link) {
              const strong = link.querySelector("strong");
              if (
                strong &&
                strong.textContent === strong.textContent.toUpperCase() &&
                link.textContent === strong.textContent
              ) {
                return true; // Remove this element
              }
            }
          }
          return false;
        },
      ],

      // Additional blog post selectors
      blogSelectors: [
        ".article-list article",
        ".collection-article",
        ".article-body",
      ],

      // Site-specific cleaning rules
      cleanRules: {
        removePatterns: [
          /CLICK HERE FOR MORE/i,
          /WATCH:/i,
          /Get the latest updates/i,
        ],
      },
    },

    // Add more sites as needed
    "example.com": {
      removeSelectors: [],
      blogSelectors: [],
      cleanRules: {},
    },
  },

  // Get rules for current site
  getRulesForSite(url) {
    try {
      const hostname = new URL(url).hostname;
      // Find matching site rules (including subdomains)
      const matchingSite = Object.keys(this.siteSpecificRules).find((site) =>
        hostname.includes(site)
      );

      return matchingSite ? this.siteSpecificRules[matchingSite] : null;
    } catch (e) {
      console.error("Error getting site rules:", e);
      return null;
    }
  },
};

window.siteRules = siteRules;
