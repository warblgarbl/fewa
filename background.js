const storage = chrome.storage.sync;
const _default = {
  page_settings: {
    aqua: {
      dealer: undefined
    },
    sheets: {
      active: {}
    }
  },
  preferences: {
    cic: {
      address: '#CurrentAddress_faUSA_rbnUnparsed',
      alert: true,
      auto_open: true,
      auto_open_delay: 3,
      bureau: {
        ef: false,
        tu: '#UIOptions_tuc_credit',
        xp: false
      },
      markup: true,
      skip: true
    },
    aqua: {
      time: true
    },
    pci: {
      decCode: true,
      report: true,
      time: true
    }
  }
}

chrome.runtime.onInstalled.addListener(details => {
  switch (details.reason) {
    case "install":
      storage.get().then(result => {
        if (!Object.keys(result).length)
          storage.set(_default).then(() => {
            chrome.tabs.create({ url: chrome.runtime.getURL("options.html") });
          });
      });
      break;
    case "update":
      storage.get().then(result => {
        var update = structuredClone(_default);
        if (!('page_settings' in result))
          result.page_settings = update.page_settings;
        if (!('preferences' in result))
          result.preferences = update.preferences;
        storage.set(result);
      });
      break;
  }
});

chrome.tabs.onActivated.addListener(activeToggle);
chrome.tabs.onUpdated.addListener(activeToggle);
chrome.tabs.onRemoved.addListener((tabID, info) => {
  storage.get().then(result => {
    for (let dom in result.page_settings) {
      let page = result.page_settings[dom];
      for (let id in page.active)
        if (id == tabID)
          delete page.active[id];
    }
    storage.set(result);
  });
});

chrome.runtime.onMessage
  .addListener((request, sender, sendResponse) => {
    if (request.to !== "background") return;
    switch (request.type) {
      case "deleteKey":
        switch (request.target) {
          case "tabID":
            chrome.tabs.query({
              active: true,
              currentWindow: true
            }, (tabs) => {
              storage.get().then(result => {
                let key = result;
                for (let i = 0; i < request.keyPath.length; i++)
                  key = key[request.keyPath[i]];
                if (tabs[0].id in key)
                  delete key[tabs[0].id];
                storage.set(result);
              });
            });
        }
        break;
      case "defaultStorage":
        storage.get().then(result => {
          result.preferences = _default.preferences;
          storage.set(result);
        })
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
    if (/^http.+?spreadsheets\/d\/.+?\//.test(tabs[0].url))
      chrome.action.enable();
    else
      chrome.action.disable();
  }
}