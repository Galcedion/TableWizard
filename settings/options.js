document.getElementById('l_set_color').innerHTML = browser.i18n.getMessage('optionsLabelHighlightColor');
document.getElementById('l_set_ignoreHTML').innerHTML = browser.i18n.getMessage('optionsLabelIgnoreHTML');
document.getElementById('l_set_tabtable').innerHTML = browser.i18n.getMessage('optionsLabelTabTableDisplay');
document.getElementById('button_save').value = browser.i18n.getMessage('optionsSave');
document.getElementById('button_reset').value = browser.i18n.getMessage('optionsReset');
const colorRegex = /^#[0-9a-f]{3,8}$/;
var getHightlightColor = browser.storage.sync.get("highlightColor");
getHightlightColor.then(loadSettingsHighlightColor);
var getIgnoreHTML = browser.storage.sync.get("ignoreHTML");
getIgnoreHTML.then(loadSettingsIgnoreHTML);
var getTabTableDisplay = browser.storage.sync.get("tabTableDisplay");
getTabTableDisplay.then(loadSettingsTabTableDisplay);

// setting default values
var defaultHighlightColor = browser.i18n.getMessage('optionsDefaultHighlightColor');
var defaultIgnoreHTML = true;
var defaultTabTableDisplay = {
	0: '',
	1: 'table {border-collapse: collapse; margin-left: auto; margin-right: auto; text-align: center; }\
	table, th, td {border: 1px black solid; }',
	2: 'table {border-collapse: collapse; margin-left: auto; margin-right: auto; text-align: center; }\
	table, th, td {border: 1px black solid; }\
	th {background-color: darkgray; }\
	tr:nth-child(odd) {background-color: lightgray; }\
	th, td {padding: 0.25em 0; }',
}

// setting event listeners
document.getElementById('set_color').addEventListener('keyup', updateColor);
document.getElementById('button_save').addEventListener('click', saveSettings);
document.getElementById('button_reset').addEventListener('click', resetSettings);

// initial load of settings - highlighting color
function loadSettingsHighlightColor(storage) {
	var tmp = defaultHighlightColor;
	if(storage.highlightColor)
		tmp = storage.highlightColor;
	document.getElementById('set_color').value = tmp;
	updateColor();
}

// initial load of settings - ignore HTML
function loadSettingsIgnoreHTML(storage) {
	var tmp = defaultIgnoreHTML;
	if(typeof storage.ignoreHTML != 'undefined')
		tmp = storage.ignoreHTML;
	document.getElementById('set_ignoreHTML').checked = tmp;
}

// initial load of settings - tab table display
function loadSettingsTabTableDisplay(storage) {
	var select = document.getElementById('set_tabtable');
	for(k in Object.keys(defaultTabTableDisplay)) {
		var option = document.createElement('option');
		option.value = k;
		option.innerHTML = browser.i18n.getMessage('optionsLabelTabTableDisplay-' + k.toString());
		select.appendChild(option);
	}
	var tmp = {0: defaultTabTableDisplay[0]};
	if(storage.tabTableDisplay)
		tmp = storage.tabTableDisplay;
	document.getElementById('set_tabtable').value = Object.keys(tmp)[0];
}

// save all settings
function saveSettings() {
	var selectedColor = document.getElementById('set_color').value.toLowerCase();
	if(!colorRegex.test(selectedColor)) {
		return;
	}
	var selectedIgnoreHTML = document.getElementById('set_ignoreHTML').checked;
	var TTDObj = {};
	var selectedTabTableDisplay = parseInt(document.getElementById('set_tabtable').value);
	TTDObj[selectedTabTableDisplay] = defaultTabTableDisplay[selectedTabTableDisplay];
	browser.storage.sync.set({
		highlightColor: selectedColor,
		ignoreHTML: selectedIgnoreHTML,
		tabTableDisplay: TTDObj
	});
}

// reset all settings to default (provided by lang)
function resetSettings() {
	document.getElementById('set_color').value = defaultHighlightColor;
	document.getElementById('set_ignoreHTML').checked = true;
	document.getElementById('set_tabtable').value = 0;
	saveSettings()
	updateColor();
}

// update the color preview and check input for Hex-conformity
function updateColor() {
	var setColor = document.getElementById('set_color');
	var selectedColor = setColor.value.toLowerCase();
	if(selectedColor.charAt(0) != '#') {
		selectedColor = '#' + selectedColor;
		setColor.value = selectedColor;
	}
	if(!colorRegex.test(selectedColor)) {
		setColor.classList.add('incomplete');
	} else {
		document.getElementById('display_color').style.backgroundColor = selectedColor;
		setColor.classList.remove('incomplete');
	}
}