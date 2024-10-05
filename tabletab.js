var input = new URLSearchParams(window.location.search);
var table = input.get('table');
var getTabTableDisplay = browser.storage.sync.get("tabTableDisplay");
getTabTableDisplay.then(loadSettingsTabTableDisplay);

if(table == 'undefined') {
	showError(browser.i18n.getMessage("errorTitle"), browser.i18n.getMessage("errorNoTableGiven"));
} else {
	input.delete('table');
	var url = window.location.toString();
	window.history.replaceState({}, document.title, url.substr(0, url.indexOf("?")));
	document.getElementsByTagName('table')[0].innerHTML = table;
}

// initial load of settings - tab table display
function loadSettingsTabTableDisplay(storage) {
	var tmp = '';
	if(storage.tabTableDisplay)
		tmp = storage.tabTableDisplay[Object.keys(storage.tabTableDisplay)[0]];
	if(tmp == '')
		return;
	var injectCSS = document.createElement('style');
	injectCSS.type = 'text/css';
	injectCSS.textContent = tmp;
	document.getElementsByTagName('head')[0].appendChild(injectCSS);
}

// display error messages
function showError(errorTitle, errorMessage) {
	var dialog = document.createElement('dialog');
	var id = 0;
	while(document.getElementById('tw_err' + id) != null) {
		++id;
	}
	dialog.id = 'tw_err' + id;
	dialog.open = true;
	dialog.classList.add(twAlertDialogClass);
	dialog.innerHTML = '<h3>' + errorTitle + '</h3>\
	<hr>\
	<p>' + errorMessage + '</p>\
	<p style="text-align:center;"><input type="button" style="padding:0.5em;" onclick="document.getElementById(\'tw_err' + id + '\').remove();" value="' + browser.i18n.getMessage("errorButton") + '"></p>';
	document.getElementsByTagName('BODY')[0].insertBefore(dialog, document.getElementsByTagName('BODY')[0].firstChild);
}