document.addEventListener("DOMContentLoaded", function () {
  const highlightableElements = document.querySelectorAll(".highlightable");

  // Add event listeners to all elements with the "highlightable" class
  highlightableElements.forEach(function (element) {
    element.addEventListener("mouseup", function () {
      const selection = window.getSelection();
      const selectedText = selection.toString().trim();

      // Check if the selection contains the parent element (e.g., header)
      if (element.contains(selection.anchorNode.parentElement)) {
        if (selectedText !== "") {
          // Create a new span element and apply the permanent-highlight class
          const span = document.createElement("span");
          span.className = "permanent-highlight";
          span.textContent = selectedText;

          // Surround the selected text with the span element
          const range = selection.getRangeAt(0);
          range.surroundContents(span);
        }
      }
    });
  });
});
