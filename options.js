const storage = chrome.storage.sync;

chrome.runtime.onMessage.addListener(request => {
  if (request.to != 'options') {
    return;
  }
  switch (request.type) {
    case 'default-save':
      $('#save').trigger('click');
      break;
  }
});

$(document).ready(restore)
  .on({
    'click': save
  }, '#save');

function restore() {
  storage.get().then(result => {
    var options = result.fewa;
    for (let key in options) {
      var pref = options[key].preferences;
      switch (key) {
        case 'cic':
          let address = $('#' + key + '-address');
          let alert = $('#' + key + '-alert');
          let auto_open = $('#' + key + '-auto-open');
          address.append(() => {
            let ids = [{
                val: '#CurrentAddress_faUSA_strUnparsedAutocomplete_txtFullAddress',
                name: 'Default'
              },
              {
                val: '#CurrentAddress_faUSA_strNormal_txtStrNum',
                name: 'Parsed'
              },
              {
                val: '#CurrentAddress_faUSA_strPOBox_txtPOBox_Input',
                name: 'PO Box'
              },
              {
                val: '#CurrentAddress_faUSA_strMilitary_ddlDesignation',
                name: 'Military'
              },
              {
                val: '#CurrentAddress_faUSA_strRRHC_ddlDesignation',
                name: 'RR\/HC'
              },
              {
                val: '#CurrentAddress_faUSA_strPuertoRico_ddlUrbanization',
                name: 'Puerto Rico'
              }
            ];
            for (let i = 0; i < ids.length; i++) {
              ids[i] = $('<option>').val(ids[i].val).html(ids[i].name);
            }
            return ids;
          });
          address.val(pref.address ?? address.children().eq(0).val());
          alert.attr({
            checked: pref.alert ?? true
          });
          auto_open.attr({
            checked: pref.auto_open ?? true
          });
          break;
        case 'aqua':
          break;
        case 'pci':
          break;
        case 'sheets':
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
        case 'cic':
          let address = $('#' + key + '-address');
          let alert = $('#' + key + '-alert');
          let auto_open = $('#' + key + '-auto-open');
          pref.address = address.val();
          pref.alert = alert.val();
          pref.auto_open = auto_open.val();
          break;
        case 'aqua':
          break;
        case 'pci':
          break;
        case 'sheets':
          break;
      }
    }
    storage.set(result).then(() => {
      alert('FEWA Office: Preferences saved')
    });
  });
}
