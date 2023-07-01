$(document).ready(() => {
  chrome.runtime.sendMessage(null, {
    type: 'slideshowReset'
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case 'getSheets': {
      var ptrn = /(?<="\[\[\\")\d+/g;
      var $src = $('script').filter((i, e) => ptrn.test(e.innerHTML));
      var ids = $src.html().match(ptrn).filter((e, i, a) => {
        return a.indexOf(e) === i;
      });
      var names = [];
      for (let i = 0; i < ids.length; i++) {
        window.location.hash = 'gid=' + ids[i];
        names.push($('.docs-sheet-active-tab .docs-sheet-tab-name').html());
      };
      sendResponse({
        names,
        ids
      });
    }
    break;
    case 'slideshowStart': nextSlide(0, request); break;
    case 'slideshowStop': {
      chrome.storage.sync.get(['currentSlide_' + request.tabId])
        .then(result => {
          clearTimeout(result['currentSlide_' + request.tabId]);
        })
    }
  }
});

function nextSlide(next, set) {
  let obj = {};
  obj['currentSlide_' + set.tabId] = setTimeout(() => {
    if (next === set.data.length) {
      next = 0;
    }
    window.location.hash = 'gid=' + set.data[next].id;
    return nextSlide(next, set);
  }, 1000 * parseInt(set.data[next++].time));
  chrome.storage.sync.set(obj);
}
