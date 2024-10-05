document.getElementById('l_set_color').textContent = browser.i18n.getMessage('optionsLabelHighlightColor');
document.getElementById('l_set_ignoreHTML').textContent = browser.i18n.getMessage('optionsLabelIgnoreHTML');
document.getElementById('l_set_tabtable').textContent = browser.i18n.getMessage('optionsLabelTabTableDisplay');
document.getElementById('l_set_selectedinclude').textContent = browser.i18n.getMessage('optionsLabelSelectedInclude');
document.getElementById('button_save').value = browser.i18n.getMessage('optionsSave');
document.getElementById('button_reset').value = browser.i18n.getMessage('optionsReset');
const colorArrayFF = [
	'aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure',
	'beige', 'bisque', 'black', 'blanchedalmond', 'blue', 'blueviolet', 'brown', 'burlywood',
	'cadetblue', 'chartreuse', 'chocolate', 'coral', 'cornflowerblue', 'cornsilk', 'crimson', 'cyan',
	'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgreen', 'darkgrey', 'darkkhaki', 'darkmagenta', 'darkolivegreen', 'darkorange', 'darkorchid', 'darkred', 'darksalmon', 'darkseagreen', 'darkslateblue', 'darkslategray', 'darkslategrey', 'darkturquoise', 'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 'dimgrey', 'dodgerblue',
	'firebrick', 'floralwhite', 'forestgreen', 'fuchsia',
	'gainsboro', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'greenyellow', 'grey',
	'honeydew', 'hotpink',
	'indianred', 'indigo', 'ivory',
	'khaki',
	'lavender', 'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral', 'lightcyan', 'lightgoldenrodyellow', 'lightgray', 'lightgreen', 'lightgrey', 'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslategray', 'lightslategrey', 'lightsteelblue', 'lightyellow', 'lime', 'limegreen', 'linen',
	'magenta', 'maroon', 'mediumaquamarine', 'mediumblue', 'mediumorchid', 'mediumpurple', 'mediumseagreen', 'mediumslateblue', 'mediumspringgreen', 'mediumturquoise', 'mediumvioletred', 'midnightblue', 'mintcream', 'mistyrose', 'moccasin',
	'navajowhite', 'navy',
	'oldlace', 'olive', 'olivedrab', 'orange', 'orangered', 'orchid',
	'palegoldenrod', 'palegreen', 'paleturquoise', 'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink', 'plum', 'powderblue', 'purple',
	'rebeccapurple', 'red', 'rosybrown', 'royalblue',
	'saddlebrown', 'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna', 'silver', 'skyblue', 'slateblue', 'slategray', 'slategrey', 'snow', 'springgreen', 'steelblue',
	'tan', 'teal', 'thistle', 'tomato', 'turquoise',
	'violet',
	'wheat', 'white', 'whitesmoke',
	'yellow', 'yellowgreen']; // detect firefox default colors
const colorRegexHex = /^#?[0-9a-f]{3,8}$/; // detect Hex input
const colorRegexRGBA = /^rgba?\(\d{1,3}, ?\d{1,3}, ?\d{1,3}(, ?[0-1](\.\d)?)?\)$/; // detect RGB(A) input; however: RGB with spaces are not supported
var getHightlightColor = browser.storage.sync.get("highlightColor");
getHightlightColor.then(loadSettingsHighlightColor);
var getIgnoreHTML = browser.storage.sync.get("ignoreHTML");
getIgnoreHTML.then(loadSettingsIgnoreHTML);
var getTabTableDisplay = browser.storage.sync.get("tabTableDisplay");
getTabTableDisplay.then(loadSettingsTabTableDisplay);
var getSelectedInclude = browser.storage.sync.get("selectedInclude");
getSelectedInclude.then(loadSettingsSelectedInclude);

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
var defaultSelectedInclude = false;

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
		option.textContent = browser.i18n.getMessage('optionsLabelTabTableDisplay-' + k.toString());
		select.appendChild(option);
	}
	var tmp = {0: defaultTabTableDisplay[0]};
	if(storage.tabTableDisplay)
		tmp = storage.tabTableDisplay;
	document.getElementById('set_tabtable').value = Object.keys(tmp)[0];
}

// initial load of settings - selected include
function loadSettingsSelectedInclude(storage) {
	var tmp = defaultSelectedInclude;
	if(typeof storage.selectedInclude != 'undefined')
		tmp = storage.selectedInclude;
	document.getElementById('set_selectedinclude').checked = tmp;
}

// save all settings
function saveSettings() {
	var selectedColor = document.getElementById('set_color').value.toLowerCase();
	if(!validateColor(selectedColor)) {
		showErrorLine(true, browser.i18n.getMessage('errorOptionsInvalid'));
		return;
	}
	var selectedIgnoreHTML = document.getElementById('set_ignoreHTML').checked;
	var TTDObj = {};
	var selectedTabTableDisplay = parseInt(document.getElementById('set_tabtable').value);
	TTDObj[selectedTabTableDisplay] = defaultTabTableDisplay[selectedTabTableDisplay];
	var selectedSelectedInclude = document.getElementById('set_selectedinclude').checked;
	browser.storage.sync.set({
		highlightColor: selectedColor,
		ignoreHTML: selectedIgnoreHTML,
		tabTableDisplay: TTDObj,
		selectedInclude: selectedSelectedInclude
	});
	showErrorLine(false, null);
}

// reset all settings to default (provided by lang)
function resetSettings() {
	document.getElementById('set_color').value = defaultHighlightColor;
	document.getElementById('set_ignoreHTML').checked = defaultIgnoreHTML;
	document.getElementById('set_tabtable').value = 0;
	document.getElementById('set_selectedinclude').checked = defaultSelectedInclude;
	saveSettings()
	updateColor();
}

// check if color string matches hex, rgba or FF colors
function validateColor(testColor) {
	var validColor = false;
	if(colorArrayFF.includes(testColor))
		validColor = true;
	else if(colorRegexHex.test(testColor)) {
		if(testColor.charAt(0) != '#')
			testColor = '#' + testColor;
		if([4, 5, 7, 9].includes(testColor.length))
			validColor = true;
	}
	else if(colorRegexRGBA.test(testColor)) {
		var colorValues = testColor.substring(testColor.indexOf('(') + 1, testColor.indexOf(')')).split(',');
		if(colorValues[0] >= 0 && colorValues[0] <= 255 && colorValues[1] >= 0 && colorValues[1] <= 255 && colorValues[2] >= 0 && colorValues[2] <= 255 && (colorValues.length == 3 || (colorValues.length == 4 && colorValues[3] >= 0 && colorValues[3] <= 1)))
			validColor = true;
	}
	return validColor;
}

// update the color preview and check input for Hex-conformity
function updateColor() {
	var setColor = document.getElementById('set_color');
	var selectedColor = setColor.value.toLowerCase();
	if(validateColor(selectedColor)) {
		setColor.value = selectedColor;
		document.getElementById('display_color').style.backgroundColor = selectedColor;
		setColor.classList.remove('incomplete');
	} else {
		setColor.classList.add('incomplete');
	}
}

// function to show config errors
function showErrorLine(display, errMsg) {
	var errElem = document.getElementById('error_display');
	if(display) {
		errElem.classList.remove('hidden');
		errElem.textContent = errMsg;
	} else {
		errElem.classList.add('hidden');
	}
}