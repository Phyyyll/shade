// highlight_three.js

document.addEventListener("DOMContentLoaded", function () {
  const highlightableElements = document.querySelectorAll(
    ".three-content.highlightable"
  );

  function makeLinksClickable(element) {
    const textNodes = getTextNodes(element);

    for (const node of textNodes) {
      const text = node.nodeValue;
      const linkRegex =
        /(?:https?|ftp):\/\/[\w-]+(?:\.[\w-]+)+(?:[\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?/g;
      const matches = text.match(linkRegex);

      if (matches) {
        for (const match of matches) {
          const link = document.createElement("a");
          link.href = match;
          link.textContent = match;
          link.style.cursor = "pointer";
          link.target = "_blank"; // Open the link in a new tab
          link.addEventListener("click", function (event) {
            event.preventDefault();
            window.open(link.href, "_blank");
          });

          const linkIndex = text.indexOf(match);
          const beforeText = text.substring(0, linkIndex);
          const afterText = text.substring(linkIndex + match.length);

          const parentNode = node.parentNode;
          parentNode.insertBefore(document.createTextNode(beforeText), node);
          parentNode.insertBefore(link, node);
          parentNode.insertBefore(document.createTextNode(afterText), node);

          parentNode.removeChild(node);
        }
      }
    }
  }

  // Helper function to get text nodes within an element
  function getTextNodes(element) {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    const textNodes = [];

    let node;
    while ((node = walker.nextNode())) {
      textNodes.push(node);
    }

    return textNodes;
  }

  // Function to remove the clickable link and restore plain text
  function removeLink(link) {
    const textNode = document.createTextNode(link.textContent);
    link.parentNode.replaceChild(textNode, link);
  }

  // Loop through all "three-content highlightable" elements
  highlightableElements.forEach(function (element) {
    makeLinksClickable(element);

    // Add event listener to handle link highlighting
    element.addEventListener("mouseup", function () {
      const selectedText = window.getSelection().toString().trim();
      if (selectedText !== "") {
        const links = element.getElementsByTagName("a");
        let linkHighlighted = false;
        for (const link of links) {
          if (link.textContent === selectedText) {
            // Highlighted text matches the link, remove the link and restore plain text
            removeLink(link);
            linkHighlighted = true;
          }
        }

        if (!linkHighlighted) {
          // If the selected text doesn't match any link, apply custom highlighting
          const range = window.getSelection().getRangeAt(0);
          const span = document.createElement("span");
          span.style.backgroundColor = getRandomColor();
          span.appendChild(range.extractContents());
          range.insertNode(span);
        }
      }
    });
  });
});
