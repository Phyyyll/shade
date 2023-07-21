/*ALL PARAGRAPH */
document.addEventListener("mouseup", function () {
  const selection = window.getSelection();
  const selectedText = selection.toString();

  if (selectedText.trim() !== "") {
    const range = selection.getRangeAt(0);
    const newNode = document.createElement("mark");
    range.surroundContents(newNode);
    selection.removeAllRanges();
  }
});

/*PARAGRAPH TWO */

/*PARAGRAPH THREE */

/*PARAGRAPH FOUR */
