const storage = chrome.storage.sync;

waitForElm('h1.heading--1').then(elm => {
  var $this = $(elm);
  var $html = $this.html();
  storage.get().then(result => $this.html($html + " - " + result.page_settings.aqua.dealer));
});

function waitForElm(selector) {
  return new Promise(resolve => {
    if (document.querySelector(selector))
      return resolve(document.querySelector(selector));
    const observer = new MutationObserver(mutations => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  });
}

$(document).on({
  click: function () {
    setTimeout(() => {
      var $emp = $('select[name="EmploymentType"]').trigger('change')
    }, 0);
  }
}, '.formSubsection__editButton').on({
  keydown: function (e) {
    var $this = $(this);
    if (e.keyCode == 9) {
      var cal = $('.react-datepicker__tab-loop:visible').hide();
      var val = $this.val().toString().trim();
      if (val.length === 8 && /^\d{8}$/.test(val))
        $this.val(val.substr(0, 2) + "/" + val.substr(2, 2) + "/" + val.substr(4));
    }
  }
}, 'input.react-datepicker-ignore-onclickoutside').on({
  click: function (e) {
    var $this = $(this);
    if (/Financing/i.test($this.html()))
      waitForElm('select[name="ContractState"]').then(elm => $(elm).focus());
  }
}, '.button--primary');