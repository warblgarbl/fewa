chrome.runtime.onInstalled
  .addListener((details) => {
    if (details.reason == 'update') {
      let prev = details.previousVersion.split(/\./).map(i => parseInt(i));
      if (prev[0] < 1) {
        if (prev[1] < 5) {
          console.info('Updating storage to format introduced in ver. 0.5.0.0');
          chrome.storage.sync.clear();
        }
      }
    }

    chrome.storage.sync.get().then(results => {
      let obj = {};
      let doms = ['aqua', 'cic', 'pci', 'sheets'];
      let set = ['page_settings', 'preferences'];
      if (!('fewa' in results)) {
        obj['fewa'] = {}
      } else {
        obj['fewa'] = results['fewa'];
      }
      for (let a = 0; a < doms.length; a++) {
        if (!(doms[a] in obj['fewa'])) {
          obj['fewa'][doms[a]] = {}
        } else {
          obj['fewa'][doms[a]] = results['fewa'][doms[a]];
        }
        for (let b = 0; b < set.length; b++) {
          if (!(set[b] in obj['fewa'][doms[a]])) {
            obj['fewa'][doms[a]][set[b]] = {}
          } else {
            obj['fewa'][doms[a]][set[b]] = results['fewa'][doms[a]][set[b]];
          }
        }
      }
      chrome.storage.sync.set(obj);
    });
  });

chrome.tabs.onActivated.addListener(activeToggle);
chrome.tabs.onUpdated.addListener(activeToggle);
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.to !== 'background') return;
  switch (request.type) {}
});

function toggle(tabs) {
  if (tabs.length) {
    if (/.*docs\.google\.com\/spreadsheets\/d\/.*/.test(tabs[0].url)) {
      chrome.action.enable();
    } else {
      chrome.action.disable();
    }
  }
}

function activeToggle() {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, toggle);
}
