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
      var ptrn1 = /(?<=\[null,\[\\")\d+/g;
      var ptrn2 = /(?<="\[\[\\")\d+/g;
      var ptrn3 = /(?<=\:\\")\d+/g;
      var ptrn4 = /(?<="\[\d,\d,\\")\d+/g;
      var ptrn5 = /(?<=\[\\")\d+(?=\\",\d)/g;
      var $src1 = $('script').filter((i, e) => ptrn1.test(e.innerHTML));
      var $src2 = $('script').filter((i, e) => ptrn2.test(e.innerHTML));
      var $src3 = $('script').filter((i, e) => ptrn3.test(e.innerHTML));
      var $src4 = $('script').filter((i, e) => ptrn4.test(e.innerHTML));
      var $src5 = $('script').filter((i, e) => ptrn5.test(e.innerHTML));
      var names = [];
      var gid1 = $src1.html().match(ptrn1);
      var gid2 = $src2.html().match(ptrn2);
      var gid3 = $src3.html().match(ptrn3);
      var gid4 = $src4.html().match(ptrn4);
      var gid5 = $src5.html().match(ptrn5);
      var gids = [...gid1, ...gid2, ...gid3, ...gid4, ...gid5].filter((e, i, a) => {
        return a.indexOf(e) === i;
      }).sort((a, b) => {
        if (a.length > b.length) return 1
        else if (a.length < b.length) return -1
        else return a.localeCompare(b);
      });

      // Check for multiple sheets
      if (gids.length < 2) return chrome.runtime.sendMessage({
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
        while (start == $('.docs-sheet-active-tab .docs-sheet-tab-name').html())
          window.location.hash = "gid=" + gids[++id];
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