if (!$) {
	var $ = jQuery;
}

function fewaUpdate() {
	var valM = Number($('#fewaMonth').val());
	var valY = Number($('#fewaYear').val());
	var $month = $('select[name="employmentStartDatemonth"]');
	var $year = $('select[name="employmentStartDateyear"]');
	var today = new Date();
	today.setDate(1);
	if (valM >= 0 && valY >= 0 || valY > 0) {
		today.setFullYear(today.getFullYear() - valY);
		today.setMonth(today.getMonth() - valM);
		valM = today.getMonth() + 1;
		if (valM.toString().length === 1) {
			valM = '0' + valM;
		}
		$('#fewaTimeEst').html(valM + ' ' + today.getFullYear());
	}
};

$(document).on({
	'change': function() {
		var $this = $(this);
		var siblings = $($this.parents('#Employment')).children();
		if (!/(?<!un)employed/i.test($this.val())) {
			return $('#fewaTime').hide();
		} else if ($('#fewaTime').length) {
			setTimeout(() => {$('div.formField--employmentStartDate').parent().before($('#fewaTime').show())}, 25);
		} else {
			var $fewaTime = $('<div id="fewaTime">');
			var $fewaYearLabel = $('<label class="label" for="fewaYear">');
			var $fewaYear = $('<input type="number" id="fewaYear" min="0" max="80" style="width:2rem;height:1rem">');
			var $fewaMonthLabel = $('<label class="label" for="fewaMonth">');
			var $fewaMonth = $('<input type="number" id="fewaMonth" min="0" max="11" style="width:2rem;height:1rem">');
			var $fewaTimeEstLabel = $('<div class="label">');
			var $fewaTimeEst = $('<div id="fewaTimeEst">');
			var $div = $('<div>');
			var $br = $('<br>');
			$fewaYearLabel.html('Years: ');
			$fewaMonthLabel.html(' Months: ');
			$fewaTimeEstLabel.html('Suggested start date:');
			$div.html($fewaYearLabel);
			$fewaYearLabel.after($fewaYear);
			$fewaYear.after($fewaMonthLabel);
			$fewaMonthLabel.after($fewaMonth);
			$fewaTime.html($div);
			$div.after($br);
			$div = $('<div class="formField">');
			$div.html($fewaTimeEstLabel);
			$fewaTimeEstLabel.after($fewaTimeEst);
			$br.after($div);
			$fewaTime.attr('style','background-color:oldlace');
			setTimeout(() => $('div.formField--employmentStartDate').parent().before($fewaTime), 25);
		}
	}
}, 'select[name="EmploymentType"]')
.on({'change': fewaUpdate}, '#fewaMonth')
.on({'change': fewaUpdate}, '#fewaYear')
.ready(() => {
	var header = $('h1.heading--1');
	setTimeout(() => header.html(header.html() + ' - ' + sessionStorage.getItem('dealer')), 25);
});