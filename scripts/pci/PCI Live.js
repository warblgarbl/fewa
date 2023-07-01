$(document).ready(() => {
  let observer = new MutationObserver(mutations => {
    mutations.forEach(mutationRecord => {
      if (mutationRecord.target.style.display != 'none') {
        return;
      }
      var $head = $('.datatable thead th');
      var dec;
      for (let a = 0; a < $head.length; a++) {
        if (/Dec Code/i.test($head.eq(a).html())) {
          dec = a;
          break;
        }
      }

      var $rows = $('.datatable tbody tr[role=row]');
      for (let i = 0; i < $rows.length; i++) {
        var $row = $rows.eq(i);
        var $child = $row.children();
        var $dec = $child.eq(dec);
        var $html = $dec.html();
        switch ($html) {
          case 'A+':
            $dec.html($html += ': 100%');
            break;
          case 'A':
            $dec.html($html += ': 98%');
            break;
          case 'B':
            $dec.html($html += ': 93%');
            break;
          case 'C':
            $dec.html($html += ': 88%');
            break;
          case 'D':
            $dec.html($html += ': 83%');
            break;
          case 'E':
            $dec.html($html += ': 78%');
            break;
          case 'G':
            $dec.html($html += ': 73%');
            break;
          case 'H':
            $dec.html($html += ': 68%');
            break;
          case 'I':
            $dec.html($html += ': 63%');
            break;
          case 'J':
            $dec.html($html += ': 58%');
            break;
        }
      }
      window.dispatchEvent(new Event('resize'));
    });
  });

  let target = $('#loading-table').get()[0];

  observer.observe(target, {
    attributes: true,
    attributeFilter: ['style']
  });
});
