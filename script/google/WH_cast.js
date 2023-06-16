if (!$) {
	var $ = jQuery;
} else if (typeof $.jquery == undefined) {
	console.log('$ occupied');
}

function daily() {
	var $rep $('span').filter((i,e) => e.innerHTML == 'Reps');
	$rep.click();
}

$(document).ready(() => {
	setTimeout(daily, 1000 * 60 * 5)
});