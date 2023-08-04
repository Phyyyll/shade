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
    document.designMode = "on";
    if (range) {
      highlighted.removeAllRanges();
      highlighted.addRange(range);
    }
    if (highlightColor !== "transparent") {
      document.execCommand("backColor", false, highlightColor);
    } else {
      document.execCommand("removeFormat");
    }
    document.designMode = "off";
    collectHighlightIndices(selectedButton);
    window.getSelection().removeAllRanges();
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
      // We don't need to remove the existing log entry, just split it if necessary
      splitLogEntry(button, existingLogIndex, startIdx, endIdx);
    } else {
      const logItem = [startIdx.toString(), endIdx.toString()];
      logData[button].push(logItem);
    }

    removeOverlappingEntries(button, startIdx, endIdx);
    updateConsole();
  }

  function splitLogEntry(button, existingLogIndex, startIdx, endIdx) {
    const logItem = logData[button][existingLogIndex];
    const logStart = parseInt(logItem[0], 10);
    const logEnd = parseInt(logItem[1], 10);

    // Create a new log entry for the part before the new highlight
    if (startIdx > logStart) {
      const newLogItemBefore = [logStart.toString(), (startIdx - 1).toString()];
      logData[button].splice(existingLogIndex, 0, newLogItemBefore);
      existingLogIndex++;
    }

    // Create a new log entry for the part after the new highlight
    if (endIdx < logEnd) {
      const newLogItemAfter = [(endIdx + 1).toString(), logEnd.toString()];
      logData[button].splice(existingLogIndex + 1, 0, newLogItemAfter);
    }

    // Update the existing log entry to reflect the new highlight
    logItem[0] = startIdx.toString();
    logItem[1] = endIdx.toString();
  }

  function removeOverlappingEntries(button, startIdx, endIdx) {
    for (const type in logData) {
      if (type !== button) {
        logData[type] = logData[type].filter(
          (logItem) =>
            startIdx > parseInt(logItem[1], 10) ||
            endIdx < parseInt(logItem[0], 10)
        );
      }
    }
  }

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
