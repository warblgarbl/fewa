const storage = chrome.storage.sync;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.to !== "popup")
    return;
  var $load = $(request.target + " " + '.load');
  switch (request.target) {
    case ".spreadsheet":
      switch (request.type) {
        case "init":
          $('.spreadsheet').attr({ name: request.name });
          $('.spreadsheet .name').html(request.name);
          $load.progressbar('option', 'max', request.max);
          break;
        case "1 sheet":
          $load.progressbar('value', $load.progressbar('option', 'max'));
          $load.hide('fade');
          $(request.target + " " + '.message').html("More than one sheet required.").show('fade');
          break;
        case "sheet":
          $(request.target + " " + '.list').append(
            $('<li>').addClass('sheet').append(
              $('<div>').addClass('order'),
              $('<input>').attr({
                id: request.value.gid,
                name: request.value.name,
                type: "number",
                class: "empty",
                min: 5,
                max: 300,
                placeholder: "300"
              }),
              $('<label>').html("s"),
              $('<div>').addClass('label').append(
                $('<div>').addClass('sheet-name').html(request.value.name),
                $('<div>').addClass('gid').html("gid: " + request.value.gid)
              )
            )
          );
          $load.progressbar('value', $load.progressbar('value') + 1);
          break;
        case "sort":
          var $list = $('.spreadsheet .list');
          var $old = $('.spreadsheet .sheet');
          var $new = [];
          for (let i = 0; i < $old.length; i++) {
            let $n = $old.eq(request.value[i]);
            $n.find('.order').html(i + 1);
            $new.push($n);
          }
          $load.progressbar('value', $load.progressbar('value') + 1);
          $list.empty().append($new).sortable({
            axis: "y",
            containment: "parent",
            revert: true,
            stop: function () {
              var $sort = $('.spreadsheet .sheet:not(.ui-sortable-helper)');
              var $place = $('.ui-sortable-placeholder');
              var $help = $('.ui-sortable-helper');
              for (let i = 0; i < $sort.length; i++)
                $sort.eq(i).find('.order').html(i + 1);
              $help.find('.order').html($place.index('.spreadsheet .sheet:not(.ui-sortable-helper)') + 1);
            },
            tolerance: "pointer"
          }).on('sort', $list.sortable('option', 'stop'));

          chrome.tabs.query({
            active: true,
            currentWindow: true
          }, (tabs) => {
            var tabID = tabs[0].id;
            var sheetID = tabs[0].url.match(/^http.+?spreadsheets\/d\/(.+?)\//)[1];
            storage.get().then(result => {
              var page = result.page_settings.sheets;
              if (sheetID in page) {
                var sheet = page[sheetID];
                for (let i = 0; i < sheet.data.length; i++) {
                  let gid = "#" + sheet.data[i].gid;
                  let sel = `.sheet:has(${gid})`
                  let $sheet = $(sel);
                  $(gid).val(sheet.data[i].time);
                  $list.children().eq(i).before($sheet);
                }
              }

              if (tabID in page.active) {
                $('#slideshowStart').addClass('ui-state-disabled');
                $('#slideshowStop').removeClass('ui-state-disabled');
              } else $('#slideshowStart, #slideshowRefresh, #slideshowStop').addClass('ui-state-disabled');

              $load.hide('fade').queue(function (nxt) {
                $list.trigger('sort').show('fade').queue(function (nxt2) {
                  $list.width($list.width());
                  nxt2();
                });
                $('#slideshow .btnSet').show('fade');
                $('#slideshow input[type="number"]').trigger('change');
                nxt();
              });
            });
          });
          break;
      }
      break;
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
          value: 0,
          change: function () {
            $(this).children('.load-label')
              .text($(this).progressbar('value') + " / " + $(this).progressbar('option', 'max'));
          },
          complete: function () {
            $(this).hide('fade');
          }
        }).children('.ui-progressbar-value');
        $('#slideshow .btnSet').buttonset().hide();
        $('#slideshowStart').button({ icon: 'ui-icon-play' });
        $('#slideshowRefresh').button({ icon: 'ui-icon-arrowrefresh-1-w' });
        $('#slideshowStop').button({ icon: 'ui-icon-stop' });
        chrome.tabs.sendMessage(tabs[0].id, { type: "getSheets" });
      }
    });
  })
  .on({
    click: function () {
      var $this = $(this);
      var name = $('.spreadsheet .name').html();
      var sheets = $('.sheet');
      var data = [];
      for (let i = 0; i < sheets.length; i++) {
        let sheet = sheets.eq(i);
        let time = sheet.find('input[type="number"]').eq(0);
        let gid = time.attr('id');
        let name = time.attr('name');
        time = time.val();
        if (time.length)
          data.push({ gid, name, time });
      }
      if (data.length > 1) {
        chrome.tabs.query({
          active: true,
          currentWindow: true
        }, (tabs) => {
          var tabID = tabs[0].id;
          var sheetID = tabs[0].url.match(/^http.+?spreadsheets\/d\/(.+?)\//)[1];
          storage.get().then(result => {
            var page = result.page_settings.sheets;
            if (!(sheetID in page))
              page[sheetID] = { name: "", data: [] };
            if (name != page[sheetID].name || data.length != page[sheetID].length) {
              page[sheetID] = { name, data }
              storage.set(result)
            } else
              for (let i = 0; i < data.length; i++)
                if (data[i].gid != page[sheetID][i].gid || data[i].name != page[sheetID][i].name || data[i].time != page[sheetID][i].time) {
                  page[sheetID] = { name, data }
                  storage.set(result);
                }
          });
          chrome.tabs.sendMessage(tabID, {
            type: "slideshowStart",
            tabID,
            data
          });
        });
        $this.addClass('ui-state-disabled');
        $('#slideshowRefresh, #slideshowStop').removeClass('ui-state-disabled');
      }
    }
  }, '#slideshowStart')
  .on({
    click: function () {
      $('#slideshowStop').trigger('click');
      setTimeout(() => $('#slideshowStart').trigger('click'), 10);
    }
  }, '#slideshowRefresh')
  .on({
    click: function () {
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, (tabs) => {
        var tabID = tabs[0].id;
        storage.get().then(result => {
          var page = result.page_settings.sheets;
          var timeoutID = page[tabID];
          chrome.tabs.sendMessage(tabID, {
            type: "slideshowStop",
            tabID,
            timeoutID
          })
        })
        chrome.tabs.sendMessage(tabID, {
          type: "slideshowStop",
          tabID
        }).then(() => {
          storage.get().then(result => {
            let page = result.page_settings.sheets;
            delete page.active[tabID];
            storage.set(result);
          });
        });
      });

      $('#slideshowStop').addClass('ui-state-disabled');
      $('input[type="number"]').eq(0).trigger('change');
    }
  }, '#slideshowStop')
  .on({
    'change keydown keyup': function (e) {
      var $this = $(this);
      var $val = $this.val();
      var $parent = $this.parents('.spreadsheet');
      var $max = parseInt($this.attr('max'));
      var $min = parseInt($this.attr('min'));
      switch ($val.length) {
        default:
          $this.val(parseInt($val.substring(0, 3)));
        case 3:
        case 2:
        case 1:
          $val = parseInt($this.val());
          if ($val > $max)
            $this.val($max);
          else if ($val < $min && !/key/.test(e.type))
            $this.val($min);
          $this.removeClass('empty');
          break;
        case 0:
          $this.addClass('empty');
      }

      var ready = $parent.find('.sheet input:valid:not(.empty)');
      if (ready.length > 1) {
        if ($('#slideshowStop.ui-state-disabled').length)
          $('#slideshowStart').removeClass('ui-state-disabled');
        else
          $('#slideshowRefresh').removeClass('ui-state-disabled');
      } else $('#slideshowStart, #slideshowRefresh').addClass('ui-state-disabled');
    }
  }, 'input[type="number"]');