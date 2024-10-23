const DOMUtils = {
  getTextDensity(element) {
    const text = element.textContent || "";
    const links = element.getElementsByTagName("a");
    const linkText = Array.from(links).reduce(
      (acc, link) => acc + (link.textContent || "").length,
      0
    );

    return {
      density: text.length ? (text.length - linkText) / text.length : 0,
      textLength: text.length,
    };
  },

  isVisible(element) {
    const style = window.getComputedStyle(element);
    return (
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      style.opacity !== "0"
    );
  },

  removeUnwantedElements(element, selectors) {
    const unwanted = element.querySelectorAll(selectors.join(","));
    unwanted.forEach((el) => el.remove());
    return element;
  },

  getNormalizedText(element) {
    return element.textContent.replace(/\s+/g, " ").trim();
  },

  isContentNode(node) {
    const minContentLength = 100;
    const unwantedTags = ["script", "style", "nav", "header", "footer"];

    return (
      node.nodeType === Node.ELEMENT_NODE &&
      !unwantedTags.includes(node.tagName.toLowerCase()) &&
      this.getNormalizedText(node).length >= minContentLength
    );
  },
};

// Make it available globally
window.DOMUtils = DOMUtils;
