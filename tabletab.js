var input = new URLSearchParams(window.location.search);
var table = input.get('table');
if(table == 'undefined') {
	alert(); //TODO
} else {
	input.delete('table');
	var url = window.location.toString();
	window.history.replaceState({}, document.title, url.substr(0, url.indexOf("?")));
	document.getElementsByTagName('table')[0].innerHTML = table;
}