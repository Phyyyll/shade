document.querySelector(".second").addEventListener("mouseup", function () {
  var selection = window.getSelection().toString().trim();
  if (selection !== "") {
    var span = document.createElement("span");
    span.textContent = selection;
    span.classList.add("highlighted");

    var range = window.getSelection().getRangeAt(0);
    var highlightedText = document.createElement("span");
    highlightedText.appendChild(range.extractContents());
    highlightedText.classList.add("highlighted");

    range.insertNode(highlightedText);
    window.getSelection().removeAllRanges();

    // 1. when i hover onto a highlighted group, a toolkit will appear
    var toolkit = document.createElement("div");
    toolkit.classList.add("toolkit");
    highlightedText.appendChild(toolkit);

    // 2. the toolkit should be a large rectangle and clickable
    toolkit.style.display = "none"; // Hidden by default
    toolkit.style.width = "100px";
    toolkit.style.height = "38px";
    toolkit.style.backgroundColor = "rgba(255, 255, 0, 0.8)"; // Yellow with transparency
    toolkit.style.position = "absolute";
    toolkit.style.top = "0";
    toolkit.style.left = "0";
    toolkit.style.cursor = "pointer";

    // 3. inside the toolkit, there should be "Reset Highlight"
    var resetButton = document.createElement("button");
    resetButton.textContent = "Reset Highlight";
    toolkit.appendChild(resetButton);

    // Function to hide the toolkit when the cursor is not under it
    function hideToolkit() {
      if (!isCursorUnderElement(resetButton)) {
        toolkit.style.display = "none";
      }
    }

    // Check if the cursor is under an element
    function isCursorUnderElement(element) {
      var rect = element.getBoundingClientRect();
      return (
        rect.top <= event.clientY &&
        rect.bottom >= event.clientY &&
        rect.left <= event.clientX &&
        rect.right >= event.clientX
      );
    }

    // Hide the toolkit when the cursor is not under it
    document.addEventListener("mousemove", hideToolkit);

    // 4. when the toolkit is pressed, the highlight of the group should be removed, the CSS should be intact.
    resetButton.addEventListener("click", function (event) {
      event.stopPropagation();
      highlightedText.outerHTML = highlightedText.innerHTML; // Removes the span and keeps the content intact
      toolkit.style.display = "none"; // Hide the toolkit after resetting the highlight
    });

    // Event listeners for showing the toolkit on hover
    highlightedText.addEventListener("mouseover", function () {
      toolkit.style.display = "block";
    });
  }
});
