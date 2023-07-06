const storage = chrome.storage.sync;
const _default = {
  fewa: {
    cic: {
      page_settings: {},
      preferences: {
        address: '#CurrentAddress_faUSA_rbnUnparsed',
        alert: true,
        auto_open: true,
        bureau: {
          ef: false,
          tu: "#UIOptions_tuc_credit",
          xp: false
        },
        skip: true
      }
    },
    aqua: {
      page_settings: {
        dealer: ""
      },
      preferences: {}
    },
    pci: {
      page_settings: {},
      preferences: {}
    },
    sheets: {
      page_settings: {},
      preferences: {}
    }
  }
}
chrome.runtime.onInstalled.addListener(details => {
  if (details.reason == 'update') {
    storage.get().then(result => storage.set(keyCheck(result, _default, result)));
  }
  if (details.reason == "install") {
    chrome.tabs.create({ url: chrome.runtime.getURL('options.html') });
  }
});
chrome.tabs.onActivated.addListener(activeToggle);
chrome.tabs.onUpdated.addListener(activeToggle);
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.to !== "background") return;
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

function keyCheck(obj, _default, result) {
  for (let key in _default) {
    if (!(key in obj)) {
      obj[key] = _default[key];
    } else if (typeof _default[key] == "object" && Object.keys(_default[key]).length) {
      keyCheck(obj[key], _default[key], result);
    }
  }
  return result;
}