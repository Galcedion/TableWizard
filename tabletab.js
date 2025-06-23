var input = new URLSearchParams(window.location.search);
var table = input.get('table');
var grid = input.get('grid');
var getTabTableDisplay = browser.storage.sync.get("tabTableDisplay");
getTabTableDisplay.then(loadSettingsTabTableDisplay);
var getHightlightColor = browser.storage.sync.get("highlightColor");
getHightlightColor.then(loadSettingsHighlightColor);

if(table === null || table == 'undefined') {
	showError(browser.i18n.getMessage("errorTitle"), browser.i18n.getMessage("errorNoTableGiven"));
} else {
	input.delete('table');
	var url = window.location.toString();
	window.history.replaceState({}, document.title, url.substr(0, url.indexOf("?")));
	document.getElementsByTagName('table')[0].innerHTML = table;
	document.getElementsByTagName('table')[0].querySelectorAll('[class^=tw_hidden]').forEach((elem) => {
		elem.remove();
	});
	document.getElementsByTagName('table')[0].querySelectorAll('[class^=tw_highlight]').forEach((elem) => {
		elem.classList.add('tw_highlight');
	});
	if(grid !== 'null' && grid !== 'undefined' && grid == 'true') {
		document.getElementsByTagName('table')[0].classList.add('tw_grid');
	}
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

// initial load of settings - highlighting color
function loadSettingsHighlightColor(storage) {
	var tmp = browser.i18n.getMessage('optionsDefaultHighlightColor');
	if(storage.highlightColor)
		tmp = storage.highlightColor;
	var injectCSS = document.createElement('style');
	injectCSS.type = 'text/css';
	injectCSS.textContent = '.tw_highlight{background-color: ' + tmp + ' !important; }\
	.tw_grid tr:nth-child(even),.tw_grid td:nth-child(even) {background-color: #AAA5; }';
	document.getElementsByTagName('head')[0].appendChild(injectCSS);
}

// display error messages
function showError(errorTitle, errorMessage) {
	var dialog = document.createElement('dialog');
	var id = 0;
	dialog.open = true;
	dialog.style.position = "fixed";
	dialog.style.top = "calc(50% - 5em)";
	dialog.style.padding = "0.5em 1em";
	dialog.style.width = "20em";
	dialog.style.background = "white";
	dialog.style.border = "0";
	dialog.style.borderRadius = "1em";
	dialog.style.boxShadow = "inset 0 0 0.5em 0.5em crimson";
	dialog.innerHTML = '<h3>' + errorTitle + '</h3>\
	<hr>\
	<p>' + errorMessage + '</p>';
	document.getElementsByTagName('BODY')[0].insertBefore(dialog, document.getElementsByTagName('BODY')[0].firstChild);
}