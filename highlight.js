document.addEventListener("DOMContentLoaded", function () {
  const highlightableElements = document.querySelectorAll(
    ".two-content.highlightable"
  );
  let currentTooltip;
  let tooltipTimeout;

  // Function to create and show the tooltip
  function showTooltip(event, highlightGroup) {
    clearTimeout(tooltipTimeout);
    const tooltipX = event.clientX;
    const tooltipY = event.clientY;

    // Show the tooltip only once per highlighted group
    if (!currentTooltip) {
      // Create the tooltip element
      const tooltip = document.createElement("div");
      tooltip.className = "tooltip";
      tooltip.textContent = "Remove Highlight";
      tooltip.style.left = tooltipX + "px";
      tooltip.style.top = tooltipY + "px";

      // Append the tooltip element to the body
      document.body.appendChild(tooltip);
      currentTooltip = tooltip;

      // Function to remove the tooltip and highlight when clicked
      function removeHighlight() {
        highlightGroup.forEach((highlightElement) => {
          highlightElement.outerHTML = highlightElement.textContent;
        });
        tooltip.remove();
        currentTooltip = null;
      }

      // Add click event to the tooltip to remove the highlight
      tooltip.addEventListener("click", removeHighlight);

      // Show the tooltip again when the cursor is back over the highlighted group
      highlightGroup[0].addEventListener("mouseenter", function () {
        if (currentTooltip) {
          currentTooltip.style.display = "block";
          clearTimeout(tooltipTimeout);
        }
      });

      // Hide the tooltip after a delay when cursor leaves the highlighted group
      highlightGroup[0].addEventListener("mouseleave", function () {
        tooltipTimeout = setTimeout(function () {
          if (currentTooltip) {
            currentTooltip.style.display = "none";
          }
        }, 1000);
      });

      // Prevent tooltip from disappearing when cursor is on the tooltip
      currentTooltip.addEventListener("mouseenter", function () {
        clearTimeout(tooltipTimeout);
      });

      // Hide the tooltip after a delay when cursor leaves the tooltip
      currentTooltip.addEventListener("mouseleave", function () {
        tooltipTimeout = setTimeout(function () {
          if (currentTooltip) {
            currentTooltip.style.display = "none";
          }
        }, 1000);
      });
    }
  }

  // Add event listeners to all "two-content highlightable" elements
  highlightableElements.forEach(function (element) {
    element.addEventListener("mouseup", function (event) {
      const selectedText = window.getSelection().toString().trim();
      if (selectedText !== "") {
        // Create a new span element and apply the permanent-highlight class
        const span = document.createElement("span");
        span.className = "permanent-highlight";
        span.textContent = selectedText;

        // Surround the selected text with the span element
        const range = window.getSelection().getRangeAt(0);
        range.surroundContents(span);

        // Get all spans within the same highlightable group
        const highlightGroup = Array.from(
          element.querySelectorAll(".permanent-highlight")
        );

        // Call the showTooltip function on mouseover event
        span.addEventListener("mouseover", function (event) {
          showTooltip(event, highlightGroup);
        });
      }
    });
  });
});
