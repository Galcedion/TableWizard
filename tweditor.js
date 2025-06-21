// editor content including internal JS functionality
function tweHTML(dom, id) {
	// defile editor stlyes
	let style_button = 'padding:0.5em;font-weight:bold;margin:0 auto;';
	let style_preview = 'height:5rem;border:1px black solid;display:none;';
	let style_flex_elem = 'flex-basis:0;flex-grow:1;';
	// define editor JS
	let js_success = 'let twesuccess = document.getElementById(\'' + dom.id + '\');\
	twesuccess.innerHTML = twe_c_' + id + '.value;\
	if(twesuccess.hasAttribute(\'data-' + tweDataOriginalId + '\')) {\
	twesuccess.removeAttribute(\'data-' + tweDataOriginalId + '\');\
	twesuccess.removeAttribute(\'id\');\
	}';
	let js_bold = 'let ta = document.getElementById(\'twe_c_' + id + '\');\
	ta.value = ta.value.slice(0,ta.selectionStart) + \'<b>\' + ta.value.slice(ta.selectionStart,ta.selectionEnd) + \'</b>\' + ta.value.slice(ta.selectionEnd);';
	let js_italic = 'let ta = document.getElementById(\'twe_c_' + id + '\');\
	ta.value = ta.value.slice(0,ta.selectionStart) + \'<i>\' + ta.value.slice(ta.selectionStart,ta.selectionEnd) + \'</i>\' + ta.value.slice(ta.selectionEnd);';
	let js_underline = 'let ta = document.getElementById(\'twe_c_' + id + '\');\
	ta.value = ta.value.slice(0,ta.selectionStart) + \'<u>\' + ta.value.slice(ta.selectionStart,ta.selectionEnd) + \'</u>\' + ta.value.slice(ta.selectionEnd);';
	let js_newline = 'let ta = document.getElementById(\'twe_c_' + id + '\');\
	ta.value = ta.value.slice(0,ta.selectionEnd) + \'<br>\' + ta.value.slice(ta.selectionEnd);';
	let js_editmode = 'document.getElementById(\'twe_c_' + id + '\').style.display = \'inherit\';\
	document.getElementById(\'twe_pv_' + id + '\').style.display = \'none\';';
	let js_previewmode = 'document.getElementById(\'twe_pv_' + id + '\').innerHTML = document.getElementById(\'twe_c_' + id + '\').value;\
	document.getElementById(\'twe_c_' + id + '\').style.display = \'none\';\
	document.getElementById(\'twe_pv_' + id + '\').style.display = \'inherit\';';
	let js_restore_previous = 'document.getElementById(\'twe_c_' + id + '\').value = this.dataset[\'storage\'];';
	let js_restore_original = 'document.getElementById(\'twe_c_' + id + '\').value = this.dataset[\'storage\'];';
	// define editor content
	let html = '<h3 style="text-align:center;">' + browser.i18n.getMessage("editorTitle") + '</h3>\
	<hr>\
	<div>\
	<input type="button" style="font-weight:bold;" onclick="' + js_bold + '" value="B">\
	<input type="button" style="font-style:italic;" onclick="' + js_italic +'" value="I">\
	<input type="button" style="text-decoration:underline;" onclick="' + js_underline + '" value="U">\
	<input type="button" onclick="' + js_newline + '" value="↵">\
	</div>\
	<div style="display:flex;">\
	<div style="' + style_flex_elem + '">\
	<input type="button" onclick="' + js_editmode + '" value="' + browser.i18n.getMessage("editorButtonEdit") + '">\
	<input type="button" onclick="' + js_previewmode + '" value="' + browser.i18n.getMessage("editorButtonPreview") + '">\
	</div>\
	<div style="' + style_flex_elem + '">\
	<input type="button" onclick="' + js_restore_previous + '" data-storage="' + dom.innerHTML + '" value="' + browser.i18n.getMessage("editorButtonRestorePrevious") + '">\
	<input type="button" onclick="' + js_restore_original + '" data-storage="' + dom.dataset[tweDataOriginalValue] + '" value="' + browser.i18n.getMessage("editorButtonRestoreOriginal") + '">\
	</div>\
	</div>\
	<textarea id="twe_c_' + id + '" rows="5">' + dom.innerHTML + '</textarea>\
	<div id="twe_pv_' + id + '" style="' + style_preview + '">' + dom.innerHTML + '</div>\
	<p style="display:flex;">\
	<input type="button" style="' + style_button + '" onclick="' + js_success + 'document.getElementById(\'twe_' + id + '\').remove();" value="' + browser.i18n.getMessage("editorButtonSave") + '">\
	<input type="button" style="' + style_button + '" onclick="document.getElementById(\'twe_' + id + '\').remove();" value="' + browser.i18n.getMessage("editorButtonCancel") + '">\
	</p>';
	return html;
}

// display editor
function tweShowEditor(dom) {
	var id = 0;
	if(!dom.hasAttribute('data-' + tweDataOriginalValue)) {
		dom.dataset[tweDataOriginalValue] = dom.innerHTML;
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
	dialog.classList.add(tweDialogClass);
	dialog.innerHTML = tweHTML(dom, id);
	document.getElementsByTagName('BODY')[0].insertBefore(dialog, document.getElementsByTagName('BODY')[0].firstChild);
}