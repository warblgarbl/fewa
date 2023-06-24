if (!$) {
	var $ = jQuery;
}

$(document).on({
	'focusout': function() {
		var $this = $(this);
		if (!$this.val().trim()) {
			setTimeout(()=>$('#CoBorrower_txtSurName').val(''),0)
		}
	}
}, '#CoBorrower_txtFirstName')
.on({
  'keyup': function(e) {
    var $this = $(this);
    var $first = $('#CoBorrower_txtFirstName');
    var $user = $('#BranchUser_cboUser > option[selected]').html();
    var ids = [
      '#CurrentAddress_faUSA_strUnparsedAutocomplete_txtFullAddress',
      '#CurrentAddress_faUSA_strNormal_txtStrNum',
      '#CurrentAddress_faUSA_strPOBox_txtPOBox_Input',
      '#CurrentAddress_faUSA_strMilitary_ddlDesignation',
      '#CurrentAddress_faUSA_strRRHC_ddlDesignation',
      '#CurrentAddress_faUSA_strPuertoRico_ddlUrbanization'];
    
    if (e.keyCode === 9 && !e.shiftKey && !$first.val()) {
      $(ids.join(', ')).filter(':visible').trigger('focus');
    }
  }
}, '#CoBorrower_txtSurName')
.ready(() => {
	var $users = $('#BranchUser_cboUser > option');
	for (i = 0; i < $users.length; i++) {
		var $this = $($users[i]);
		if (/color/.test($this.attr('style'))) {
			$this.attr('selected', 'selected');
			if ($this.html() === 'TINA PANE') {
				$('#CurrentAddress_faUSA_rbnNormal').trigger('click');
			}
			break;
		}
	}
	$('#UIOptions_tuc_credit').trigger('click');
	$('#Borrower_txtFirstName').trigger('focus');
});