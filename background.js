const storage = chrome.storage.sync;
const _default = {
  fewa: {
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
}

chrome.runtime.onInstalled.addListener(details => {
  if (details.reason == "update") {
    var prev = details.previousVersion.split(/\./);
    if (prev[0] < 1) {
      if (prev[1] < 5 || prev[1] == 5 && prev[2] < 6) {
        storage.get().then(result => {
          var oldResult = result.fewa;
          var newResult = {
            fewa: {
              page_settings: {},
              preferences: {}
            }
          }

          for (let dom in oldResult) {
            for (let cat in oldResult[dom]) {
              for (let key in oldResult[dom][cat]) {
                if (/page_settings/.test(cat) || key in _default.fewa[cat][dom]) {
                  newResult[cat][dom][key] = oldResult[cat][dom][key];
                }
              }
            }
          }
          storage.set({ fewa: newResult });
        });
      }
    } else storage.get().then(result => {
      storage.set(keyCheck(result, _default, result));
    });
  }
  if (details.reason == "install") {
    storage.get().then(result => {
      storage.set(keyCheck(result, _default, result)).then(() => {
        chrome.tabs.create({ url: chrome.runtime.getURL("options.html") });
      });
    });
  }
});
chrome.tabs.onActivated.addListener(activeToggle);
chrome.tabs.onUpdated.addListener(activeToggle);
chrome.tabs.onRemoved.addListener((tabID, info) => {
  storage.get().then(result => {
    for (let dom in result.fewa.page_settings) {
      let page = result.fewa.page_settings[dom];
      for (let id in page.active) {
        if (id == tabID)
          delete page.active[id];
      }
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
                for (let i = 0; i < request.keyPath.length; i++) {
                  key = key[request.keyPath[i]];
                }
                if (tabs[0].id in key) {
                  delete key[tabs[0].id];
                }
                storage.set(result);
              });
            });
        }
        break;
      case "defaultStorage":
        storage.get().then(result => {
          result.fewa.preferences = _default.fewa.preferences;
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
    if (/^http.+?spreadsheets\/d\/.+?\//.test(tabs[0].url)) {
      chrome.action.enable();
    } else chrome.action.disable();
  }
}

function keyCheck(obj = {}, _default, result) {
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