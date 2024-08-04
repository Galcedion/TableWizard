document.getElementById('l_set_color').innerHTML = browser.i18n.getMessage('optionsLabelHighlightColor');
document.getElementById('button_save').value = browser.i18n.getMessage('optionsSave');
document.getElementById('button_reset').value = browser.i18n.getMessage('optionsReset');
const colorRegex = /^#?[0-9a-f]{3,8}$/;
var getHightlightColor = browser.storage.sync.get("highlightColor");
getHightlightColor.then(loadSettingsHighlightColor);

document.getElementById('set_color').addEventListener('keyup', updateColor);
document.getElementById('button_save').addEventListener('click', saveSettings);
document.getElementById('button_reset').addEventListener('click', resetSettings);

function loadSettingsHighlightColor(storage) {
	var tmp = browser.i18n.getMessage('optionsDefaultHighlightColor');
	if(storage.highlightColor)
		tmp = storage.highlightColor;
	document.getElementById('set_color').value = tmp;
	updateColor();
}

function saveSettings() {
	var selectedColor = document.getElementById('set_color').value.toLowerCase();
	if(!colorRegex.test(selectedColor)) {
		return;
	}
	browser.storage.sync.set({
		highlightColor: selectedColor,
	});
}

function resetSettings() {
	document.getElementById('set_color').value = browser.i18n.getMessage('optionsDefaultHighlightColor');
	saveSettings()
	updateColor();
}

function updateColor() {
	var setColor = document.getElementById('set_color');
	var selectedColor = setColor.value.toLowerCase();
	if(!colorRegex.test(selectedColor)) {
		setColor.classList.add('incomplete');
	} else {
		document.getElementById('display_color').style.backgroundColor = selectedColor;
		setColor.classList.remove('incomplete');
	}
}