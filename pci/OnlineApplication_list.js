if (!$) {
	var $ = jQuery;
}

$(() => {
	var $rows = $('.dataTable > tbody > tr[role=row] > td:nth-child(3)');
	for (i = 0; i < $rows.length; i++) {
		var $this = $($rows[i]);
		var date = new Date($this.html() + ' GMT-0500');
		var time = date.toLocaleTimeString();
		date = date.toLocaleDateString().split('/')
			.map(d => (d.length === 1) ? '0' + d : d).join('/');
		$this.html(date + ' ' + time);
	}
});