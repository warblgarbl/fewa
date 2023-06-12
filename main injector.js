var url = document.URL;
var min = 'min';
var src = 'https://warblgarbl.github.io/fewa/' + (min ? 'min/' : 'script/');
var ext = (min ? '.' + min : '') + '.js';

if (/.*cic\.meridianlink\.com.*/.test(url)) {
	src += 'cic\/';
	if (/.*ClientConsumer\.aspx/.test(url)) {
		src += 'Form' + ext;
	} else if (/.*reports\/print_htm\.aspx/.test(url)) {
		src += 'Report' + ext;
	}
} else if (/.*portal\.aquafinance\.com.*/.test(url)) {
	src += 'aqua\/';
	if (/.*applications\/?$/.test(url)) {
		src += 'Dealer' + ext;
	} else if (/.*applications\/new/.test(url)) {
		src += 'NewApplication' + ext;
	}
}

if (/\.js/.test(src)) {
	if (!/jquery/i.test(document.getElementsByTagName("html")[0].innerHTML)) {
		console.info('Adding jQuery 3.7.0)');
		var jq_ = document.createElement("script");
		jq_.setAttribute("type", "text/javascript");
		jq_.setAttribute("src", "https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js");
		document.head.appendChild(jq_);
	}
	
	var js_ = document.createElement("script");
	js_.setAttribute("type", "text/javascript");
	js_.setAttribute("src", src);
	document.head.appendChild(js_);
}