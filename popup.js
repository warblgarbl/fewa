$(document).ready(() => {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, (tabs) => {
      if (/.*docs\.google\.com\/spreadsheets\/d\/.*/.test(tabs[0].url)) {
        $('#default').hide();
        $('#slideshow').show();

        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'getSheets'
        }, (result) => {
          let rows = [];
          if (!result) return;
          for (let i = 0; i < result.ids.length; i++) {
            rows.push($('<div>').attr({
              class: 'sheet'
            }).append(
              $('<input>').attr({
                id: result.ids[i],
                class: 'input',
                type: 'number',
                min: 3,
                max: 300,
                placeholder: '10-300'
              }),
              $('<div>').attr({
                class: 'label'
              }).append(
                $('<div>').attr({
                  class: 'sheet-name'
                }).html(result.names[i]),
                $('<div>').attr({
                  class: 'gid',
                  data: result.ids[i]
                }).html('gid: ' + result.ids[i])
              )
            ));
          }
          $('#slideshow').append(...rows);

          chrome.storage.sync.get(['slideshow_' + tabs[0].id])
            .then(result => {
              console.log(result['slideshow_' + tabs[0].id]);
              if (result['slideshow_' + tabs[0].id]) {
                $('#slideshowStart').attr({
                  disabled: ""
                });
                $('#slideshowUpdate').show();
                $('#slideshowStop').show();
                chrome.storage.sync.get(['slideshowData_' + tabs[0].id])
                  .then(result => {
                    var data = result['slideshowData_' + tabs[0].id];
                    for (let i = 0; i < data.length; i++) {
                      $('#' + data[i].id).val(data[i].time);
                    }
                  });
              }
            });
        });
      }
    });
  })
  .on({
    click: function() {
      var $this = $(this);
      var sheets = $('.sheet');
      var data = [];
      for (let i = 0; i < sheets.length; i++) {
        let id = sheets.eq(i).find('.gid').eq(0).attr('data');
        let time = $('#' + id).val();
        data.push({
          id,
          time
        });
      }
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'slideshowStart',
          tabId: tabs[0].id,
          data: data
        });
        let obj = {};
        obj['slideshowData_' + tabs[0].id] = data;
        obj['slideshow_' + tabs[0].id] = true;
        chrome.storage.sync.set(obj);
      });
      $this.attr({
        disabled: ""
      });
      $('#slideshowUpdate, #slideshowStop').removeAttr("disabled").show();
    }
  }, '#slideshowStart')
  .on({
    click: function() {
      $('#slideshowStop').trigger('click');
      setTimeout(() => $('#slideshowStart').trigger('click'), 10);
    }
  }, '#slideshowUpdate')
  .on({
    click: function() {
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, (tabs) => {
        chrome.storage.sync.get(['currentSlide_' + tabs[0].id])
          .then(result => {
            chrome.tabs.sendMessage(tabs[0].id, {
              type: 'slideshowStop',
              tabId: tabs[0].id
            });
            let obj = {};
            obj['slideshow_' + tabs[0].id] = false;
            chrome.storage.sync.set(obj);
          });
      });
      $('#slideshowStart').removeAttr("disabled");
      $('#slideshowUpdate, #slideshowStop').attr({
        disabled: ""
      });
    }
  }, '#slideshowStop');
