// credits.js
/**
 * Close the current tab
 * Tries to close the tab via the Chrome API, if it doesn't work - closes the window
 */
function closeTab() {
  if (chrome && chrome.runtime) {
    chrome.runtime.sendMessage({ action: 'closeCurrentTab' }, () => {
      if (chrome.runtime.lastError) {
        window.close();
      }
    });
  } else {
    window.close();
  }
}

// הוספת event listener לכפתור הסגירה
document.addEventListener('DOMContentLoaded', () => {
  const closeButton = document.getElementById('closeButton');
  if (closeButton) {
    closeButton.addEventListener('click', closeTab);
  }
});
  