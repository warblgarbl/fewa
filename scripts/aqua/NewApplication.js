waitForElm('h1.heading--1').then(elm => {
  var $this = $(elm);
  var $html = $this.html();
  chrome.storage.sync.get(['dealer']).then(result => {
    $this.html($html + ' - ' + result.dealer);
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
    change: function() {
      var $val = $(this).val();
      var $fewaTime = $('#fewaTime');
      if (!/(?<!un)employed/i.test($val)) {
        return $fewaTime.hide();
      } else if ($fewaTime.length) {
        setTimeout(() => {
          let $emp = $('div.formField--employmentStartDate').filter(':visible');
          if ($emp.length) {
            $emp.parent().before($fewaTime.show());
          }
        }, 0);
      } else {
        $fewaTime = $('<div>').attr({
          id: "fewaTime",
          style: "background-color:oldlace"
        });
        $fewaTime.append(
          $('<div>').append(
            $('<label>').attr({
              class: "label",
              for: "fewaYear"
            }).html('Years:'),
            $('<input>').attr({
              type: "number",
              id: "fewaYear",
              min: "0",
              max: "80",
              style: "width:2rem;height:1rem;margin-left:0.3rem;margin-right:1rem;"
            }),
            $('<label>').attr({
              class: "label",
              for: "fewaMonth"
            }).html('Months:'),
            $('<input>').attr({
              type: "number",
              id: "fewaMonth",
              min: "0",
              max: "11",
              style: "width:2rem;height:1rem;margin-left:0.3rem;margin-right:1rem;"
            }),
            $('<label>').attr({
              class: "label",
              for: "fewaWeek"
            }).html('Weeks:'),
            $('<input>').attr({
              type: "number",
              id: "fewaWeek",
              min: "0",
              max: "3",
              style: "width:2rem;height:1rem;margin-left:0.3rem;margin-right:1rem;"
            }),
          ),
          $('<br>'),
          $('<div>').attr({
            class: "formField"
          }).append(
            $('<div>').attr({
              class: "label"
            }).html('Suggested start date:'),
            $('<div>').attr({
              id: "fewaTimeEst"
            })
          )
        );
        setTimeout(() => {
          let $emp = $('div.formField--employmentStartDate').filter(':visible');
          if ($emp.length) {
            $emp.parent().before($fewaTime.show());
          }
        }, 0);
      }
    }
  }, 'select[name="EmploymentType"]')
  .on({
    'keydown keyup': fewaUpdate
  }, '#fewaWeek')
  .on({
    'keydown keyup': fewaUpdate
  }, '#fewaMonth')
  .on({
    'keydown keyup': fewaUpdate
  }, '#fewaYear');

function fewaUpdate(e) {
  var $this = $(this);
  var validKeys = [8, 9, 13, 27, ...a(37, 4), 46, ...a(48, 10), 86, 88, ...a(96, 10)];

  if (validKeys.indexOf(e.keyCode) < 0) {
    return reset();
  }
  if (e.ctrlKey) {
    if (e.keyCode == 86 || e.keyCode == 88) {
      if ($this.val().length == undefined) {
        return reset();
      }
      $this.val($this.val().toString().replace(/\D/g, ''));
    }
  }
  if (e.shiftKey) {
    if (a(48, 10).indexOf(e.keyCode) >= 0) {
      return reset();
    }
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
        if (time[a].val > time[a].max) {
          time[a].$.val(time[a].max);
        } else if (time[a].val < time[a].min) {
          time[a].$.val(time[a].min);
        }
      }
      break;
      case 0:
    }
    time[a].val = typeof time[a].val == 'string' ? 0 : parseInt(time[a].$.val());
  }
  $this.data({
    'fewa-val': $this.val()
  });

  var today = new Date();
  if (week.val == 0) {
    today.setDate(1);
  }
  if (month.val >= 0 && year.val >= 0 || year.val > 0) {
    today.setFullYear(today.getFullYear() - year.val);
    today.setMonth(today.getMonth() - month.val);
    today.setDate(today.getDate() - week.val * 7);
    month.val = today.getMonth() + 1;
    if (month.toString().length === 1) {
      month.val = '0' + month.val;
    }
    $('#fewaTimeEst').html(month.val + ' ' + today.getFullYear());
  }
};
