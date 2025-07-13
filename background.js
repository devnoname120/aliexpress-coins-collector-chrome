/**
 * @author Mordechai Neeman
 * @copyright 2025
 * @license Custom License
 * @see https://github.com/MordechaiN/aliexpress-coins-collector-chrome
 */

// Link list - now loaded from storage
const SHOPS = [
  "0094d30d6bb64404a457758cb172d3a6",
  "0103f01098e1461bbf4cee788761e159",
  "0c1845bb724a42778effef86f6ca0b5e",
  "10c6c63f72cf43d0925970a990f7232d",
  "1465f54c3802430a86efe9f859d1d641",
  "1fcb3e07f8f2471c95161497d80a91f7",
  "470df0c30a0848dcb5382104e3d26b95",
  "521ca4de04bd478b81d990e21ec1a45d",
  "5a96e8a378fe418fbd20331ff74a1b97",
  "6446f9b385c249fb9baa289214f016e1",
  "6b0870a9d7a943b1b08a4b275905c8e3",
  "8e051e8200cd48de825e99f834683690",
  "SHOP%7CSHOP_HOME%7C542788%7C23578",
  "SHOP%7CSHOP_HOME%7C666371%7C26385",
  "a73426260b7f4ebab4d8bc2e268d2e89",
  "aa738abeccb3427aa9a704f845d0f1db",
  "abb7e1dcd089459c9c34116414ed7b68",
  "af3a60f9515841e4b7d9aa4a1d3acf1d",
  "dacc7e77b34f4360ad2b3f93b03141bc",
  "e5ba5b7349344a0987687e67ca3e54fe",
  "ee5797613d7c49fb8c4fec31afe22e24",
];

let LINKS = SHOPS.map(id => `https://sale.aliexpress.com/__mobile/wTTBw4hZBz_m.htm?outBizId=${id}&identity=SHOP`);

let isLoggingEnabled = true;
let currentProcessing = false;

// New variables for statistics tracking
let dailyStats = { successful: 0, failed: 0, total: 0, startTime: null };

// New variables for advanced analytics
let analytics = {
  dailyStats: [], // Contains objects with date and daily successes
  totalCoins: 0, // Sum of all successes from the beginning
  currentStreak: 0, // Streak of days with at least one success
  lastRunDate: null
};

// Constants for mobile coin collection
const MOBILE_COIN_URL = 'https://m.aliexpress.com/p/coin-index/index.html?_immersiveMode=true&from=widget&aewidget_status=signed&bizId=coins&widgetId=widget_coin_2x2_normal&user_growth_scene=widget&aewidget_biz_version=1&aewidget_widgetId=widget_coin_2x2_normal&aewidget_bizId=coins&aewidget_login=true&aewidget_deviceLevel=1&fromApp=true';
const MOBILE_USER_AGENT = 'AliApp(AE/8.131.2)';
const RULE_ID = 1;

// Function to load analytics from storage
async function loadAnalyticsFromStorage() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['analytics'], (result) => {
      if (result.analytics) {
        analytics = { ...analytics, ...result.analytics };
      }
      resolve();
    });
  });
}

// Function to save analytics to storage
function saveAnalyticsToStorage() {
  chrome.storage.sync.set({ analytics }, () => {
    log('Analytics data saved');
  });
}

// Function to update daily statistics
function updateDailyStats(successful, failed, duration) {
  const today = new Date().toISOString().split('T')[0];

  let todayStats = analytics.dailyStats.find(day => day.date === today) || {
    date: today,
    successful: 0,
    failed: 0,
    total: 0,
    successRate: 0,
    duration: 0,
    coinsCollected: 0
  };

  todayStats.successful += successful;
  todayStats.failed += failed;
  todayStats.total = todayStats.successful + todayStats.failed;
  todayStats.coinsCollected = todayStats.successful; // 1 coin = 1 success
  todayStats.successRate = Math.round((todayStats.successful / todayStats.total) * 100) || 0;

  analytics.totalCoins += successful; // Add to total successes
}

// Function to update streak
function updateStreak(today, wasSuccessful) {
  if (wasSuccessful) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (analytics.lastRunDate === yesterdayStr || analytics.lastRunDate === today) {
      analytics.currentStreak++;
    } else {
      analytics.currentStreak = 1;
    }
  } else {
    analytics.currentStreak = 0;
  }
}

// Function to get analytics data
function getAnalyticsData() {
  const today = new Date().toISOString().split('T')[0];
  const todayStats = analytics.dailyStats.find(day => day.date === today) ||
    { successful: 0, failed: 0, total: 0, successRate: 0, duration: 0 };

  const weeklyStats = analytics.dailyStats
    .filter(day => {
      const dayDate = new Date(day.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return dayDate >= weekAgo;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return {
    today: todayStats,
    weekly: weeklyStats,
    total: {
      coins: analytics.totalCoins,
      streak: analytics.currentStreak
    },
    dailyStats: weeklyStats
  };
}

// Function to show friendly notifications
function showNotification(title, message, type = 'basic') {
  const iconUrl = type === 'success' ? 'icon48.png' :
                  type === 'error' ? 'icon48.png' : 'icon48.png';

  chrome.notifications.create({
    type: 'basic',
    iconUrl: iconUrl,
    title: title,
    message: message,
    priority: 1
  });
}

// Function to load links from storage
async function loadLinksFromStorage() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['customLinks'], (result) => {
      if (result.customLinks && result.customLinks.length > 0) {
        LINKS = result.customLinks;
        log(`Loaded ${LINKS.length} links from storage`);
      } else {
        // Save default links the first time
        saveLinksToStorage(LINKS);
      }
      resolve();
    });
  });
}

// Function to save links to storage
function saveLinksToStorage(links) {
  chrome.storage.sync.set({ customLinks: links }, () => {
    log(`Saved ${links.length} links to storage`);
  });
}

// Function to log
function log(message) {
  if (isLoggingEnabled) {
    const timestamp = new Date().toLocaleString('en-US');
    console.log(`[${timestamp}] AliExpress Coins Collector: ${message}`);
    chrome.storage.sync.get(['logs'], (result) => {
      const logs = result.logs || [];
      logs.push(`[${timestamp}] ${message}`);
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
      }
      chrome.storage.sync.set({ logs });
    });
  }
}

// Function to calculate next 10:30 time
function getNext1030() {
  const now = new Date();
  let target = new Date();
  target.setHours(10, 30, 0, 0);

  if (now >= target) {
    target.setDate(target.getDate() + 1);
  }

  return target.getTime();
}

// Create daily alarm for 10:30
chrome.runtime.onInstalled.addListener(async () => {
  log('Extension installed successfully');
  // On install notification
  // showNotification('🎉 AliExpress Coins Collector', 'The extension was installed successfully! Coin collection will start tomorrow at 10:30', 'success');

  // Load links from storage
  await loadLinksFromStorage();
  await loadAnalyticsFromStorage();

  chrome.alarms.create('dailyAliExpressTask', {
    when: getNext1030(),
    periodInMinutes: 24 * 60
  });

  log('Daily alarm set for 10:30');
});

// Listener for alarms
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'dailyAliExpressTask' && !currentProcessing) {
    log('Starting daily processing of links');
    currentProcessing = true;

    // Reset daily statistics
    dailyStats = { successful: 0, failed: 0, total: LINKS.length, startTime: new Date() };

    // Start notification
    // showNotification('🚀 Starting coin collection', `Processing ${LINKS.length} links...`, 'basic');

    try {
      await loadLinksFromStorage(); // Reload links
      await processAllLinks();
    } catch (error) {
      log(`Error processing: ${error.message}`);
      showNotification('❌ Error processing', `Error: ${error.message}`, 'error');
    } finally {
      currentProcessing = false;

      // End notification with statistics
      const duration = Math.round((new Date() - dailyStats.startTime) / 1000 / 60);
      const successRate = Math.round((dailyStats.successful / dailyStats.total) * 100);

      showNotification(
        '✅ Coin collection completed!',
        `Successes: ${dailyStats.successful}/${dailyStats.total} (${successRate}%) | Time: ${duration} minutes`,
        'success'
      );

      // Update analytics
      updateDailyStats(dailyStats.successful, dailyStats.failed, duration);

      log(`End of daily processing - Successes: ${dailyStats.successful}, Failures: ${dailyStats.failed}`);
    }
  }
});

// Function to collect mobile coins
async function collectMobileCoins() {
  try {
    // 1. Set up the user agent rule
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [RULE_ID],
      addRules: [{
        id: RULE_ID,
        priority: 1,
        action: {
          type: 'modifyHeaders',
          requestHeaders: [{
            header: 'User-Agent',
            operation: 'set',
            value: MOBILE_USER_AGENT
          }]
        },
        condition: {
          urlFilter: '|https://m.aliexpress.com/*',
          resourceTypes: ['main_frame', 'xmlhttprequest']
        }
      }]
    });

    // 2. Open the mobile coins page
    const { id: tabId } = await chrome.tabs.create({ url: MOBILE_COIN_URL });

    // await sleep(1000);

    // 3. Wait for page load and click the sign button
        await sleep(3000);

        // Wait a bit for the page to fully initialize
        setTimeout(async () => {
          try {
            await chrome.scripting.executeScript({
              target: { tabId },
              func: () => {
                const signButton = document.querySelector('#signButton');
                if (signButton) {
                  signButton.click();
                  return true;
                }
                return false;
              }
            });
          } catch (error) {
            log(`Error clicking mobile sign button: ${error.message}`);
          }
        }, 3000);


    await sleep(5000);

    // chrome.tabs.onUpdated.addListener(listener);
    // 4. Clean up when the tab is closed
    const closeHandler = async closedTabId => {
      if (closedTabId === tabId) {
        await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: [RULE_ID] });
        chrome.tabs.onRemoved.removeListener(closeHandler);
      }
    };
    chrome.tabs.onRemoved.addListener(closeHandler);

  } catch (error) {
    log(`Error in mobile coin collection: ${error.message}`);
  }
}

// Add mobile coin collection to the daily processing
async function processAllLinks() {
  // First collect mobile coins
  await collectMobileCoins();

  // Then process regular links
  for (let i = 0; i < LINKS.length; i++) {
    const link = LINKS[i];
    log(`Opening link ${i + 1}/${LINKS.length}: ${link.substring(0, 50)}...`);
    try {
      // Convert chrome.tabs.create to Promise
      const tab = await new Promise((resolve, reject) => {
        chrome.tabs.create({ url: link, active: false }, (tab) => {
          if (chrome.runtime.lastError || !tab) reject(new Error(chrome.runtime.lastError?.message || 'Error opening tab'));
          else resolve(tab);
        });
      });

      // Wait for page load
      await waitForTabLoad(tab.id);

      // Convert chrome.scripting.executeScript to Promise
      const result = await new Promise((resolve, reject) => {
        chrome.scripting.executeScript(
          { target: { tabId: tab.id }, func: performPageActions },
          (results) => {
            if (chrome.runtime.lastError || !results) reject(new Error(chrome.runtime.lastError?.message || 'Script execution failed'));
            else resolve(results);
          }
        );
      });

      // Check result
      if (result && result[0] && result[0].result) {
        // Success
        dailyStats.successful++;
        log(`Link ${i + 1} completed successfully ✅`);
      } else {
        // No button found or error
        dailyStats.failed++;
        log(`Link ${i + 1} - No button found ❌`);
      }

      // Close tab
      await new Promise((resolve) => {
        chrome.tabs.remove(tab.id, () => resolve());
      });
      await sleep(1000); // Wait between links
    } catch (error) {
      // Handle errors
      dailyStats.failed++;
      log(`Error in link ${i + 1}: ${error.message} 💥`);
    }

    // Progress notification every 3 links
    // if ((i + 1) % 3 === 0 && i < LINKS.length - 1) {
    //   showNotification(
    //     '⏳ Processing...',
    //     `Completed ${i + 1}/${LINKS.length} links (${dailyStats.successful} successes)`,
    //     'basic'
    //   );
    // }
  }
}

// Function to wait for tab load
function waitForTabLoad(tabId) {
  return new Promise((resolve) => {
    const checkStatus = () => {
      chrome.tabs.get(tabId, (tab) => {
        if (chrome.runtime.lastError) {
          resolve();
          return;
        }

        if (tab.status === 'complete') {
          resolve();
        } else {
          setTimeout(checkStatus, 100);
        }
      });
    };

    checkStatus();
  });
}

// Function to wait
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to run on page (content script)
function performPageActions() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('Looking for sign-in button');

      const buttons = document.querySelectorAll('div.ci-button, button, [role="button"]');
      let targetButton = null;

      // Enhanced logic for button identification
      for (const button of buttons) {
        const text = button.textContent;
        if (
          /כניסה|enter|sign[ -]in|check[ -]in/gi.test(text) ||
          button.getAttribute('data-spm')?.includes('sign')
        ) {
          targetButton = button;
          break;
        }
      }

      if (targetButton) {
        console.log('Button found, clicking on it');
        targetButton.click();
        setTimeout(() => resolve(true), 2000)
      } else {
        console.log('No matching button found');
        resolve(false); // Return failure
      }
    }, 1000);
  });
}

// Listener for messages from popup - extended with new functions
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getStatus') {
    sendResponse({
      isLoggingEnabled,
      currentProcessing,
      nextRun: getNext1030(),
      dailyStats
    });
  } else if (request.action === 'toggleLogging') {
    isLoggingEnabled = !isLoggingEnabled;
    log(`Logging ${isLoggingEnabled ? 'enabled' : 'disabled'}`);
    sendResponse({ isLoggingEnabled });
  } else if (request.action === 'testRun') {
    if (!currentProcessing) {
      log('Starting manual test');
      // Manual test notification
      // showNotification('🧪 Manual test', 'Starting manual test of coin collection...', 'basic');

      // Reset statistics for test
      dailyStats = { successful: 0, failed: 0, total: LINKS.length, startTime: new Date() };

      loadLinksFromStorage().then(() => {
        processAllLinks();
      });
      sendResponse({ success: true });
    } else {
      sendResponse({ success: false, message: 'Processing already running' });
    }
  } else if (request.action === 'getLogs') {
    chrome.storage.sync.get(['logs'], (result) => {
      sendResponse({ logs: result.logs || [] });
    });
    return true;
  }
  // New functions for link management
  else if (request.action === 'getLinks') {
    sendResponse({ links: LINKS });
  } else if (request.action === 'addLink') {
    if (request.link && request.link.includes('aliexpress.com')) {
      LINKS.push(request.link);
      saveLinksToStorage(LINKS);
      log(`Added new link: ${request.link.substring(0, 50)}...`);
      // showNotification('➕ New link added', 'New link added successfully to the list!', 'success');
      sendResponse({ success: true });
    } else {
      sendResponse({ success: false, message: 'Invalid link' });
    }
  } else if (request.action === 'deleteLink') {
    if (request.index >= 0 && request.index < LINKS.length) {
      const deletedLink = LINKS.splice(request.index, 1)[0];
      saveLinksToStorage(LINKS);
      log(`Deleted link: ${deletedLink.substring(0, 50)}...`);
      // showNotification('🗑️ Link deleted', 'Link removed successfully from the list!', 'basic');
      sendResponse({ success: true });
    } else {
      sendResponse({ success: false, message: 'Invalid index' });
    }
  } else if (request.action === 'importLinks') {
    if (request.links && Array.isArray(request.links)) {
      LINKS = [...LINKS, ...request.links];
      saveLinksToStorage(LINKS);
      log(`Imported ${request.links.length} new links`);
      // showNotification('📥 New links imported', `${request.links.length} new links imported successfully!`, 'success');
      sendResponse({ success: true });
    } else {
      sendResponse({ success: false, message: 'Invalid link list' });
    }
  } else if (request.action === 'getAnalytics') {
    const analyticsData = getAnalyticsData();
    sendResponse({ analytics: analyticsData });
  } else if (request.action === 'resetAnalytics') {
    analytics = {
      dailyStats: [],
      totalCoins: 0,
      currentStreak: 0,
      lastRunDate: null
    };
    saveAnalyticsToStorage();
    log('Analytics data reset');
    sendResponse({ success: true });
  } else if (request.action === 'closeCurrentTab') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.remove(tabs[0].id);
      }
    });
    sendResponse({ success: true });
  }
});
