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
		if (!/(?<!un)employed/i.test($this.val())) {
			return $('#fewaTime').hide();
		} else if ($('#fewaTime').length) {
      setTimeout(() => {
				var $emp = $('div.formField--employmentStartDate').filter(':visible');
				if ($emp.length) {
					$emp.parent().before($('#fewaTime').show());
				}
      }, 0);
		} else {
			var $fewaTime = $('<div>').attr({
				'id': "fewaTime",
				'style': "background-color:oldlace"
			});
			var $labelEst = $('<div>').html('Suggested start date:').attr({
				'class': "label"
			});
			var $labelY = $('<label>').html('Years:').attr({
				'class': "label",
				'for': "fewaYear"
			});
			var $labelM = $('<label>').html('Months:').attr({
				'class': "label",
				'for': "fewaMonth"
			});
			var $year = $('<input>').attr({
				'type': "number",
				'id': "fewaYear",
				'min': "0",
				'max': "80",
				'style': "width:2rem;height:1rem;margin-left:1rem;margin-right:1rem;"
			});
			var $month = $('<input>').attr({
				'type': "number",
				'id': "fewaMonth",
				'min': "0",
				'max': "11",
				'style': "width:2rem;height:1rem;margin-left:1rem;margin-right:1rem;"
			});
			var $est = $('<div>').attr({
				'id': "fewaTimeEst"
			});
			$fewaTime.append($('<div>').append($labelY, $year, $labelM, $month))
				.append($('<br>'))
				.append($('<div>').attr('class', "formField")
					.append($labelEst, $est));
      setTimeout(() => {
				let $emp = $('div.formField--employmentStartDate').filter(':visible');
				if ($emp.length) {
					$emp.parent().before($fewaTime.show());
				}
       }, 0);
		}
	}
}, 'select[name="EmploymentType"]')
.on({'change keyup': fewaUpdate}, '#fewaMonth')
.on({'change keyup': fewaUpdate}, '#fewaYear')
.on('keydown.h click.h scroll.h mousemove.h', function() {
	var $head = $('h1.heading--1');
	var $html = $head.html();
	var regex = new RegExp(sessionStorage.getItem('dealer'));
	if ($head && !regex.test($html)) {
		$head.html($html + ' - ' + regex.source)
	}
	$(document).off('.h');
});