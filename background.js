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
          tu: '#UIOptions_tuc_credit',
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
      page_settings: {
        active: {}
      },
      preferences: {}
    }
  }
}
chrome.runtime.onInstalled.addListener(details => {
  if (details.reason == "update") {
    storage.get().then(result => storage.set(keyCheck(result, _default, result)));
  }
  if (details.reason == "install") {
    chrome.tabs.create({ url: chrome.runtime.getURL("options.html") });
  }
});
chrome.tabs.onActivated.addListener(activeToggle);
chrome.tabs.onUpdated.addListener(activeToggle);
chrome.tabs.onRemoved.addListener((tabID, info) => {
  storage.get().then(result => {
    for (let dom in result.fewa) {
      let page = result.fewa[dom].page_settings;
      for (let id in page.active) {
        if (id == tabID) delete page.active[id];
      }
    }
    storage.set(result);
  });
});

chrome.runtime.onMessage
  .addListener((request, sender, sendResponse) => {
    if (request.to !== "background") return;
    console.log('message')
    switch (request.type) {
      case "deleteKey":
        console.log('del')
        switch (request.target) {
          case "tabID":
            chrome.tabs.query({
              active: true,
              currentWindow: true
            }, (tabs) => {
              storage.get().then(result => {
                let key = result;
                for (let i = 0; i < request.keyPath.length; i++) {
                  key = key[request.keyPath[i]];
                }
                if (tabs[0].id in key) delete key[tabs[0].id];
              });
            });
        }
        break;
      case "defaultStorage":
        storage.set(_default);
        sendResponse();
    }
  });

function activeToggle() {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, toggle);
}

function toggle(tabs) {
  if (tabs.length) {
    if (/^http.+?spreadsheets\/d\/.+?\//.test(tabs[0].url)) {
      chrome.action.enable();
    } else chrome.action.disable();
  }
}

function keyCheck(obj, _default, result) {
  for (let key in _default) {
    if (!(key in obj)) obj[key] = _default[key]
    else if (typeof _default[key] == "object" && Object.keys(_default[key]).length) {
      if (key == "preferences") {
        for (let subKey in obj[key]) {
          if (!(subKey in _default[key])) {
            delete obj[key][subKey];
            console.log("Deleted: " + subKey);
          }
        }
      }
      keyCheck(obj[key], _default[key], result);
    }
  }
  return result;
}