const storage = chrome.storage.sync;
storage.get().then(result => window.pref = result.preferences.pci);

$(document).ready(() => {
  storage.get().then(result => {
    var pend = $('#stareport-pending-loading');
    var pd = $('#stareport-pastdue-loading');
    var observer = tar => {
      return new MutationObserver(mutations => {
        mutations.forEach(mutationRecord => {
          if (mutationRecord.target.style.display != "none") return;
          let buttons = $('.dt-buttons').eq(tar == "pending" ? 0 : 1);
          let btn = $('<button>').attr({
            id: `#fewa-pcistar-${tar}-refresh`,
            class: buttons.children('button').eq(0).attr('class')
          });
          buttons.append(btn.on('click', null, tar, decisionCodeConversion).append($('<span>').html("Decision %")));
          decisionCodeConversion(null, tar);
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

function decisionCodeConversion(e, tar) {
  var $head = $(`#stareport-${tar}-datatable thead th`);
  var ind = {
    date: "",
    rep: "",
    dec: ""
  }
  for (let a = 0; a < $head.length; a++) {
    let head = $head.eq(a).html();
    if (/Date/i.test(head))
      ind.date = a;
    if (/Caller/i.test(head))
      ind.rep = a;
    if (/Dec.*Code/i.test(head))
      ind.dec = a;
  }
  for (let key in ind)
    if (ind[key] === "")
      return;
  var strDate;
  var arrDate;
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
    let strRep = $rep.html();
    let strDec = $dec.html();
    if (strDate != $date.html()) {
      strDate = $date.html();
      arrDate = strDate.split("\/");
      date = new Date(Number(arrDate[2]), Number(arrDate[0]) - 1, Number(arrDate[1]));
      switch (swap) {
        case 0:
          swap = 1;
          break;
        case 1:
          swap = 0;
          break;
      }
    }
    if (window.pref.report)
      $row.attr({ style: "background-color:" + shade[swap] });
    if (/TIM/i.test(strRep))
      $rep.empty();
    if (window.pref.decCode)
      if (!/\d/.test(strDec)) {
        if (date > new Date(2020, 6, 26) && date < new Date(2021, 0, 24))
          switch (strDec) {
            case "A+":
              $dec.html(strDec += ": <b>100%</b>");
              break;
            case "A":
              $dec.html(strDec += ": <b>95%</b>");
              break;
            case "B":
              $dec.html(strDec += ": <b>90%</b>");
              break;
            case "C":
              $dec.html(strDec += ": <b>85%</b>");
              break;
            case "D":
              $dec.html(strDec += ": <b>80%</b>");
              break;
            case "E":
              $dec.html(strDec += ": <b>75%</b>");
              break;
            case "G":
              $dec.html(strDec += ": <b>70%</b>");
              break;
            case "H":
              $dec.html(strDec += ": <b>65%</b>");
              break;
            case "I":
              $dec.html(strDec += ": <b>60%</b>");
              break;
            case "J":
              $dec.html(strDec += ": <b>55%</b>");
              break;
          }
        else if (date >= new Date(2021, 0, 24) && date < new Date(2023, 0, 27))
          switch (strDec) {
            case "A+":
            case "A":
              $dec.html(strDec += ": <b>100%</b>");
              break;
            case "B":
              $dec.html(strDec += ": <b>95%</b>");
              break;
            case "C":
              $dec.html(strDec += ": <b>90%</b>");
              break;
            case "D":
              $dec.html(strDec += ": <b>85%</b>");
              break;
            case "E":
              $dec.html(strDec += ": <b>80%</b>");
              break;
            case "G":
              $dec.html(strDec += ": <b>75%</b>");
              break;
            case "H":
              $dec.html(strDec += ": <b>70%</b>");
              break;
            case "I":
              $dec.html(strDec += ": <b>65%</b>");
              break;
            case "J":
              $dec.html(strDec += ": <b>60%</b>");
              break;
          }
        else if (date >= new Date(2023, 0, 27) && date < new Date(2024, 0, 2))
          switch (strDec) {
            case "A+":
              $dec.html(strDec += ": <b>100%</b>");
              break;
            case "A":
              $dec.html(strDec += ": <b>98%</b>");
              break;
            case "D":
              $dec.html(strDec += ": <b>83%</b>");
              break;
            case "C":
              $dec.html(strDec += ": <b>88%</b>");
              break;
            case "B":
              $dec.html(strDec += ": <b>93%</b>");
              break;
            case "E":
              $dec.html(strDec += ": <b>78%</b>");
              break;
            case "G":
              $dec.html(strDec += ": <b>73%</b>");
              break;
            case "H":
              $dec.html(strDec += ": <b>68%</b>");
              break;
            case "I":
              $dec.html(strDec += ": <b>63%</b>");
              break;
            case "J":
              $dec.html(strDec += ": <b>58%</b>");
              break;
          }
        else if (date >= new Date(2024, 0, 2))
          switch (strDec) {
            case "A+":
              $dec.html(strDec += ": <b>100%</b>");
              break;
            case "A":
              $dec.html(strDec += ": <b>95%</b>");
              break;
            case "B":
              $dec.html(strDec += ": <b>90%</b>");
              break;
            case "C":
              $dec.html(strDec += ": <b>85%</b>");
              break;
            case "D":
              $dec.html(strDec += ": <b>80%</b>");
              break;
            case "E":
              $dec.html(strDec += ": <b>75%</b>");
              break;
            case "G":
              $dec.html(strDec += ": <b>70%</b>");
              break;
            case "H":
              $dec.html(strDec += ": <b>65%</b>");
              break;
            case "I":
              $dec.html(strDec += ": <b>60%</b>");
              break;
            case "J":
              $dec.html(strDec += ": <b>55%</b>");
              break;
          }
      }
  }
  window.dispatchEvent(new Event('resize'));
  $(`#stareport-${tar}-datatable th[aria-label="Date: activate to sort column descending"]`).trigger('click');
}