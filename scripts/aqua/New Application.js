const storage = chrome.storage.sync;

waitForElm('h1.heading--1').then(elm => {
  var $this = $(elm);
  var $html = $this.html();
  storage.get().then(result => {
    $this.html($html + " - " + result.page_settings.aqua.dealer);
  });
});

function waitForElm(selector) {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

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
      var $emp = $('select[name="EmploymentType"]').trigger('change');
    }, 0);
  }
}, '.formSubsection__editButton').on({
  keydown: function (e) {
    var $this = $(this);
    if (e.keyCode == 9) {
      var cal = $('.react-datepicker__tab-loop:visible').hide();
      var val = $this.val().toString().trim();
      if (val.length === 8 && /^\d{8}$/.test(val)) {
        $this.val(val.substr(0, 2) + "/" + val.substr(2, 2) + "/" + val.substr(4));
      }
    }
  }
}, 'input.react-datepicker-ignore-onclickoutside').on({
  change: function () {
    storage.get().then(result => {
      var pref = result.preferences.aqua;
      if (pref.time) {
        var $val = $(this).val();
        var $fewaTime = $('#fewaTime');
        var $fewaEst = $('#fewaTimeEst');

        if (!/(?<!un)employed/i.test($val))
          return ($fewaTime.hide(), $fewaEst.hide())
        else if ($fewaTime.length) {
          return setTimeout(() => {
            let $emp = $('div.formField--employmentStartDate:visible');
            if ($emp.length)
              $emp.parent().before($fewaTime.show()).before($fewaEst.show());
          }, 0);
        }

        var $fewa_div = $('<div>').attr({ class: "fewa--div" });
        var $fewa_label = $('<label>').attr({ class: "fewa--label" });
        var $fewa_num = $('<input>').attr({ class: "fewa--num", type: "number", min: "0" });

        var year = $fewa_div.clone().append($fewa_label.clone().attr({ 'for': "fewaYear" }).html("Years"), $fewa_num.clone().attr({ id: "fewaYear", max: "80" }));
        var month = $fewa_div.clone().append($fewa_label.clone().attr({ 'for': "fewaMonth" }).html("Months"), $fewa_num.clone().attr({ id: "fewaMonth", max: "11" }));
        var week = $fewa_div.clone().append($fewa_label.clone().attr({ 'for': "fewaWeek" }).html("Weeks"), $fewa_num.clone().attr({ id: "fewaWeek", max: "3" }));

        var start = new Date();
        start = (
          start.getMonth() < 9 ?
          "0" :
          "") + (start.getMonth() + 1) + " " + start.getFullYear();
        $fewaTime = $('<div>').attr({ id: "fewaTime" }).append(year, month, week);
        $fewaEst = $('<div>').attr({ id: "fewaTimeEst", class: "optionBlock" }).append($('<span>').attr({ class: "sumTotal__label" }).html("Suggested Date: "), $('<span>').attr({ class: "sumTotal__value fewaValue" }).html(start));

        setTimeout(() => {
          let $emp = $('div.formField--employmentStartDate:visible');
          if ($emp.length)
            $emp.parent().before($fewaTime).before($fewaEst);
        }, 0);
      }
    })
  }
}, 'select[name="EmploymentType"]').on({
  'keydown keyup': fewaUpdate
}, '#fewaWeek').on({
  'keydown keyup': fewaUpdate
}, '#fewaMonth').on({
  'keydown keyup': fewaUpdate
}, '#fewaYear');

function fewaUpdate(e) {
  var $this = $(this);
  var validKeys = [
    8, 9, 13, 27, ...a(37, 4),
    46,
    ...a(48, 10),
    86,
    88,
    ...a(96, 10)
  ];

  if (validKeys.indexOf(e.keyCode) < 0)
    return reset();
  if (e.ctrlKey) {
    if (e.keyCode == 86 || e.keyCode == 88) {
      if ($this.val().length == undefined)
        return reset();
      $this.val($this.val().toString().replace(/\D/g, ""));
    }
  }
  if (e.shiftKey) {
    if (a(48, 10).indexOf(e.keyCode) >= 0)
      return reset();
  }

  function a(start, num) {
    let b = [];
    for (let c = 0; c < num; start++, c++) {
      b.push(start);
    }
    return b;
  }

  function reset() {
    $this.val($this.data('fewa-val'));
  }

  var week = {
    $: $('#fewaWeek'),
    val: $('#fewaWeek').val(),
    min: parseInt($('#fewaWeek').attr('min')),
    max: parseInt($('#fewaWeek').attr('max'))
  }
  var month = {
    $: $('#fewaMonth'),
    val: $('#fewaMonth').val(),
    min: parseInt($('#fewaMonth').attr('min')),
    max: parseInt($('#fewaMonth').attr('max'))
  }
  var year = {
    $: $('#fewaYear'),
    val: $('#fewaYear').val(),
    min: parseInt($('#fewaYear').attr('min')),
    max: parseInt($('#fewaYear').attr('max'))
  }
  var time = [week, month, year];

  for (let a = 0; a < time.length; a++) {
    switch (time[a].val.length) {
      default:
        time[a].$.val(parseInt(time[a].val.substring(0, 2)));
      case 2:
      case 1: {
        time[a].val = parseInt(time[a].$.val());
        if (time[a].val > time[a].max)
          time[a].$.val(time[a].max)
        else if (time[a].val < time[a].min)
          time[a].$.val(time[a].min);
      }
      break;
      case 0:
    }
    time[a].val = typeof time[a].val == "string" ?
      0 :
      parseInt(time[a].$.val());
  }
  $this.data({ 'fewa-val': $this.val() });

  var today = new Date();
  if (week.val == 0)
    today.setDate(1);
  if (month.val >= 0 && year.val >= 0 || year.val > 0) {
    today.setFullYear(today.getFullYear() - year.val);
    today.setMonth(today.getMonth() - month.val);
    today.setDate(today.getDate() - week.val * 7);
    month.val = today.getMonth() + 1;
    if (month.val < 9)
      month.val = '0' + month.val;
    $('#fewaTimeEst .fewaValue').html(month.val + " " + today.getFullYear());
  }
}