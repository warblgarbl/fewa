chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.to !== 'popup') return;
  var $load = $(request.target + ' .load');
  var $loadLabel = $(request.target + '.load-label');
  switch (request.target) {
    case "#slideshow":
      switch (request.type) {
        case "max":
          $load.progressbar("option", "max", request.value);
          $loadLabel.text($load.progressbar("value") + " / " + $load.progressbar("option", "max"));
          break;
        case "1 sheet":
          $load.progressbar("value", $load.progressbar("option", "max"));
          $loadLabel.text("2 / 2");
          $load.hide("fade");
          $(request.target + ' .message').html("More than one sheet required.").show("fade");
          break;
        case "sheet":
          $(request.target + ' .list').append(
            $('<li>').attr({
              class: "sheet"
            }).append(
              $('<div>').attr({
                class: "order"
              }),
              $('<input>').attr({
                id: request.value.id,
                type: "number",
                class: "empty",
                min: 5,
                max: 300,
                placeholder: "300"
              }),
              $('<div>').attr({
                class: "label"
              }).append(
                $('<div>').attr({
                  class: "sheet-name"
                }).html(request.value.name),
                $('<div>').attr({
                  class: "gid"
                }).html('gid: ' + request.value.id)
              )
            )
          );
          $load.progressbar("value", $load.progressbar("value") + 1);
          $loadLabel.text($load.progressbar("value") + '/' + $load.progressbar("option", "max"));
          break;
        case "sort":
          var $list = $('#slideshow .list');
          var $old = $('#slideshow .sheet');
          var $new = [];
          for (let i = 0; i < $old.length; i++) {
            let $n = $old.eq(request.value[i]);
            $n.find('.order').html(i + 1);
            $new.push($n);
          }
          $load.progressbar("value", $load.progressbar("value") + 1);
          $loadLabel.text($load.progressbar("value") + '/' + $load.progressbar("option", "max"));
          $list.empty().append($new).sortable({
            axis: "y",
            containment: "parent",
            revert: true,
            stop: function() {
              var $order = $('#slideshow .sheet');
              for (let i = 0; i < $order.length; i++) {
                $order.eq(i).find('.order').html(i + 1);
              }
            },
            tolerance: "pointer"
          }).on("sort", $list.sortable("option", "stop"));

          chrome.tabs.query({
            active: true,
            currentWindow: true
          }, (tabs) => {
            let id = tabs[0].url.split(/\/d\//)[1].split(/\//)[0];
            chrome.storage.sync.get().then(result => {
              let page = result.fewa.sheets.page_settings;
              if (id in page) {
                let data = page[id].data;
                console.log(data);
                if (data.length) {
                  for (let i = 0; i < data.length; i++) {
                    let gid = '#' + data[i].id;
                    let sel = `.sheet:has(${gid})`
                    let sheet = $(sel);
                    $(gid).val(data[i].time);
                    $list.children().eq(i).before(sheet);
                  }
                }
                if (page[id].active) {
                  $('#slideshowRefresh').show();
                  $('#slideshowStop').show();
                  $('#slideshowStart').hide();
                }
              }
            });
          });
          $load.hide("fade").queue(function(nxt) {
            $('#slideshow input[type="number"]').trigger("change");
            $list.trigger("sort").show("fade");
            $('#slideshow .btnSet').show("fade");
            nxt();
          });
          break;
      }
  }
});

$(document).ready(() => {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, (tabs) => {
      if (/.*docs\.google\.com\/spreadsheets\/d\/.*/.test(tabs[0].url)) {
        $('#default').hide();
        $('#slideshow').show();
        $('#slideshow .load').progressbar({
          value: 0
        });
        $('#slideshow .btnSet').button().hide();
        $('#slideshowStart').button({
          icon: "ui-icon-play"
        }).hide();
        $('#slideshowRefresh').button({
          icon: "ui-icon-arrowrefresh-1-w"
        }).hide();
        $('#slideshowStop').button({
          icon: "ui-icon-stop"
        }).hide();

        var tabId = tabs[0].id;
        var id = tabs[0].url.split(/\/d\//)[1].split(/\//)[0];
        chrome.tabs.sendMessage(tabId, {
          type: 'getSheets'
        });
      };
    });
  })
  .on({
    click: function() {
      var $this = $(this);
      var sheets = $('.sheet');
      var data = [];
      for (let i = 0; i < sheets.length; i++) {
        let time = sheets.eq(i).find('input[type="number"]').eq(0);
        let id = time.attr('id');
        time = time.val();
        if (time.length) {
          data.push({
            id,
            time
          });
        }
      }
      if (data.length > 1) {
        chrome.tabs.query({
          active: true,
          currentWindow: true
        }, (tabs) => {
          var tabId = tabs[0].id;
          let obj = {};
          let id = tabs[0].url.split(/\/d\//)[1].split(/\//)[0];
          chrome.tabs.sendMessage(tabId, {
            type: "slideshowStart",
            tabId,
            id,
            data
          });
          chrome.storage.sync.get().then(result => {
            let page = result.fewa.sheets.page_settings;
            if (!(id in page)) {
              page[id] = {
                active: true,
                data
              }
            } else {
              page[id].active = true;
              page[id].data = data;
            }
            chrome.storage.sync.set(result);
          });
          chrome.storage.sync.get().then(res => console.log(res));
        });
        $this.filter(':visible').hide();
        $('#slideshowRefresh, #slideshowStop').filter(':hidden').show();
      }
    }
  }, '#slideshowStart')
  .on({
    click: function() {
      $('#slideshowStop').trigger('click');
      setTimeout(() => $('#slideshowStart').trigger('click'), 10);
    }
  }, '#slideshowRefresh')
  .on({
    click: function() {
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, (tabs) => {
        var tabId = tabs[0].id;
        let id = tabs[0].url.split(/\/d\//)[1].split(/\//)[0];
        chrome.tabs.sendMessage(tabId, {
          type: "slideshowStop",
          tabId,
          id
        });
        chrome.storage.sync.get().then(result => {
          let page = result.fewa.sheets.page_settings[id];
          page.active = false;
          chrome.storage.sync.set(result);
        });
      });

      var ready = $('#slideshow .sheet input').filter((i, e) => e.value.toString().length);
      if (ready.length > 1) {
        $('#slideshowStart:hidden').show();
      }
      $('#slideshowRefresh, #slideshowStop').filter(':visible').hide();
    }
  }, '#slideshowStop')
  .on({
    'change keydown keyup': function(e) {
      var $this = $(this);
      var $val = $this.val();
      var $max = parseInt($this.attr("max"));
      var $min = parseInt($this.attr("min"))
      switch ($val.length) {
        default:
          $this.val(parseInt($val.substring(0, 3)));
        case 3:
        case 2:
        case 1:
          $val = parseInt($this.val());
          if ($val > $max) {
            $this.val($max);
          } else if ($val < $min && !/key/.test(e.type)) {
            $this.val($min);
          }
          $this.removeAttr("class");
          break;
        case 0:
          $this.attr({
            class: "empty"
          });
      }

      var ready = $('#slideshow .sheet input').filter((i, e) => e.value.toString().length);
      if (ready.length > 1) {
        if ($('#slideshowStop:visible').length) {
          $('#slideshowRefresh').show();
        } else {
          $('#slideshowStart').attr({
            disabled: ""
          });
        }
      } else {
        $('#slideshowStart, #slideshowRefresh').filter(':visible').hide();
      }
    }
  }, 'input[type="number"]');
