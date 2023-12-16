const storage = chrome.storage.sync;
const addressIDs = [
  "#CurrentAddress_faUSA_strUnparsedAutocomplete_txtFullAddress",
  "#CurrentAddress_faUSA_strNormal_txtStrNum",
  "#CurrentAddress_faUSA_strPOBox_txtPOBox_Input",
  "#CurrentAddress_faUSA_strMilitary_ddlDesignation",
  "#CurrentAddress_faUSA_strRRHC_ddlDesignation",
  "#CurrentAddress_faUSA_strPuertoRico_ddlUrbanization"
];

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
    let pref = result.preferences.cic;
    if (pref.skip)
      skipCoapp();
    $(pref.address).trigger('click');
  });
}).on({
  focus: function () {
    if ($('#Borrower_txtFirstName').val().length === 0)
      $('#Borrower_txtFirstName').trigger('focus');
  }
}, '#btnOrder').on({
  focusout: function () {
    var $this = $(this);
    if (!$this.val().trim())
      setTimeout(() => $('#CoBorrower_txtSurName').val(""), 0);
  }
}, '#CoBorrower_txtFirstName').one({
  focus: function () {
    var $this = $(this);
    storage.get().then(result => {
      var pref = result.preferences.cic;
      for (let key in pref.bureau)
        if (pref.bureau[key])
          $(pref.bureau[key] + ':not(:checked)').trigger('click');
    });
  }
}, addressIDs.join(", "));

function skipCoapp() {
  $(document).on({
    keyup: function (e) {
      var $first = $('#CoBorrower_txtFirstName');
      if (e.keyCode === 9 && !e.shiftKey && !$first.val())
        $(addressIDs.join(", ")).filter(':visible').trigger('focus');
    }
  }, '#CoBorrower_txtSurName');
}