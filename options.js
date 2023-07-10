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
      var options = result.fewa;
      for (let dom in options) {
        var page = options[dom].page_settings;
        for (let key in page) {
          switch (key) {
            case "active":
              page[key] = {};
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
    format('.cic');
  }
}, '#cic').on({
  click: function () {
    var $this = $(this);
    $this.addClass('activated');
    $this.siblings().removeClass('activated');
    $('.preferences fieldset, .page_settings fieldset').hide();
    $('.aqua').show();
    format('.aqua');
  }
}, '#aqua').on({
  click: function () {
    var $this = $(this);
    $this.addClass('activated');
    $this.siblings().removeClass('activated');
    $('.preferences fieldset, .page_settings fieldset').hide();
    $('.pci').show();
    format('.pci');
  }
}, '#pci').on({
  click: function () {
    var $this = $(this);
    $this.addClass('activated');
    $this.siblings().removeClass('activated');
    $('.preferences fieldset, .page_settings fieldset').hide();
    $('.sheets').show();
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
                $(`.${cat} .${dom}`).empty().append(() => {
                  var array = [];
                  for (let id in page) {
                    if (id.length === 44) {
                      var ss = $("<div>").addClass("spreadsheet").attr({ id, name: page[id].name });
                      var $name = $("<h4>").addClass("name").html(page[id].name);
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

                      for (let i = 0; i < page[id].data.length; i++) {
                        let sheet = page[id].data[i];
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

                skip.prop({ checked: pref.skip });
                address.val(pref.address);
                bureau_ef.prop({ checked: pref.bureau.ef });
                bureau_tu.prop({ checked: pref.bureau.tu });
                bureau_xp.prop({ checked: pref.bureau.xp });
                auto_open.prop({ checked: pref.auto_open });
                auto_open_delay.val(pref.auto_open_delay);
                markup.prop({ checked: pref.markup });
                _alert.prop({ checked: pref.alert });
                break;
              case "aqua":
                var time = $(`#${dom}-time`);

                time.prop({ checked: pref.time });
                break;
              case "pci":
                var time = $(`#${dom}-time`);
                var decCode = $(`#${dom}-dec-code`);
                var report = $(`#${dom}-report`);

                time.prop({ checked: pref.time });
                decCode.prop({ checked: pref.decCode });
                report.prop({ checked: pref.report });
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
                  if (!/active/i.test(id))
                    delete page[id];
                }
                var spreadsheets = $(`.${cat} .${dom} .spreadsheet`);
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
                  page[id] = {
                    name,
                    data
                  };
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
                var auto_open_delay = $(`#${dom}-auto-open-delay`);
                var _alert = $(`#${dom}-alert`);

                pref.skip = skip.is(":checked");
                pref.address = address.val();
                pref.bureau = {
                  ef: bureauEF.is(":checked:not(:disabled)") ?
                    bureauEF.val() : false,
                  tu: bureauTU.is(":checked:not(:disabled)") ?
                    bureauTU.val() : false,
                  xp: bureauXP.is(":checked:not(:disabled)") ?
                    bureauXP.val() : false
                }
                pref.auto_open = auto_open.is(":checked");
                pref.auto_open_delay = auto_open_delay.val();
                pref.alert = _alert.is(":checked");
                break;
              case "aqua":
                var time = $(`#${dom}-time`);

                pref.time = time.is(":checked");
                break;
              case "pci":
                var time = $(`#${dom}-time`);
                var decCode = $(`#${dom}-dec-code`);
                var report = $(`#${dom}-report`);

                pref.time = time.is(":checked");
                pref.decCode = decCode.is(":checked");
                pref.report = report.is(":checked");
                break;
              case "sheets":
                break;
            }
            break;
        }
      }
    }
    storage.set(result).then(() => alert("Preferences updated"));
  });
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