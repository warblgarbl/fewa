const storage = chrome.storage.sync;

$(document).ready(() => {
  var $users = $('#BranchUser_cboUser > option');
  for (let i = 0; i < $users.length; i++) {
    var $user = $users.eq(i);
    if (/color/.test($user.attr('style'))) {
      $user.attr({ selected: "" });
      break;
    }
  }
  storage.get().then(result => {
    let pref = result.fewa.preferences.cic;
    $(pref.address).trigger('click');
    if (pref.skip)
      skipCoapp();
    $('#Borrower_txtFirstName').trigger('focus');
  });
}).on({
  focusout: function () {
    var $this = $(this);
    if (!$this.val().trim())
      setTimeout(() => $('#CoBorrower_txtSurName').val(""), 0);
  }
}, '#CoBorrower_txtFirstName').one({
  focus: function () {
    var $this = $(this);
    storage.get().then(result => {
      let pref = result.fewa.preferences.cic;
      for (let key in pref.bureau) {
        if (pref.bureau[key])
          $(pref.bureau[key] + ':not(:checked)').trigger('click');
      }
    });
  }
}, '#CoBorrower_txtSurName');

function skipCoapp() {
  $(document).on({
    keyup: function (e) {
      var $this = $(this);
      var $first = $('#CoBorrower_txtFirstName');
      var ids = [
        "#CurrentAddress_faUSA_strUnparsedAutocomplete_txtFullAddress",
        "#CurrentAddress_faUSA_strNormal_txtStrNum",
        "#CurrentAddress_faUSA_strPOBox_txtPOBox_Input",
        "#CurrentAddress_faUSA_strMilitary_ddlDesignation",
        "#CurrentAddress_faUSA_strRRHC_ddlDesignation",
        "#CurrentAddress_faUSA_strPuertoRico_ddlUrbanization"
      ];

      if (e.keyCode === 9 && !e.shiftKey && !$first.val()) {
        $(ids.join(", ")).filter(':visible').trigger('focus');
      }
    }
  }, '#CoBorrower_txtSurName');
}