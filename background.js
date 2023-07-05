chrome.runtime.onInstalled
  .addListener((details) => {
    const storage = chrome.storage.sync;
    if (details.reason == 'update') {
      let prev = details.previousVersion.split(/\./).map(i => parseInt(i));
      if (prev[0] < 1) {
        if (prev[1] < 5) {
          console.info('Updating storage to format introduced in ver. 0.5.0.0');
          storage.clear();
        }
      }
    }

    storage.get().then(results => {
      let obj = {};
      let doms = ['cic', 'aqua', 'pci', 'sheets'];
      let set = ['page_settings', 'preferences'];
      if (!('fewa' in results)) {
        obj.fewa = {}
      } else {
        obj.fewa = results.fewa;
      }
      for (let a = 0; a < doms.length; a++) {
        if (!(doms[a] in obj.fewa)) {
          obj.fewa[doms[a]] = {}
        } else {
          obj.fewa[doms[a]] = results.fewa[doms[a]];
        }
        for (let b = 0; b < set.length; b++) {
          if (!(set[b] in obj.fewa[doms[a]])) {
            obj.fewa[doms[a]][set[b]] = {}
          } else {
            obj.fewa[doms[a]][set[b]] = results.fewa[doms[a]][set[b]];
          }
        }
      }
      for (let key in obj.fewa) {
        switch (key) {
          case 'cic':
            let pref = ['address', 'alert', 'auto_open'];
            for (let i = 0; i < pref.length; i++) {
              if (!(pref[i] in obj.fewa.cic.preferences)) {
                obj.fewa.cic.preferences[pref[i]] = null;
              }
            }
            break;
          case 'aqua':
            break;
          case 'pci':
            break;
          case 'sheets':
            break;
        }
      }
      storage.set(obj);
    });

    if (details.reason == "install") {
      chrome.tabs.create({
        url: chrome.runtime.getURL('options.html')
      });
    } else if (details.reason == 'update') {
      let prev = details.previousVersion.split(/\./).map(i => parseInt(i));
      if (prev[0] < 1) {
        if (prev[1] < 5) {
          chrome.tabs.create({
            url: chrome.runtime.getURL('options.html')
          }, saveDefault);
        } else if (prev[1] < 6) {
          if (prev[2] < 4) {
            chrome.tabs.create({
              url: chrome.runtime.getURL('options.html')
            }, saveDefault);
          }
        }
      }
    }
  });

chrome.tabs.onActivated.addListener(activeToggle);
chrome.tabs.onUpdated.addListener(activeToggle);
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.to !== 'background') return;
  switch (request.type) {}
});

function activeToggle() {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, toggle);
}

function toggle(tabs) {
  if (tabs.length) {
    if (/.*docs\.google\.com\/spreadsheets\/d\/.*/.test(tabs[0].url)) {
      chrome.action.enable();
    } else {
      chrome.action.disable();
    }
  }
}

function saveDefault(tab) {
  chrome.tabs.onUpdated.addListener((tabId, info) => {
    if (tabId == tab.id && info.status == "complete") {
      chrome.runtime.sendMessage({
        to: "options",
        type: "default-save"
      });
    }
  });
}
