/**
 * @author Mordechai Neeman
 * @copyright 2025
 * @license Custom License
 * @see https://github.com/MordechaiN/aliexpress-coins-collector-chrome
 */

// Link list - now loaded from storage
let LINKS = [
  "https://sale.aliexpress.com/__mobile/wTTBw4hZBz_m.htm?outBizId=5a96e8a378fe418fbd20331ff74a1b97&identity=SHOP&shopNowRedirect=https%253A%252F%252Fwww.aliexpress.com%252Fstore%252F1051119&spm=a2g0n.store_m_home.checkin_with_prize_2002708235515.0&statusBarHeight=93&_currency=USD&_lang=en_MA&fromApp=true&_launchTID=f50d9910-fd81-4c7a-a5e4-88da9ebb1219&aff_fcid=1010fe80a381497ea5be63e6f27ae502-1723128525135-02380-_DkopTOr&tt=CPS_NORMAL&aff_fsk=_DkopTOr&nr=n&_dognoseId=WlBpb1lNZEl5cWtEQUpDRnFRTHhkVlkBkTJ2rNJhbGlleHByZQAAA48y&aff_fcid=2c74dbb1986d4cf9a0506a067b901b78-1743156791321-08463-_DDxpLMf&tt=CPS_NORMAL&aff_fsk=_DDxpLMf&aff_platform=portals-tool&sk=_DDxpLMf&aff_trace_key=2c74dbb1986d4cf9a0506a067b901b78-1743156791321-08463-_DDxpLMf&terminal_id=bd170ef5df5a49228059a474d1c1c1ea",
  "https://sale.aliexpress.com/__mobile/wTTBw4hZBz_m.htm?outBizId=1fcb3e07f8f2471c95161497d80a91f7&identity=SHOP&shopNowRedirect=https%253A%252F%252Fwww.aliexpress.com%252Fstore%252F912370197&spm=a2g0n.store_m_home.checkin_with_prize_2008922585801.0&statusBarHeight=93&_currency=USD&_lang=en_MA&fromApp=true&_launchTID=0f86239d-ecea-4ef1-ab2c-c931809923b5&aff_fcid=5a7aebf80d1e4b47a86252f26eb55e31-1723139618559-08629-_DcJtNQP&tt=CPS_NORMAL&aff_fsk=_DcJtNQP&nr=n&_dognoseId=WlBpb1lNZEl5cWtEQUpDRnFRTHhkVlkBkTMf8rJhbGlleHByZQAAAXls&aff_fcid=36b877b12bff40ffa968b1c48a4d8d3c-1743156817542-08565-_DmmmKt5&tt=CPS_NORMAL&aff_fsk=_DmmmKt5&aff_platform=portals-tool&sk=_DmmmKt5&aff_trace_key=36b877b12bff40ffa968b1c48a4d8d3c-1743156817542-08565-_DmmmKt5&terminal_id=bd170ef5df5a49228059a474d1c1c1ea",
  "https://sale.aliexpress.com/__mobile/wTTBw4hZBz_m.htm?outBizId=1465f54c3802430a86efe9f859d1d641&identity=SHOP&shopNowRedirect=https%253A%252F%252Fwww.aliexpress.com%252Fstore%252F1927090&spm=a2g0n.store_m_home.checkin_with_prize_2003858993902.0&statusBarHeight=93&_currency=USD&_lang=en_MA&fromApp=true&_launchTID=174d326a-4cef-481c-8b5c-e591ce0bbc75&aff_fcid=d4a8a827f5b7458f9e5a482f518c47b3-1723139781080-02704-_DlfIOxz&tt=CPS_NORMAL&aff_fsk=_DlfIOxz&nr=n&_dognoseId=WlBpb1lNZEl5cWtEQUpDRnFRTHhkVlkBkTMibNdhbGlleHByZQAAA1Hg&aff_fcid=53a5adee1bff470694d31843c1ce514d-1743156824186-07543-_DmLqKZV&tt=CPS_NORMAL&aff_fsk=_DmLqKZV&aff_platform=portals-tool&sk=_DmLqKZV&aff_trace_key=53a5adee1bff470694d31843c1ce514d-1743156824186-07543-_DmLqKZV&terminal_id=bd170ef5df5a49228059a474d1c1c1ea",
  "https://sale.aliexpress.com/__mobile/wTTBw4hZBz_m.htm?_t=1728044340.120206&outBizId=0094d30d6bb64404a457758cb172d3a6&identity=SHOP&aff_fcid=8cb175eb36164cd6a8e57ec119fb04ba-1743617164483-08272-_om9LlmZ&tt=CPS_NORMAL&aff_fsk=_om9LlmZ&locale=en_US&dp=e8012ed7ffc93a78e7a3e45763140086&af=985336&cv=47843&afref=&mall_affr=pr3&utm_source=admitad&utm_medium=cpa&utm_campaign=985336&utm_content=47843&dp=e8012ed7ffc93a78e7a3e45763140086&af=985336&cv=47843&afref=&mall_affr=pr3&utm_source=admitad&utm_medium=cpa&utm_campaign=985336&utm_content=47843&aff_fcid=8e1508326062422993ed14eadf49ca10-1743617178915-05367-_ePNSNV&aff_fsk=_ePNSNV&aff_platform=portals-tool&sk=_ePNSNV&aff_trace_key=8e1508326062422993ed14eadf49ca10-1743617178915-05367-_ePNSNV&terminal_id=bd170ef5df5a49228059a474d1c1c1ea",
  "https://sale.aliexpress.com/__mobile/wTTBw4hZBz_m.htm?_t=1733067756.609393&outBizId=6446f9b385c249fb9baa289214f016e1&identity=SHOP&aff_fcid=1666b973aa7f4245ba8145bbc363fb10-1743617166913-08579-_oDedTln&tt=CPS_NORMAL&aff_fsk=_oDedTln&locale=en_US&dp=fcaaa7b3661eb7693313773740718378&af=985336&cv=47843&afref=&mall_affr=pr3&utm_source=admitad&utm_medium=cpa&utm_campaign=985336&utm_content=47843&dp=fcaaa7b3661eb7693313773740718378&af=985336&cv=47843&afref=&mall_affr=pr3&utm_source=admitad&utm_medium=cpa&utm_campaign=985336&utm_content=47843&aff_fcid=a0527ed4eec346b7a87ab39b02dfcf0d-1743617181533-00365-_ePNSNV&aff_fsk=_ePNSNV&aff_platform=portals-tool&sk=_ePNSNV&aff_trace_key=a0527ed4eec346b7a87ab39b02dfcf0d-1743617181533-00365-_ePNSNV&terminal_id=bd170ef5df5a49228059a474d1c1c1ea",
  "https://sale.aliexpress.com/__mobile/wTTBw4hZBz_m.htm?_t=1728044562.681774&outBizId=e5ba5b7349344a0987687e67ca3e54fe&identity=SHOP&aff_fcid=5eee0a5c179944d89f722dc3cb773b6b-1743617168311-05960-_olkfTLL&tt=CPS_NORMAL&aff_fsk=_olkfTLL&locale=en_US&dp=2f5857cf31d6454fcadf4fd751ff74ad&af=985336&cv=47843&afref=&mall_affr=pr3&utm_source=admitad&utm_medium=cpa&utm_campaign=985336&utm_content=47843&dp=2f5857cf31d6454fcadf4fd751ff74ad&af=985336&cv=47843&afref=&mall_affr=pr3&utm_source=admitad&utm_medium=cpa&utm_campaign=985336&utm_content=47843&aff_fcid=af2bc454987d4dbba61368216735a82c-1743617183730-06619-_ePNSNV&aff_fsk=_ePNSNV&aff_platform=portals-tool&sk=_ePNSNV&aff_trace_key=af2bc454987d4dbba61368216735a82c-1743617183730-06619-_ePNSNV&terminal_id=bd170ef5df5a49228059a474d1c1c1ea",
  "https://sale.aliexpress.com/__mobile/wTTBw4hZBz_m.htm?_t=1733067520.787595&outBizId=6b0870a9d7a943b1b08a4b275905c8e3&identity=SHOP&aff_fcid=6905cbbde8a14efd9bf766ad9f42f948-1743617170363-04091-_opIfj8N&tt=CPS_NORMAL&aff_fsk=_opIfj8N&locale=en_US&dp=13fad9fc7cceccad0d412bdd368d4f99&af=985336&cv=47843&afref=&mall_affr=pr3&utm_source=admitad&utm_medium=cpa&utm_campaign=985336&utm_content=47843&dp=13fad9fc7cceccad0d412bdd368d4f99&af=985336&cv=47843&afref=&mall_affr=pr3&utm_source=admitad&utm_medium=cpa&utm_campaign=985336&utm_content=47843&aff_fcid=2b547d82d0a243f1b68d1d7611b8041c-1743617288034-03907-_ePNSNV&aff_fsk=_ePNSNV&aff_platform=portals-tool&sk=_ePNSNV&aff_trace_key=2b547d82d0a243f1b68d1d7611b8041c-1743617288034-03907-_ePNSNV&terminal_id=bd170ef5df5a49228059a474d1c1c1ea"
];

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
  showNotification('🎉 AliExpress Coins Collector', 'The extension was installed successfully! Coin collection will start tomorrow at 10:30', 'success');
  
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
    showNotification('🚀 Starting coin collection', `Processing ${LINKS.length} links...`, 'basic');
    
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

async function processAllLinks() {
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
      
      await sleep(2000); // Wait between links
    } catch (error) {
      // Handle errors
      dailyStats.failed++;
      log(`Error in link ${i + 1}: ${error.message} 💥`);
    }
    
    // Progress notification every 3 links
    if ((i + 1) % 3 === 0 && i < LINKS.length - 1) {
      showNotification(
        '⏳ Processing...', 
        `Completed ${i + 1}/${LINKS.length} links (${dailyStats.successful} successes)`, 
        'basic'
      );
    }
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
          setTimeout(checkStatus, 500);
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
        const text = button.textContent.trim().toLowerCase();
        if (
          text.includes('sign in') || 
          text.includes('enter') || 
          text.includes('sign') ||
          button.getAttribute('data-spm')?.includes('sign')
        ) {
          targetButton = button;
          break;
        }
      }
      
      if (targetButton) {
        console.log('Button found, clicking on it');
        targetButton.click();
        resolve(true); // Return actual success
      } else {
        console.log('No matching button found');
        resolve(false); // Return failure
      }
    }, 5000);
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
      showNotification('🧪 Manual test', 'Starting manual test of coin collection...', 'basic');
      
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
      showNotification('➕ New link added', 'New link added successfully to the list!', 'success');
      sendResponse({ success: true });
    } else {
      sendResponse({ success: false, message: 'Invalid link' });
    }
  } else if (request.action === 'deleteLink') {
    if (request.index >= 0 && request.index < LINKS.length) {
      const deletedLink = LINKS.splice(request.index, 1)[0];
      saveLinksToStorage(LINKS);
      log(`Deleted link: ${deletedLink.substring(0, 50)}...`);
      showNotification('🗑️ Link deleted', 'Link removed successfully from the list!', 'basic');
      sendResponse({ success: true });
    } else {
      sendResponse({ success: false, message: 'Invalid index' });
    }
  } else if (request.action === 'importLinks') {
    if (request.links && Array.isArray(request.links)) {
      LINKS = [...LINKS, ...request.links];
      saveLinksToStorage(LINKS);
      log(`Imported ${request.links.length} new links`);
      showNotification('📥 New links imported', `${request.links.length} new links imported successfully!`, 'success');
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
