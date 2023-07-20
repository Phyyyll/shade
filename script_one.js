document.querySelector(".first").addEventListener("mouseup", function () {
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
  }
});
