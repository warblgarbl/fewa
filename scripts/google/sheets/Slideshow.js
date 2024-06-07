const storage = chrome.storage.sync;

$(document).ready(() => {
  storage.get().then(result => console.log(result));
  chrome.runtime.sendMessage({
    to: "background",
    type: "deleteKey",
    target: "tabID",
    keyPath: ["page_settings", "sheets", "active"]
  }, () => storage.get().then(result => console.log(result)));
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case "getSheets":
      chrome.runtime.sendMessage({
        to: "popup",
        target: ".spreadsheet",
        type: "init",
        name: $('meta[property="og:title"]').attr("content"),
        max: $('.docs-sheet-tab:visible').length + 1
      });
      // Current view
      var hash = window.location.hash;
      // Unique sheet IDs (gid)
      var ptrn = /(?<="\[\d+,\d,\\")\d+/g;
      var $src = $('script').filter((i, e) => ptrn.test(e.innerHTML));
      var names = [];
      var gids = $src.length ? $src.html().match(ptrn) : [];
      gids.sort((a, b) => {
        if (a.length > b.length) return 1
        else if (a.length < b.length) return -1
        else return a.localeCompare(b);
      });

      // Check for multiple sheets
      if (gids.length < 2)
        return chrome.runtime.sendMessage({
          to: "popup",
          target: ".spreadsheet",
          type: "1 sheet"
        });

      // Find first visible sheet
      window.location.hash = "gid=" + gids[0];
      var start = $('.docs-sheet-active-tab .docs-sheet-tab-name').html();
      var id = 0;
      while (id < gids.length && start == $('.docs-sheet-active-tab .docs-sheet-tab-name').html())
        window.location.hash = "gid=" + gids[++id];
      start = $('.docs-sheet-active-tab .docs-sheet-tab-name').html();
      while (id >= 0 && start == $('.docs-sheet-active-tab .docs-sheet-tab-name').html())
        window.location.hash = "gid=" + gids[--id];
      if (id < 0 && start == $('.docs-sheet-active-tab .docs-sheet-tab-name').html())
        while (id < gids.length && start == $('.docs-sheet-active-tab .docs-sheet-tab-name').html())
          window.location.hash = "gid=" + gids[++id];
      if (id == gids.length)
        return chrome.runtime.sendMessage({
          to: "popup",
          target: ".spreadsheet",
          type: "error"
        });
      start = $('.docs-sheet-active-tab .docs-sheet-tab-name').html();
      chrome.runtime.sendMessage({
        to: "popup",
        target: ".spreadsheet",
        type: "sheet",
        value: {
          gid: gids[id],
          name: start
        }
      });
      names.push(start);
      // Find remaining visible sheets
      for (id = 0; id < gids.length; id++) {
        window.location.hash = "gid=" + gids[id];
        let gid = gids[id];
        let name = $('.docs-sheet-active-tab .docs-sheet-tab-name').html();
        if (names[names.length - 1] != name) {
          names.push(name);
          chrome.runtime.sendMessage({
            to: "popup",
            target: ".spreadsheet",
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
      var sheets = $('.docs-sheet-tab:visible .docs-sheet-tab-name');
      for (let i = 0; i < sheets.length; i++) {
        let name = sheets.eq(i).html();
        let index = names.indexOf(name);
        sort.push(index);
      }
      // Reset view
      window.location.hash = hash;
      chrome.runtime.sendMessage({
        to: "popup",
        target: ".spreadsheet",
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
        var page = result.page_settings.sheets;
        clearTimeout(page.active[request.tabID]);
      });
  }
});

function nextSlide(i, set) {
  storage.get().then(result => {
    var page = result.page_settings.sheets;
    page.active[set.tabID] = setTimeout(() => {
      if (i === set.data.length) { i = 0 }
      window.location.hash = "gid=" + set.data[i].gid;
      return nextSlide(i, set);
    }, 1000 * parseInt(set.data[i++].time));
    storage.set(result);
  });
}