$(document).on({
    click: function() {
      setTimeout(() => {
        var $opt = $('#selectDealerModal .selectField[name="dealers"]').children('option')
        for (let o = 0; o < $opt.length; o++) {
          let opt = $opt.eq(o);
          if (/002306/.test(opt.html())) {
            opt.html('Water Treatment - 002306');
          } else if (/532306/.test(opt.html())) {
            opt.html('Home Improvement - 532306');
          }
        }
      }, 0);
    }
  }, '#applications button');
