/**
 * @author Mordechai Neeman
 * @copyright 2025
 * @license Custom License
 * @see https://github.com/MordechaiN/aliexpress-coins-collector-chrome
 */

document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const statusElement = document.getElementById('status');
  const nextRunElement = document.getElementById('nextRun');
  const loggingStatusElement = document.getElementById('loggingStatus');
  const themeToggle = document.getElementById('themeToggle');
  const testRunBtn = document.getElementById('testRun');
  const toggleLoggingBtn = document.getElementById('toggleLogging');
  const loggingText = document.getElementById('loggingText');  
  // Initial load
  loadStatus();
  loadTheme();
  loadAnalytics();
  
  // Listeners
  themeToggle.addEventListener('click', toggleTheme);
  testRunBtn.addEventListener('click', runTest);
  toggleLoggingBtn.addEventListener('click', toggleLogging);
  
  document.getElementById('showCredits').addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('credits.html') });
  });

  // Show/hide section buttons
  document.getElementById('manageLinks').addEventListener('click', () => toggleSection('linksContainer'));
  document.getElementById('showAnalytics').addEventListener('click', () => toggleSection('analyticsContainer'));
  document.getElementById('showLogs').addEventListener('click', () => toggleSection('logsContainer'));

  // Link management listeners
  document.getElementById('addLink').addEventListener('click', addNewLink);
  document.getElementById('exportLinks').addEventListener('click', exportLinks);
  document.getElementById('importLinks').addEventListener('click', importLinks);
  document.getElementById('resetStats').addEventListener('click', resetAnalytics);

  // Listener for Enter in new link field
  document.getElementById('newLinkInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addNewLink();
    }
  });

  // Functions
  function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    const isVisible = section.classList.contains('show');
    
    // Close all sections
    document.querySelectorAll('.expandable').forEach(el => el.classList.remove('show'));
    
    if (!isVisible) {
      section.classList.add('show');
      if (sectionId === 'linksContainer') loadLinks();
      if (sectionId === 'analyticsContainer') loadAnalytics();
      if (sectionId === 'logsContainer') loadLogs();
    }
  }

  function loadTheme() {
    chrome.storage.sync.get(['darkMode'], (result) => {
      const isDark = result.darkMode || false;
      document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
      themeToggle.textContent = isDark ? '☀️' : '🌙';
    });
  }

  function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    chrome.storage.sync.set({ darkMode: newTheme === 'dark' });
  }

  function loadStatus() {
    chrome.runtime.sendMessage({ action: 'getStatus' }, (response) => {
      if (response) {
        statusElement.textContent = response.currentProcessing ? 'Running now' : 'Waiting';
        nextRunElement.textContent = new Date(response.nextRun).toLocaleString('en-US');
        loggingStatusElement.textContent = response.isLoggingEnabled ? 'Enabled' : 'Disabled';
        loggingButtonText.textContent = response.isLoggingEnabled ? 'Disable Log' : 'Enable Log';
        testRunBtn.disabled = response.currentProcessing;
      }
    });
  }

  function loadAnalytics() {
    chrome.runtime.sendMessage({ action: 'getAnalytics' }, (response) => {
      if (response && response.analytics) {
        const analytics = response.analytics;
        const today = analytics.today || { successful: 0, total: 0 };
        document.getElementById('todaySuccess').textContent = today.successful;
        document.getElementById('totalCoins').textContent = analytics.total?.coins || 0;
        document.getElementById('streak').textContent = analytics.total?.streak || 0;
        
        const weeklyAvg = analytics.weekly?.length > 0 ? 
          Math.round(analytics.weekly.reduce((sum, day) => sum + (day.successRate || 0), 0) / analytics.weekly.length) : 0;
        document.getElementById('weeklyAverage').textContent = weeklyAvg + '%';
        const successRate = today.total > 0 ? Math.round((today.successful / today.total) * 100) : 0;
        const progressFill = document.getElementById('successProgress');
        progressFill.style.setProperty('--progress-width', successRate + '%');
        progressFill.style.width = successRate + '%';
        document.getElementById('successPercentage').textContent = successRate + '%';
      }
    });
  }

  function runTest() {
    testRunBtn.disabled = true;
    testRunBtn.textContent = 'Running...';
    
    chrome.runtime.sendMessage({ action: 'testRun' }, (response) => {
      if (response && response.success) {
        alert('Test started! Check the logs for updates.');
      } else {
        alert('Unable to start test: ' + (response?.message || 'Unknown error'));
      }
      
      setTimeout(() => {
        testRunBtn.disabled = false;
        testRunBtn.textContent = '🚀 Run Test Now';
        loadStatus();
        loadAnalytics();
      }, 2000);
    });
  }

  function toggleLogging() {
    chrome.runtime.sendMessage({ action: 'toggleLogging' }, (response) => {
      if (response) {
        loggingStatusElement.textContent = response.isLoggingEnabled ? 'Enabled' : 'Disabled';
        loggingButtonText.textContent = response.isLoggingEnabled ? 'Disable Log' : 'Enable Log';
      }
    });
  }

  function loadLinks() {
    chrome.runtime.sendMessage({ action: 'getLinks' }, (response) => {
      if (response && response.links) {
        displayLinks(response.links);
      }
    });
  }

  function displayLinks(links) {
    const linksList = document.getElementById('linksList');
    const linksCount = document.getElementById('linksCount');
    
    linksList.innerHTML = '';
    linksCount.textContent = links.length;
    
    links.forEach((link, index) => {
      const linkItem = document.createElement('div');
      linkItem.className = 'link-item';
      
      const linkUrl = document.createElement('div');
      linkUrl.className = 'link-url';
      linkUrl.textContent = link.length > 50 ? link.substring(0, 50) + '...' : link;
      linkUrl.title = link;
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.textContent = 'Delete';
      deleteBtn.onclick = () => deleteLink(index);
      
      linkItem.appendChild(linkUrl);
      linkItem.appendChild(deleteBtn);
      linksList.appendChild(linkItem);
    });
  }

  function addNewLink() {
    const newLinkInput = document.getElementById('newLinkInput');
    const newLink = newLinkInput.value.trim();
    
    if (!newLink) {
      alert('Please enter a link');
      return;
    }
    
    if (!newLink.includes('aliexpress.com')) {
      alert('Please enter a valid AliExpress link');
      return;
    }
    
    chrome.runtime.sendMessage({ 
      action: 'addLink', 
      link: newLink 
    }, (response) => {
      if (response && response.success) {
        newLinkInput.value = '';
        loadLinks();
        alert('Link added successfully!');
      } else {
        alert('Error adding link: ' + (response?.message || 'Unknown error'));
      }
    });
  }

  function deleteLink(index) {
    if (confirm('Are you sure you want to delete this link?')) {
      chrome.runtime.sendMessage({ 
        action: 'deleteLink', 
        index: index 
      }, (response) => {
        if (response && response.success) {
          loadLinks();
          alert('Link deleted successfully!');
        } else {
          alert('Error deleting link');
        }
      });
    }
  }

  function exportLinks() {
    chrome.runtime.sendMessage({ action: 'getLinks' }, (response) => {
      if (response && response.links) {
        const timestamp = new Date().toLocaleString('en-US');
        let linksText = `AliExpress Coins Collector - Link Export\n`;
        linksText += `Created by: Mordechai Neeman\n`;
        linksText += `Date: ${timestamp}\n`;
        linksText += `${'='.repeat(60)}\n\n`;
        
        response.links.forEach((link, index) => {
          linksText += `┌─ Link number ${index + 1} ─┐\n`;
          linksText += `│ ${link}\n`;
          linksText += `└${'─'.repeat(50)}┘\n\n`;
        });
        
        linksText += `${'='.repeat(60)}\n`;
        linksText += `Total links: ${response.links.length}\n`;
        linksText += `Thank you for using the extension! 🙏`;
        
        const blob = new Blob([linksText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'aliexpress_links.txt';
        a.click();
        
        URL.revokeObjectURL(url);
        alert('Links exported successfully!');
      }
    });
  }

  function importLinks() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target.result;
          const links = content.split('\n')
            .map(link => link.trim())
            .filter(link => link && link.includes('aliexpress.com'));
          
          if (links.length > 0) {
            chrome.runtime.sendMessage({ 
              action: 'importLinks', 
              links: links 
            }, (response) => {
              if (response && response.success) {
                loadLinks();
                alert(`${links.length} links imported successfully!`);
              } else {
                alert('Error importing links');
              }
            });
          } else {
            alert('No valid AliExpress links found in the file');
          }
        };
        reader.readAsText(file);
      }
    };
    
    input.click();
  }

  function loadLogs() {
    chrome.runtime.sendMessage({ action: 'getLogs' }, (response) => {
      if (response && response.logs) {
        const logsList = document.getElementById('logsList');
        logsList.innerHTML = '';
        response.logs.slice(-20).forEach(log => {
          const logEntry = document.createElement('div');
          logEntry.className = 'log-entry';
          logEntry.textContent = log;
          logsList.appendChild(logEntry);
        });
        logsList.scrollTop = logsList.scrollHeight;
      }
    });
  
    // Auto-refresh every 5 seconds when the window is open
    if (document.getElementById('logsContainer').classList.contains('show')) {
      setTimeout(loadLogs, 5000);
    }
  }

  function resetAnalytics() {
    if (confirm('Are you sure you want to reset all statistics?')) {
      chrome.runtime.sendMessage({ action: 'resetAnalytics' }, (response) => {
        if (response && response.success) {
          alert('Statistics reset successfully!');
          loadAnalytics();
        }
      });
    }
  }
  
  // Auto-refresh every 10 seconds
  setInterval(() => {
    loadStatus();
    loadAnalytics();
  }, 10000);
});
