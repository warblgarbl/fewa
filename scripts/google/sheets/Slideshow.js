const storage = chrome.storage.sync;

$(document).ready(() => {
  chrome.runtime.sendMessage({
    to: "background",
    type: "deleteKey",
    target: "tabID",
    keyPath: ["fewa", "sheets", "page_settings", "active"]
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case "getSheets":
      chrome.runtime.sendMessage({
        to: "popup",
        target: "#slideshow",
        type: "max",
        value: $('.docs-sheet-tab:visible').length + 1
      });
      // Current view
      var hash = window.location.hash;
      // Unique sheet IDs (gid)
      var ptrn = /(?<=\[null,\[\\")\d+/g;
      var $src = $('script').filter((i, e) => ptrn.test(e.innerHTML));
      var names = [];
      var gids = $src.html().match(ptrn).filter((e, i, a) => {
        return a.indexOf(e) === i;
      }).sort((a, b) => {
        if (a.length > b.length) return 1
        else if (a.length < b.length) return -1
        else return a.localeCompare(b);
      });

      // Check for multiple sheets
      if (gids.length < 2) return chrome.runtime.sendMessage({
        to: "popup",
        target: "#slideshow",
        type: "1 sheet"
      });

      // Find first visible sheet
      window.location.hash = "gid=" + gids[0];
      var start = $('.docs-sheet-active-tab .docs-sheet-tab-name').html();
      for (let i = 1; i < gids.length; i++) {
        window.location.hash = "gid=" + gids[i];
        if (start != $('.docs-sheet-active-tab .docs-sheet-tab-name').html()) {
          window.location.hash = "gid=" + gids[--i];
          if (start != $('.docs-sheet-active-tab .docs-sheet-tab-name').html()) {
            window.location.hash = "gid=" + gids[++i];
            start = $('.docs-sheet-active-tab .docs-sheet-tab-name').html();
          }
          chrome.runtime.sendMessage({
            to: "popup",
            target: "#slideshow",
            type: "sheet",
            value: {
              name: start,
              gid: gids[i]
            }
          });
          names.push(start);
          start = i;
          break;
        }
      }
      // Find remaining visible sheets
      for (let i = start + 1; i < gids.length; i++) {
        window.location.hash = "gid=" + gids[i];
        let gid = gids[i];
        let name = $('.docs-sheet-active-tab .docs-sheet-tab-name').html();
        if (names[names.length - 1] != name) {
          names.push(name);
          chrome.runtime.sendMessage({
            to: "popup",
            target: "#slideshow",
            type: "sheet",
            value: {
              gid,
              name
            }
          });
        }
      }
      // Get sheet order
      var sort = [];
      var sheets = $('.docs-sheet-tab:visible').find('.docs-sheet-tab-name');
      for (let i = 0; i < sheets.length; i++) {
        let name = sheets.eq(i).html();
        let index = names.indexOf(name);
        sort.push(index);
      }
      // Reset view
      window.location.hash = hash;
      chrome.runtime.sendMessage({
        to: "popup",
        target: "#slideshow",
        type: "sort",
        value: sort
      });
      break;
    case "slideshowStart":
      window.location.hash = "gid=" + request.data[0].gid;
      nextSlide(0, request);
      break;
    case "slideshowStop":
      storage.get().then(result => {
        var page = result.fewa.sheets.page_settings;
        clearTimeout(page.active[request.tabID]);
      });
  }
});

function nextSlide(i, set) {
  storage.get().then(result => {
    let page = result.fewa.sheets.page_settings;
    page.active[set.tabID] = setTimeout(() => {
      if (i === set.data.length) { i = 0 }
      window.location.hash = "gid=" + set.data[i].gid;
      return nextSlide(i, set);
    }, 1000 * parseInt(set.data[i++].time));
    storage.set(result);
  });
}