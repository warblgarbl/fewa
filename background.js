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
        if ('fewa' in result) {
          if ('page_settings' in result && 'preferences' in result) {
            storage.remove('fewa');
          } else {
            var fewa = result.fewa;
            var deepPage = true;
            var deepPref = true;
            if ('page_settings' in fewa) {
              deepPage = false;
              var page = fewa.page_settings;
              if ('sheets' in page) {
                var sheets = page.sheets;
                for (let sheet in sheets) {
                  if (!/active/i.test(sheet))
                    update.page_settings.sheets[sheet] = sheets[sheet];
                }
              }
            }
            if ('preferences' in fewa) {
              deepPref = false;
              var pref = fewa.preferences;
              if ('cic' in pref) {
                var cic = pref.cic;
                for (let key in cic) {
                  if (/bureau/i.test(key)) {
                    if (Object.keys(cic[key]).length) {
                      for (let key2 in cic[key]) {
                        let type = typeof cic[key][key2];
                        if (type === "string" || type === "boolean")
                          update.preferences.cic[key][key2] = cic[key][key2];
                      }
                    }
                  } else if (typeof cic[key] === typeof update.preferences.cic[key]) {
                    update.preferences.cic[key] = cic[key];
                  }
                }
              }
              if ('aqua' in pref) {
                var aqua = pref.aqua;
                for (let key in aqua) {
                  if (typeof aqua[key] === typeof update.preferences.aqua[key])
                    update.preferences.aqua[key] = aqua[key];
                }
              }
              if ('pci' in pref) {
                var pci = pref.pci;
                for (let key in pci) {
                  if (typeof pci[key] === typeof update.preferences.pci[key])
                    update.preferences.pci[key] = pci[key];
                }
              }
            }
            if (deepPage || deepPref) {
              if ('cic' in fewa) {
                var cic = fewa.cic;
                if (deepPref && 'preferences' in cic) {
                  var pref = cic.preferences;
                  for (let key in pref) {
                    if (/bureau/i.test(key)) {
                      if (Object.keys(cic[key]).length) {
                        for (let key2 in cic[key]) {
                          let type = typeof cic[key][key2];
                          if (type === "string" || type === "boolean")
                            update.preferences.cic[key][key2] = cic[key][key2];
                        }
                      }
                    } else if (typeof cic[key] === typeof update.preferences.cic[key]) {
                      update.preferences.cic[key] = cic[key];
                    }
                  }
                }
              }
              if ('aqua' in fewa) {
                var aqua = fewa.aqua;
                if (deepPref && 'preferences' in aqua) {
                  var pref = aqua.preferences;
                  for (let key in pref) {
                    if (typeof pref[key] === typeof update.preferences.aqua[key])
                      update.preferences.aqua[key] = pref[key];
                  }
                }
              }
              if ('pci' in fewa) {
                var pci = fewa.pci;
                if (deepPref && 'preferences' in pci) {
                  var pref = pci.preferences;
                  for (let key in pref) {
                    if (typeof pref[key] === typeof update.preferences.pci[key])
                      update.preferences.pci[key] = pref[key];
                  }
                }
              }
              if ('sheets' in fewa) {
                var sheets = fewa.sheets;
                if (deepPage && 'page_settings' in sheets) {
                  var page = sheets.page_settings;
                  for (let key in page) {
                    if (!/active/i.test(key))
                      update.page_settings.sheets[key] = page[key];
                  }
                }
              }
            }
            storage.set(update);
            storage.remove('fewa');
          }
        }
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
    if (/^http.+?spreadsheets\/d\/.+?\//.test(tabs[0].url)) {
      chrome.action.enable();
    } else chrome.action.disable();
  }
}