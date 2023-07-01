$(document).ready(() => {
    var $users = $('#BranchUser_cboUser > option');
    for (let i = 0; i < $users.length; i++) {
      var $user = $users.eq(i);
      if (/color/.test($user.attr('style'))) {
        $user.attr({
          selected: ""
        });
        if (/TINA/i.test($user.html())) {
          $('#CurrentAddress_faUSA_rbnNormal').trigger('click');
        }
        break;
      }
    }
    $('#UIOptions_tuc_credit').trigger('click');
    $('#Borrower_txtFirstName').trigger('focus');
  })
  .on({
    focusout: function() {
      var $this = $(this);
      if (!$this.val().trim()) {
        setTimeout(() => $('#CoBorrower_txtSurName').val(''), 0)
      }
    }
  }, '#CoBorrower_txtFirstName')
  .on({
    keyup: function(e) {
      var $this = $(this);
      var $first = $('#CoBorrower_txtFirstName');
      var ids = [
        '#CurrentAddress_faUSA_strUnparsedAutocomplete_txtFullAddress',
        '#CurrentAddress_faUSA_strNormal_txtStrNum',
        '#CurrentAddress_faUSA_strPOBox_txtPOBox_Input',
        '#CurrentAddress_faUSA_strMilitary_ddlDesignation',
        '#CurrentAddress_faUSA_strRRHC_ddlDesignation',
        '#CurrentAddress_faUSA_strPuertoRico_ddlUrbanization'
      ];

      if (e.keyCode === 9 && !e.shiftKey && !$first.val()) {
        $(ids.join(', ')).filter(':visible').trigger('focus');
      }
    }
  }, '#CoBorrower_txtSurName');
