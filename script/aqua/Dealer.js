if (!$) {
	var $ = jQuery;
}

$(document).on({
  'click': function () {
    $('#selectDealerModal div.formField')
      .append($('<div>')
        .append($('<label>').attr({'class': "label label--stacked", 'for': "product"}).html('Product'))
        .append("&nbsp;"))
      .append($('<div>').attr('class', 'selectField--wrapper')
        .append($('<select>').attr({'disabled': "true", 'class': "selectField", 'name': "ProductOrServiceType"})
          .append($('<option>').attr({'value': "", 'class': "selectField-option selectField-option-selected"}).html('Select One'))));
  }
}, '#applications button')
.on({
	'change': function() {
		var $this = $(this);
		var dealID = $this.children('[value="' + $this.val() + '"]').eq(0).html();
    var $prod = $('select[name="ProductOrServiceType"]');
		if (/002306/.test(dealID)) {
			sessionStorage.setItem('dealer', 'Water Treatment');
      $prod.removeAttr('disabled').html(null)
        .append($('<option>').attr({'value': "", 'class': "selectField-option selectField-option-selected"}).html('Select One'))
        .append($('<option>').attr({'value': "AIRPURIFER", 'title': "", 'class': "selectField-option"}).html('Air purifier'))
        .append($('<option>').attr({'value': "WTRHTR", 'title': "", 'class': "selectField-option"}).html('Water heater'))
        .append($('<option>').attr({'value': "WATERTREAT", 'title': "", 'class': "selectField-option"}).html('Water treatment system'))
		} else if (/532306/.test(dealID)) {
			sessionStorage.setItem('dealer', 'Home Improvement');
      $prod.removeAttr('disabled').html(null)
        .append($('<option>').attr({'value': "", 'class': "selectField-option selectField-option-selected"}).html('Select One'))
        .append($('<option>').attr({'value': "AIRPURIFER", 'title': "", 'class': "selectField-option"}).html('Air purifier'))
        .append($('<option>').attr({'value': "BATHSHWR", 'title': "", 'class': "selectField-option"}).html('Bath\/shower\/walk-in tub'))
        .append($('<option>').attr({'value': "HVAC", 'title': "", 'class': "selectField-option"}).html('Heating\/air conditioning'))
        .append($('<option>').attr({'value': "INSULRADBR", 'title': "", 'class': "selectField-option"}).html('Insulation\/radiant barrier'))
        .append($('<option>').attr({'value': "REMODELING", 'title': "", 'class': "selectField-option"}).html('Remodeling\/addition'))
        .append($('<option>').attr({'value': "SOLARFAN", 'title': "", 'class': "selectField-option"}).html('Solar fan'))
        .append($('<option>').attr({'value': "SOLARWTRHT", 'title': "", 'class': "selectField-option"}).html('Solar water heater'))
        .append($('<option>').attr({'value': "WTRHTR", 'title': "", 'class': "selectField-option"}).html('Water heater'))
		} else {
      $prod.attr({'disabled': ""});
    }
    setTimeout(()=>{$('#selectDealerModal .button--primary').attr({'disabled': ""})},0);
	}
}, '#selectDealerModal .selectField[name="dealers"]')
.on({
  'change': function() {
    var $this = $(this);
    var $that = $('#selectDealerModal .button--primary')
    if ($this.val().length) {
      $that.removeAttr('disabled');
    } else {
      $that.attr({'disabled': ""});
    }
  }
}, '.selectField[name="ProductOrServiceType"]');