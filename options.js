const storage = chrome.storage.sync;
chrome.runtime.onMessage.addListener(request => {
  if (request.to != "options")
    return;
  switch (request.type) {}
});
$(document).ready(() => {
  restore();
  $('.buttons').buttonset();
  $('#save, #undo, #default, #temp, #cic, #aqua, #pci, #sheets').button();
  $('#cic, #preferences').trigger('click');
}).on({
  click: save
}, "#save").on({
  click: restore
}, "#undo").on({
  click: function () {
    chrome.runtime.sendMessage({
      to: "background",
      type: "defaultStorage"
    }, restore);
  }
}, "#default").on({
  click: function () {
    storage.get().then(result => {
      var page = result.page_settings;
      for (let dom in page) {
        for (let key in page[dom]) {
          switch (key) {
            default:
              page[dom][key] = undefined;
              break;
            case "active":
              page[dom][key] = {};
              break;
          }
        }
      }
      storage.set(result);
      restore();
    });
  }
}, "#temp").on({
  click: function () {
    var $this = $(this);
    $this.addClass('activated');
    $this.siblings().removeClass('activated');
    $('.preferences fieldset, .page_settings fieldset').hide();
    $('.cic').show();
    buttons('.cic');
    format('.cic');
  }
}, '#cic').on({
  click: function () {
    var $this = $(this);
    $this.addClass('activated');
    $this.siblings().removeClass('activated');
    $('.preferences fieldset, .page_settings fieldset').hide();
    $('.aqua').show();
    buttons('.aqua');
    format('.aqua');
  }
}, '#aqua').on({
  click: function () {
    var $this = $(this);
    $this.addClass('activated');
    $this.siblings().removeClass('activated');
    $('.preferences fieldset, .page_settings fieldset').hide();
    $('.pci').show();
    buttons('.pci');
    format('.pci');
  }
}, '#pci').on({
  click: function () {
    var $this = $(this);
    $this.addClass('activated');
    $this.siblings().removeClass('activated');
    $('.preferences fieldset, .page_settings fieldset').hide();
    $('.sheets').show();
    buttons('.sheets');
    format('.sheets');
  }
}, '#sheets').on({
  click: function () {
    var $this = $(this);
    $this.addClass('activated');
    $this.siblings().removeClass('activated');
    $('.preferences').show();
    $('.page_settings').hide();
    format("." + $('.dom.buttons button.activated').attr('id'));
  }
}, '#preferences').on({
  click: function () {
    var $this = $(this);
    $this.addClass('activated');
    $this.siblings().removeClass('activated');
    $('.page_settings').show();
    $('.preferences').hide();
    format("." + $('.dom.buttons button.activated').attr('id'));
  }
}, '#page_settings').on({
  click: function () {
    var $this = $(this);
    var $delay = $('div[for="cic-auto-open-delay"]');
    if ($this.is(':checked')) {
      $delay.show();
    } else {
      $delay.hide();
    }
  }
}, "#cic-auto-open").on({
  "change keydown keyup": function (e) {
    var $this = $(this);
    var $val = $this.val();
    var $parent = $this.parents(".spreadsheet");
    var $max = parseInt($this.attr("max"));
    var $min = parseInt($this.attr("min"));
    switch ($val.length) {
      case 0:
        $this.addClass("empty");
        break;
      case $max.toString().length:
        $this.val(parseInt($val.substring(0, 3)));
      default:
        $val = parseInt($this.val());
        if ($val > $max)
          $this.val($max);
        else if ($val < $min && !/key/.test(e.type))
          $this.val($min);
        $this.removeClass("empty");
        break;
    }
  }
}, 'input[type="number"]');

function restore() {
  storage.get().then(result => {
    var page = result.page_settings;
    var pref = result.preferences;
    for (let dom in page) {
      switch (dom) {
        case "sheets":
          $(`.page_settings .${dom}`).empty().append(() => {
            var array = [];
            for (let id in page[dom]) {
              if (id.length === 44) {
                var ss = $("<div>").addClass("spreadsheet").attr({ id, name: page[dom][id].name });
                var $name = $("<h4>").addClass("name").html(page[dom][id].name);
                var $list = $("<ol>").addClass("list");
                ss.append($name, $list);
                $list.sortable({
                  axis: "y",
                  containment: "parent",
                  revert: true,
                  stop: function (e, ui) {
                    var $sort = ui.item.parent().children(':not(.ui-sortable-helper)');
                    var $place = ui.item.parent().children('.ui-sortable-placeholder');
                    var $help = ui.item.parent().children('.ui-sortable-helper');
                    for (let i = 0; i < $sort.length; i++) {
                      $sort.eq(i).find('.order').html(i + 1);
                    }
                    $help.find('.order').html($sort.index($place) + 1);
                  },
                  tolerance: "pointer"
                }).on('sort', $list.sortable('option', 'stop'))

                for (let i = 0; i < page[dom][id].data.length; i++) {
                  let sheet = page[dom][id].data[i];
                  $list.append(
                    $("<li>").addClass("sheet").append(
                      $("<div>").addClass("order"),
                      $("<input>").attr({
                        id: sheet.gid,
                        name: sheet.name,
                        type: "number",
                        min: 5,
                        max: 300,
                        placeholder: "300"
                      }).val(sheet.time),
                      $('<label>').html("s"),
                      $("<div>").addClass("label").append(
                        $("<div>").addClass("sheet-name").html(sheet.name),
                        $("<div>").addClass("gid").html("gid: " + sheet.gid))));
                }
                array.push(ss);
              }
            }
            return array;
          });
          break;
      }
    }
    for (let dom in pref) {
      switch (dom) {
        case "cic":
          var skip = $(`#${dom}-coapp-skip`);
          var address = $(`#${dom}-address`);
          var bureau_ef = $(`#${dom}-bureau-ef`);
          var bureau_tu = $(`#${dom}-bureau-tu`);
          var bureau_xp = $(`#${dom}-bureau-xp`);
          var auto_open = $(`#${dom}-auto-open`);
          var auto_open_delay = $(`#${dom}-auto-open-delay`);
          var markup = $(`#${dom}-markup`);
          var _alert = $(`#${dom}-alert`);
          address.empty().append(() => {
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
              name: "RR/HC"
            }, {
              val: "#CurrentAddress_faUSA_rbnPuertoRico",
              name: "Puerto Rico"
            }];
            for (let i = 0; i < ids.length; i++) {
              ids[i] = $("<option>").val(ids[i].val).html(ids[i].name);
            }
            return ids;
          });

          skip.prop({ checked: pref[dom].skip });
          address.val(pref[dom].address);
          bureau_ef.prop({ checked: pref[dom].bureau.ef });
          bureau_tu.prop({ checked: pref[dom].bureau.tu });
          bureau_xp.prop({ checked: pref[dom].bureau.xp });
          auto_open.prop({ checked: pref[dom].auto_open });
          auto_open_delay.val(pref[dom].auto_open_delay);
          markup.prop({ checked: pref[dom].markup });
          _alert.prop({ checked: pref[dom].alert });
          break;
        case "aqua":
          var time = $(`#${dom}-time`);

          time.prop({ checked: pref[dom].time });
          break;
        case "pci":
          var time = $(`#${dom}-time`);
          var decCode = $(`#${dom}-dec-code`);
          var report = $(`#${dom}-report`);

          time.prop({ checked: pref[dom].time });
          decCode.prop({ checked: pref[dom].decCode });
          report.prop({ checked: pref[dom].report });
          break;
      }
    }
  });
}

function save() {
  storage.get().then(result => {
    var page = result.page_settings;
    var pref = result.preferences;
    for (let dom in page) {
      switch (dom) {
        case "sheets":
          for (let id in page[dom]) {
            if (!/active/i.test(id))
              delete page[dom][id];
          }
          var spreadsheets = $(`.page_settings .${dom} .spreadsheet`);
          for (let a = 0; a < spreadsheets.length; a++) {
            let ss = spreadsheets.eq(a);
            let id = ss.attr("id");
            let name = ss.attr("name");
            let sheets = ss.find(".sheet");
            let data = [];
            for (let b = 0; b < sheets.length; b++) {
              let sheet = sheets.eq(b);
              let input = sheet.find("input");
              data.push({ gid: input.attr("id"), name: input.attr("name"), time: input.val() });
            }
            page[dom][id] = {
              name,
              data
            };
          }
          break;
      }
    }
    for (let dom in pref) {
      switch (dom) {
        case "cic":
          var skip = $(`#${dom}-coapp-skip`);
          var address = $(`#${dom}-address`);
          var bureauEF = $(`#${dom}-bureau-ef`);
          var bureauTU = $(`#${dom}-bureau-tu`);
          var bureauXP = $(`#${dom}-bureau-xp`);
          var auto_open = $(`#${dom}-auto-open`);
          var auto_open_delay = $(`#${dom}-auto-open-delay`);
          var _alert = $(`#${dom}-alert`);

          pref[dom].skip = skip.is(":checked");
          pref[dom].address = address.val();
          pref[dom].bureau = {
            ef: bureauEF.is(":checked:not(:disabled)") ?
              bureauEF.val() : false,
            tu: bureauTU.is(":checked:not(:disabled)") ?
              bureauTU.val() : false,
            xp: bureauXP.is(":checked:not(:disabled)") ?
              bureauXP.val() : false
          }
          pref[dom].auto_open = auto_open.is(":checked");
          pref[dom].auto_open_delay = auto_open_delay.val();
          pref[dom].alert = _alert.is(":checked");
          break;
        case "aqua":
          var time = $(`#${dom}-time`);

          pref.time = time.is(":checked");
          break;
        case "pci":
          var time = $(`#${dom}-time`);
          var decCode = $(`#${dom}-dec-code`);
          var report = $(`#${dom}-report`);

          pref[dom].time = time.is(":checked");
          pref[dom].decCode = decCode.is(":checked");
          pref[dom].report = report.is(":checked");
          break;
        case "sheets":
          break;
      }
    }
    storage.set(result).then(() => alert("Preferences updated"));
  });
}

function buttons(dom) {
  if ($(`.preferences fieldset${dom} > div`).length) {
    $('#preferences').button('option', 'disabled', false);
    if ($('#preferences').hasClass('activated'))
      $('.preferences').show();
  } else {
    $('#preferences').button('option', 'disabled', true);
    if ($('#preferences').hasClass('activated'))
      $('.preferences').hide();
  }
  if ($(`.page_settings fieldset${dom} > div`).length) {
    $('#page_settings').button('option', 'disabled', false);
    if ($('#page_settings').hasClass('activated'))
      $('.page_settings').show();
  } else {
    $('#page_settings').button('option', 'disabled', true);
    if ($('#page_settings').hasClass('activated'))
      $('.page_settings').hide();
  }
}

function format(dom) {
  $('input[type="number"]').triggerHandler('change');
  switch ($('.cat.buttons button.activated').attr('id')) {
    case "preferences":
      $('#cic-auto-open').triggerHandler('click');
      break;
    case "page_settings":
      let $sort = $(dom + " " + '.ui-sortable');
      for (let i = 0; i < $sort.length; i++) {
        let sort = $sort.eq(i);
        sort.trigger('sort', { item: sort.children().eq(0) });
        sort.width(sort.width());
      }
      break;
  }
}