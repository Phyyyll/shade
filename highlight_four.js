// Function to check if a string contains a specific word
function containsWord(text, word) {
  const regex = new RegExp(`\\b${word}\\b`, "i");
  return regex.test(text);
}

// Function to generate a random color
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Function to apply custom highlighting with random colors
function applyCustomHighlight(element) {
  const text = element.textContent;
  const highlightedText = text
    .split("")
    .map((char) => {
      const color = getRandomColor();
      return `<span style="background-color: ${color}">${char}</span>`;
    })
    .join("");
  element.innerHTML = highlightedText;
}

// Function to handle highlighting based on the presence of "ipsum"
function handleHighlighting(event) {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();

  if (selectedText && containsWord(selectedText, "ipsum")) {
    const range = selection.getRangeAt(0);
    const span = document.createElement("span");
    span.classList.add("highlighted-text");
    span.appendChild(range.extractContents());
    applyCustomHighlight(span);
    range.insertNode(span);
  }
}

// Add event listener for when the document is ready
document.addEventListener("DOMContentLoaded", () => {
  // Add event listener for when the user highlights text
  document.addEventListener("mouseup", handleHighlighting);

  // Add event listener for touch devices
  document.addEventListener("touchend", handleHighlighting);
});
