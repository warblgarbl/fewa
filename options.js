const storage = chrome.storage.sync;
chrome.runtime.onMessage.addListener(request => {
  if (request.to != "options") return;
  switch (request.type) {
    case "default-save":
      $('#save').trigger('click');
      break;
  }
});
$(document).ready(restore).ready(() => {
  chrome.runtime.sendMessage({
    to: "background",
    type: "ready"
  })
}).on({
  click: save
}, '#save');

function restore() {
  storage.get().then(result => {
    var options = result.fewa;
    for (let key in options) {
      var pref = options[key].preferences;
      switch (key) {
        case "cic":
          let skip = $(`#${key}-coapp-skip`);
          let address = $(`#${key}-address`);
          let bureau_ef = $(`#${key}-bureau-ef`);
          let bureau_tu = $(`#${key}-bureau-tu`);
          let bureau_xp = $(`#${key}-bureau-xp`);
          let auto_open = $(`#${key}-auto-open`);
          let alert = $(`#${key}-alert`);
          address.append(() => {
            let ids = [{
              val: "#CurrentAddress_faUSA_rbnUnparsed",
              name: "Default"
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
          alert.attr({ checked: pref.alert });
          break;
        case "aqua":
          break;
        case "pci":
          break;
        case "sheets":
          break;
      }
    }
  });
}

function save() {
  storage.get().then(result => {
    var options = result.fewa;
    for (let key in options) {
      var pref = options[key].preferences;
      switch (key) {
        case "cic":
          let address = $(`#${key}-address`);
          let jump = $(`#${key}-address-jump`);
          let alert = $(`#${key}-alert`);
          let auto_open = $(`#${key}-auto-open`);
          let bureauEF = $(`#${key}-bureau-ef`);
          let bureauTU = $(`#${key}-bureau-tu`);
          let bureauXP = $(`#${key}-bureau-xp`);
          let bureau = {
            ef: bureauEF.is(':checked:not(:disabled)') ? bureauEF.val() : false,
            tu: bureauTU.is(':checked:not(:disabled)') ? bureauTU.val() : false,
            xp: bureauXP.is(':checked:not(:disabled)') ? bureauXP.val() : false
          }
          pref.address = address.val();
          pref.address_jump = jump.val();
          pref.alert = alert.val();
          pref.auto_open = auto_open.val();
          pref.bureau = bureau;
          break;
        case "aqua":
          break;
        case "pci":
          break;
        case "sheets":
          break;
      }
    }
    storage.set(result).then(() => alert("FEWA Office: Preferences saved"));
  });
}