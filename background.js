function toggle(tabs) {
  // Note: this requires "activeTab" permission to access the URL
  if (tabs.length) {
    if (/.*docs\.google\.com\/spreadsheets\/d\/.*/.test(tabs[0].url)) {
      chrome.action.enable();
    } else {
      chrome.action.disable();
    }
  }
}

chrome.tabs.onActivated
  .addListener(() => {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, toggle);
  });

chrome.tabs.onUpdated
  .addListener(() => {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, toggle);
  });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case 'slideshowReset': {
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, (tabs) => {
        let obj = {};
        obj['slideshow_' + tabs[0].id] = false;
        chrome.storage.sync.set(obj);
      });
    }
  }
});
