$(document)
  .on({
    click: function() {
      setTimeout(() => {
        var $options = $('#selectDealerModal .selectField[name="dealers"]').children('option')
        for (let o = 0; o < $options.length; o++) {
          let $opt = $options.eq(o);
          if (/002306/.test($opt.html())) {
            $opt.html('Water Treatment - 002306');
          } else if (/532306/.test($opt.html())) {
            $opt.html('Home Improvement - 532306');
          }
        }
      }, 0);
    }
  }, '#applications button')
  .on({
    change: function() {
      var $this = $(this);
      var $val = $this.val();
      var dealID = $this.children(`[value="${$val}"]`).eq(0).html();
      if (/002306/.test(dealID)) {
        chrome.storage.sync.set({
          dealer: "Water Treatment"
        });
      } else if (/532306/.test(dealID)) {
        chrome.storage.sync.set({
          dealer: "Home Improvement"
        });
      }
    }
  }, '#selectDealerModal .selectField[name="dealers"]');
