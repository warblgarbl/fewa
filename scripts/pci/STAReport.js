const storage = chrome.storage.sync;
storage.get().then(result => {
  window.pref = result.fewa.preferences.pci;
})

$(document).ready(() => {
  storage.get().then(result => {
    var pref = result.fewa.preferences.pci;
    var pend = $('#stareport-pending-loading');
    var pd = $('#stareport-pastdue-loading');
    var observer = (tar) => {
      return new MutationObserver(mutations => {
        mutations.forEach(mutationRecord => {
          if (mutationRecord.target.style.display != "none") return;
          let buttons = $('.dt-buttons').eq(tar == "pending" ? 0 : 1);
          let btn = $('<button>').attr({
            id: `#fewa-pcistar-${tar}-refresh`,
            class: buttons.children('button').eq(0).attr('class')
          });
          buttons.append(btn.on('click', null, tar, decision).append($('<span>').html("Decision %")));
          decision(null, tar, pref);
        });
      });
    }
    observer("pending").observe(pend[0], {
      attributes: true,
      attributeFilter: ['style']
    });
    observer("pastdue").observe(pd[0], {
      attributes: true,
      attributeFilter: ['style']
    });
  })
});

function decision(e, tar, pref = window.pref) {
  var $head = $(`#stareport-${tar}-datatable thead th`);
  var ind = {
    date: "",
    rep: "",
    dec: ""
  };
  for (let a = 0; a < $head.length; a++) {
    let head = $head.eq(a).html();
    if (/Date/i.test(head)) ind.date = a;
    if (/Caller/i.test(head)) ind.rep = a;
    if (/Dec.*Code/i.test(head)) ind.dec = a;
  }
  var date;
  var swap = 1;
  var shade = ["#0069a633", "#f38b0044"];
  var $rows = $(`#stareport-${tar}-datatable tbody tr[role=row]`);
  for (let i = 0; i < $rows.length; i++) {
    let $row = $rows.eq(i);
    let $child = $row.children();
    let $date = $child.eq(ind.date);
    let $rep = $child.eq(ind.rep);
    let $dec = $child.eq(ind.dec);
    if (pref.report) {
      if (date != $date.html()) {
        date = $date.html();
        switch (swap) {
          case 0:
            swap = 1;
            break;
          case 1:
            swap = 0;
            break;
        }
      }
      $row.attr({ style: "background-color:" + shade[swap] });
    }
    if (/TIM/i.test($rep.html())) $rep.empty();
    if (pref.decCode) {
      switch ($dec.html()) {
        case "A+":
          $dec.html($dec.html() + ": <b>100%</b>");
          break;
        case "A":
          $dec.html($dec.html() + ": <b>98%</b>");
          break;
        case "D":
          $dec.html($dec.html() + ": <b>83%</b>");
          break;
        case "C":
          $dec.html($dec.html() + ": <b>88%</b>");
          break;
        case "B":
          $dec.html($dec.html() + ": <b>93%</b>");
          break;
        case "E":
          $dec.html($dec.html() + ": <b>78%</b>");
          break;
        case "G":
          $dec.html($dec.html() + ": <b>73%</b>");
          break;
        case "H":
          $dec.html($dec.html() + ": <b>68%</b>");
          break;
        case "I":
          $dec.html($dec.html() + ": <b>63%</b>");
          break;
        case "J":
          $dec.html($dec.html() + ": <b>58%</b>");
          break;
      }
    }
  }
  window.dispatchEvent(new Event('resize'));
  $(`#stareport-${tar}-datatable th[aria-label="Date: activate to sort column descending"]`).trigger('click');
}