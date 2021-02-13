const markdownActions = {
  bold: (currentText, cursorStart, cursorEnd) => {
    if (cursorStart === cursorEnd) {
      // Append to cursor
      return (
        currentText.slice(0, cursorStart) +
        "**Bold text**" +
        currentText.slice(cursorStart)
      );
    } else {
      // Make selection bold
      return (
        currentText.slice(0, cursorStart) +
        "**" +
        currentText.slice(cursorStart, cursorEnd) +
        "**" +
        currentText.slice(cursorEnd)
      );
    }
  },
  list: (currentText, cursor) => {
    return (
      currentText.slice(0, cursor) +
      "- item 1\n- item 2\n" +
      currentText.slice(cursor)
    );
  },
};

export default markdownActions;
