const storage = chrome.storage.sync;

$(document).on({
  click: decisionCodeConversion
}, "li.paginate_button > a").ready(() => {
  storage.get().then(result => {
    var pref = result.preferences.pci;
    if (pref.decCode) {
      let observer = new MutationObserver(mutations => {
        mutations.forEach(mutationRecord => {
          if (mutationRecord.target.style.display != "none")
            return;
          decisionCodeConversion();
        });
      });
      let target = $('#loading-table').get()[0];
      observer.observe(target, {
        attributes: true,
        attributeFilter: ['style']
      });
    }
  })
});

function decisionCodeConversion() {
  var $head = $('.datatable thead th');
  var ind = {
    date: "",
    dec: ""
  }
  for (let a = 0; a < $head.length; a++) {
    if (/Date/i.test($head.eq(a).html()))
      ind.date = a;
    if (/Dec Code/i.test($head.eq(a).html()))
      ind.dec = a;
  }
  for (let key in ind)
    if (ind[key] === "")
      return;

  var $rows = $('.datatable tbody tr[role=row]');
  for (let i = 0; i < $rows.length; i++) {
    var $row = $rows.eq(i);
    var $child = $row.children();
    var $date = $child.eq(ind.date);
    var $dec = $child.eq(ind.dec);
    var arrDate = $date.html().split("\/");
    var date = new Date(Number(arrDate[2]), Number(arrDate[0]) - 1, Number(arrDate[1]));
    var strDec = $dec.html();
    if (!/\d/.test(strDec))
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
  window.dispatchEvent(new Event('resize'));
}