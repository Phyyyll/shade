document.addEventListener("DOMContentLoaded", () => {
  const highlightForm = document.getElementById("highlightForm");
  const container = document.getElementById("container");

  let highlightColor = "green";
  let selectedButton = "Like";
  let logData = {};

  function setHighlightColor(color) {
    highlightColor = color;
    selectedButton = document
      .querySelector('input[name="action"]:checked')
      .nextSibling.textContent.trim();
  }

  function setStartButton() {
    selectedButton = "Start";
    highlightColor = "transparent";
  }

  function handleHighlight() {
    const highlighted = window.getSelection();
    if (!highlighted.toString().replace(/\s/g, "")) return;

    const range = highlighted.getRangeAt(0);
    const partialWordRange = expandRangeToWholeWord(range);

    if (partialWordRange) {
      document.designMode = "on";
      highlighted.removeAllRanges();
      highlighted.addRange(partialWordRange);

      if (highlightColor !== "transparent") {
        document.execCommand("backColor", false, highlightColor);
      } else {
        document.execCommand("removeFormat");
      }

      document.designMode = "off";
      collectHighlightIndices(selectedButton);
      window.getSelection().removeAllRanges();
    }
  }

  function expandRangeToWholeWord(partialRange) {
    const startContainer = partialRange.startContainer;
    const startOffset = partialRange.startOffset;
    const endContainer = partialRange.endContainer;
    const endOffset = partialRange.endOffset;

    // Find the beginning of the word
    let wordStartOffset = startOffset;
    while (
      wordStartOffset > 0 &&
      !/\s/.test(startContainer.textContent.charAt(wordStartOffset - 1))
    ) {
      wordStartOffset--;
    }

    // Find the end of the word
    let wordEndOffset = endOffset;
    while (
      wordEndOffset < endContainer.textContent.length &&
      !/\s/.test(endContainer.textContent.charAt(wordEndOffset))
    ) {
      wordEndOffset++;
    }

    if (wordStartOffset === wordEndOffset) {
      return null; // No valid word found
    }

    const wordRange = document.createRange();
    wordRange.setStart(startContainer, wordStartOffset);
    wordRange.setEnd(endContainer, wordEndOffset);

    return wordRange;
  }

  function collectHighlightIndices(button) {
    const paragraph = container.querySelector("p");
    if (!paragraph) return;

    const selection = window.getSelection();
    if (!selection.toString()) return;

    const range = selection.getRangeAt(0);
    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(paragraph);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);

    const startIdx = preSelectionRange.toString().length - 10;
    const endIdx = startIdx + selection.toString().length;

    if (!logData[button]) {
      logData[button] = [];
    }

    let existingLogIndex = -1;
    for (let i = 0; i < logData[button].length; i++) {
      const log = logData[button][i];
      const matchStart = parseInt(log[0], 10);
      const matchEnd = parseInt(log[1], 10);

      if (startIdx <= matchEnd && endIdx >= matchStart) {
        existingLogIndex = i;
        break;
      }
    }

    if (existingLogIndex !== -1) {
      splitLogEntry(button, existingLogIndex, startIdx, endIdx);
    } else {
      const logItem = [startIdx.toString(), endIdx.toString()];
      logData[button].push(logItem);
    }

    removeOverlappingEntries(button, startIdx, endIdx);
    updateConsole();
  }

  function splitLogEntry(button, existingLogIndex, startIdx, endIdx) {}

  function removeOverlappingEntries(button, startIdx, endIdx) {}

  function updateConsole() {
    console.clear();
    console.log("Highlighted Text Data:");
    console.log(logData);
  }

  container.addEventListener("mouseup", handleHighlight);
  highlightForm.addEventListener("click", (event) => {
    if (event.target.name === "action") {
      setHighlightColor(event.target.value);
    }
  });
});
