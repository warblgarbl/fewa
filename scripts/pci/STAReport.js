$(document).ready(() => {
  var pend = $('#stareport-pending-loading');
  var pd = $('#stareport-pastdue-loading');
  
  var observer = (tar) => {
    return new MutationObserver(mutations => {
      mutations.forEach(mutationRecord => {
        if (mutationRecord.target.style.display != 'none') {
          return;
        }
        decision(tar);
        if (!$(`#fewa-pcistar-${tar}-refresh`).length) {
          let n;
          switch (tar) {
            case 'pending': n = 0; break;
            case 'pastdue': n = 1;
          }
          let buttons = $('.dt-buttons').eq(n);
          let btn = $('<button>').attr({
            'id': `#fewa-pcistar-${tar}-refresh`,
            'class': buttons.children('button').eq(0).attr('class')
          });
          btn.on('click', () => decision(tar));
          btn.append($('<span>').html('Decision %'));
          buttons.append(btn);
        }
      });
    });
  }
  
  observer('pending').observe(pend[0], {
    attributes: true,
    attributeFilter: ['style']
  });
  observer('pastdue').observe(pd[0], {
    attributes: true,
    attributeFilter: ['style']
  });
});

function decision(tar) {
  var $head = $(`#stareport-${tar}-datatable thead th`);
  var date;
  var rep;
  var dec;
  for (let a = 0; a < $head.length; a++) {
    let h = $head.eq(a).html();
    if (/Date/i.test(h)) {
      date = a;
    }
    if (/Caller/i.test(h)) {
      rep = a;
    }
    if (/Dec.*Code/i.test(h)) {
      dec = a;
    }
  }
  var $rows = $(`#stareport-${tar}-datatable tbody tr[role=row]`);
  var dateGroup;
  var swap = 0;
  var shade = ['#0069a633', '#f38b0044'];
  for (let i = 0; i < $rows.length; i++) {
    let $row = $rows.eq(i);
    let $child = $row.children();
    
    let $date = $child.eq(date);
    if (dateGroup != $date.html()) {
      dateGroup = $date.html();
      switch (swap) {
        case 0: swap = 1; break;
        case 1: swap = 0; break;
      }
    }
    $row.attr({'style': "background-color:" + shade[swap]});
    
    let $rep = $child.eq(rep);
    if (/TIM/i.test($rep.html())) {
      $rep.html('');
    }
    
    let $dec = $child.eq(dec);
    switch ($dec.html()) {
      case 'A+': $dec.html($dec.html() + ': <b>100%</b>'); break;
      case 'A': $dec.html($dec.html() + ': <b>98%</b>'); break;
      case 'D': $dec.html($dec.html() + ': <b>83%</b>'); break;
      case 'C': $dec.html($dec.html() + ': <b>88%</b>'); break;
      case 'B': $dec.html($dec.html() + ': <b>93%</b>'); break;
      case 'E': $dec.html($dec.html() + ': <b>78%</b>'); break;
      case 'G': $dec.html($dec.html() + ': <b>73%</b>'); break;
      case 'H': $dec.html($dec.html() + ': <b>68%</b>'); break;
      case 'I': $dec.html($dec.html() + ': <b>63%</b>'); break;
      case 'J': $dec.html($dec.html() + ': <b>58%</b>'); break;
    }
  }
  window.dispatchEvent(new Event('resize'));
  $(`#stareport-${tar}-datatable th[aria-label="Date: activate to sort column descending"]`).trigger('click');
}