const storage = chrome.storage.sync;
chrome.runtime.onMessage.addListener(request => {
  if (request.to != "options") return;
  switch (request.type) {}
});
$(document).ready(restore)
  .ready(() => {
    $('.buttons').buttonset();
    $('#save, #undo, #default, #temp').button();
    $('input[type="number"]').trigger('change')
    setTimeout(() => $('input[type="number"]').trigger('change'), 0);
  })
  .on({
    click: save
  }, '#save')
  .on({
    click: restore
  }, '#undo')
  .on({
    click: () => chrome.runtime.sendMessage({
      to: "background",
      type: "defaultStorage"
    }, restore)
  }, '#default')
  .on({
    click: () => storage.get().then(result => {
      var options = result.fewa;
      for (let dom in options) {
        var page = options[dom].page_settings;
        for (let key in page) {
          switch (key) {
            case "active":
              page[key] = {}
              break;
          }
        }
      }
      storage.set(result);
      restore();
    })
  }, '#temp')
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
          if ($val > $max) $this.val($max)
          else if ($val < $min && !/key/.test(e.type)) $this.val($min);
          $this.removeClass('empty');
          break;
        case 0:
          $this.addClass('empty');
      }
    }
  }, 'input[type="number"]');

function restore() {
  storage.get().then(result => {
    var options = result.fewa;
    for (let dom in options) {
      for (let cat in options[dom]) {
        switch (cat) {
          case "page_settings":
            var page = options[dom].page_settings;
            switch (dom) {
              case "cic":
              case "aqua":
              case "pci":
                break;
              case "sheets":
                $(`.${cat} .${dom}`).append(() => {
                  var ssArray = [];
                  for (let id in page) {
                    if (id.length === 44) {
                      var ss = $('<div>').addClass('spreadsheet').attr({
                        id,
                        name: page[id].name
                      });
                      var $name = $('<h4>').addClass('name').html(page[id].name);
                      var $list = $('<ol>').addClass('list');
                      ss.append($name, $list);

                      for (let i = 0; i < page[id].data.length; i++) {
                        let sheet = page[id].data[i];
                        $list.append(
                          $('<li>').addClass('sheet').append(
                            $('<div>').addClass('order'),
                            $('<input>').attr({
                              id: sheet.gid,
                              name: sheet.name,
                              type: "number",
                              min: 5,
                              max: 300,
                              placeholder: "300"
                            }).val(sheet.time),
                            $('<div>').addClass('label').append(
                              $('<div>').addClass('sheet-name').html(sheet.name),
                              $('<div>').addClass('gid').html("gid: " + sheet.gid)
                            )
                          ));
                      }

                      ssArray.push(ss);
                    }
                  }
                  return ssArray;
                });
                break;
            }
            break;
          case "preferences":
            var pref = options[dom].preferences;
            switch (dom) {
              case "cic":
                var skip = $(`#${dom}-coapp-skip`);
                var address = $(`#${dom}-address`);
                var bureau_ef = $(`#${dom}-bureau-ef`);
                var bureau_tu = $(`#${dom}-bureau-tu`);
                var bureau_xp = $(`#${dom}-bureau-xp`);
                var auto_open = $(`#${dom}-auto-open`);
                var _alert = $(`#${dom}-alert`);
                address.append(() => {
                  var ids = [{
                    val: "#CurrentAddress_faUSA_rbnUnparsed",
                    name: "Single line"
                  }, {
                    val: "#CurrentAddress_faUSA_rbnNormal",
                    name: "Parsed"
                  }, {
                    val: "#CurrentAddress_faUSA_rbnPOBox",
                    name: "PO Box"
                  }, {
                    val: "#CurrentAddress_faUSA_rbnMilitary",
                    name: "Military"
                  }, {
                    val: "#CurrentAddress_faUSA_rbnRRHC",
                    name: "RR\/HC"
                  }, {
                    val: "#CurrentAddress_faUSA_rbnPuertoRico",
                    name: "Puerto Rico"
                  }];
                  for (let i = 0; i < ids.length; i++) {
                    ids[i] = $('<option>').val(ids[i].val).html(ids[i].name);
                  }
                  return ids;
                });
                skip.attr({ checked: pref.skip ?? true });
                address.val(pref.address);
                bureau_ef.attr({ checked: pref.bureau.ef });
                bureau_tu.attr({ checked: pref.bureau.tu });
                bureau_xp.attr({ checked: pref.bureau.xp });
                auto_open.attr({ checked: pref.auto_open });
                _alert.attr({ checked: pref.alert });
                break;
              case "aqua":
                break;
              case "pci":
                break;
              case "sheets":
                break;
            }
            break;
        }

      }
    }
  });
}

function save() {
  storage.get().then(result => {
    var options = result.fewa;
    for (let dom in options) {
      for (let cat in options[dom]) {
        switch (cat) {
          case "page_settings":
            var page = options[dom].page_settings;
            switch (dom) {
              case "cic":
              case "aqua":
              case "pci":
                break;
              case "sheets":
                for (let id in page) {
                  if (!/active/i.test(id)) delete page[id];
                }
                var spreadsheets = $(`.${cat} .${dom} .spreadsheet`);
                for (let a = 0; a < spreadsheets.length; a++) {
                  let ss = spreadsheets.eq(a);
                  let id = ss.attr('id');
                  let name = ss.attr('name');
                  let sheets = ss.children('.sheet');
                  let data = [];
                  for (let b = 0; b < sheets.length; b++) {
                    let sheet = sheets.eq(b);
                    let input = sheet.find('input');
                    data.push({
                      gid: input.attr('id'),
                      name: input.attr('name'),
                      time: input.val()
                    });
                  }
                  page[id] = { name, data };
                }
                break;
            }
            break;
          case "preferences":
            var pref = options[dom].preferences;
            switch (dom) {
              case "cic":
                var skip = $(`#${dom}-coapp-skip`);
                var address = $(`#${dom}-address`);
                var bureauEF = $(`#${dom}-bureau-ef`);
                var bureauTU = $(`#${dom}-bureau-tu`);
                var bureauXP = $(`#${dom}-bureau-xp`);
                var auto_open = $(`#${dom}-auto-open`);
                var _alert = $(`#${dom}-alert`);

                var bureau = {
                  ef: bureauEF.is(':checked:not(:disabled)') ? bureauEF.val() : false,
                  tu: bureauTU.is(':checked:not(:disabled)') ? bureauTU.val() : false,
                  xp: bureauXP.is(':checked:not(:disabled)') ? bureauXP.val() : false
                }

                pref.address = address.attr('value') ? address.val() : (address.is(':checked') ? true : false);
                pref.skip = skip.attr('value') ? skip.val() : (skip.is(':checked') ? true : false);
                pref.alert = _alert.attr('value') ? _alert.val() : (_alert.is(':checked') ? true : false);
                pref.auto_open = auto_open.attr('value') ? auto_open.val() : (auto_open.is(':checked') ? true : false);
                pref.bureau = bureau;
                break;
              case "aqua":
                break;
              case "pci":
                break;
              case "sheets":
                break;
            }
            break;
        }
      }
    }
    storage.set(result).then(() => alert("FEWA Office: Preferences updated"));
  });
}