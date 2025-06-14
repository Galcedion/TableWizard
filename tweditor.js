function tweHTML(dom, id) {
	let button_style = 'padding:0.5em;font-weight:bold;margin:0 auto;';
	let success_js = 'let twesuccess = document.getElementById(\'' + dom.id + '\');\
	twesuccess.innerHTML = twe_c_' + id + '.value;\
	if(twesuccess.hasAttribute(\'data-' + tweDataOriginalId + '\')) {\
	twesuccess.removeAttribute(\'data-' + tweDataOriginalId + '\');\
	twesuccess.removeAttribute(\'id\');\
	}';
	let html = '<h3>' + browser.i18n.getMessage("editorTitle") + '</h3>\
	<textarea id="twe_c_' + id + '" rows="5">' + dom.innerHTML + '</textarea>\
	<p style="display:flex;">\
	<input type="button" style="' + button_style + '" onclick="' + success_js + 'document.getElementById(\'twe_' + id + '\').remove();" value="' + browser.i18n.getMessage("editorButtonSave") + '">\
	<input type="button" style="' + button_style + '" onclick="document.getElementById(\'twe_' + id + '\').remove();" value="' + browser.i18n.getMessage("editorButtonCancel") + '">\
	</p>';
	return html;
}

// display editor
function tweShowEditor(dom) {
	var id = 0;
	if(!dom.hasAttribute('data-' + tweDataOriginalvalue)) {
		dom.dataset[tweDataOriginalvalue] = dom.innerHTML;
	}
	if(!dom.hasAttribute('id')) {
		dom.dataset[tweDataOriginalId] = false;
		while(document.getElementById('twe_cell_' + id) != null) {
			++id;
		}
		dom.id = 'twe_cell_' + id;
	}
	var dialog = document.createElement('dialog');
	id = 0;
	while(document.getElementById('twe_' + id) != null) {
		++id;
	}
	dialog.id = 'twe_' + id;
	dialog.open = true;
	dialog.classList.add(twAlertDialogClass);
	dialog.innerHTML = tweHTML(dom, id);
	document.getElementsByTagName('BODY')[0].insertBefore(dialog, document.getElementsByTagName('BODY')[0].firstChild);
}