// credits.js
/**
 * סגירת הטאב הנוכחי
 * מנסה לסגור את הטאב דרך ה-Chrome API, אם זה לא עובד - סוגר את החלון
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
  