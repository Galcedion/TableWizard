var currentDate = Date.now().toString();
var twHightlightClass = 'tw_highlight_' + currentDate;
var twGridClass = 'tw_grid_' + currentDate;
var twHiddenClass = 'tw_hidden_' + currentDate;
var twPrintHiddenClass = 'tw_print_' + currentDate;
var twAlertDialogClass = 'tw_alert_' + currentDate;
var tweDialogClass = 'tw_editor_' + currentDate;
var twTableSortMarker = 'tw_sort_' + currentDate;
var tweDataOriginalId = 'tweoriginalid' + currentDate;
var tweDataOriginalValue = 'tweoriginalval' + currentDate;
var tweCellSpanOriginalValue = 'tw_cellspan_' + currentDate;
var tweCellSplitOriginalValue = 'tw_cellsplit_' + currentDate;
var twInjectedCellClass = 'tw_ic_' + currentDate;
var twTableIndices = {};
var highlightColor = browser.i18n.getMessage('optionsDefaultHighlightColor');
var ignoreHTML = true;
var selectedInclude = false;

tw_check();

// check if the page contains tables
function tw_check() {
	if((document.getElementsByTagName("table").length == 0))
		return;
	getSettings = browser.storage.sync.get([
		"highlightColor",
		"ignoreHTML",
		"selectedInclude"
	]);
	getSettings.then(loadSettings);
}

// attach event handlers to tables
function tw_attach() {
	var injectCSS = document.createElement('style');
	injectCSS.type = 'text/css';
	injectCSS.textContent = '.' + twHiddenClass + '{display: none !important; }\
	.' + twAlertDialogClass + '{position: fixed; z-index: 100; top: calc(50% - 5em); padding: 0.5em 1em; width: 20em; background-color: white; border: 0; border-radius: 1em; box-shadow: inset 0 0 0.5em 0.25em crimson;}\
	.' + tweDialogClass + '{position: fixed; z-index: 100; top: calc(50% - 5em); padding: 0.5em 1em; width: 50em; background-color: white; border: 0; border-radius: 1em; box-shadow: inset 0 0 0.5em 0.25em gray;}\
	.' + tweDialogClass + '>div{margin: 0.25em 0;}\
	@media print {.' + twPrintHiddenClass + ' {display: none!important; }}\
	.' + twGridClass + ' tr:nth-child(even),.' + twGridClass + ' td:nth-child(even) {background-color: #AAA5; }\
	.' + twHightlightClass + '{background-color: ' + highlightColor + ' !important; }';
	document.getElementsByTagName('head')[0].appendChild(injectCSS);
	var tableList = document.getElementsByTagName("table");
	for(let t = 0; t < tableList.length; ++t) {
		tableList[t].addEventListener("contextmenu", function() {
			browser.runtime.sendMessage({
				task: 'enableCM',
				enableCM: true
			});
		});
	}
}

// initial load of settings
function loadSettings(storage) {
	// highlighting color
	var tmp = highlightColor;
	if(storage.highlightColor)
		highlightColor = storage.highlightColor;
	// ignore HTML
	if(typeof storage.ignoreHTML != 'undefined')
		ignoreHTML = storage.ignoreHTML;
	// selected include
	if(typeof storage.selectedInclude != 'undefined')
		selectedInclude = storage.selectedInclude;
	tw_attach();
}

// check if text is contained in children or not
function checkChildren(children, value, exact) {
	for(let c = 0; c < children.length; ++c) {
		if(typeof(children[c].tagName) == 'undefined')
			continue;
		var comp = ignoreHTML ? removeHTMLFromString(children[c].innerHTML.trim()) : children[c].innerHTML.trim();
		if((exact && comp == value) || (!exact && comp.includes(value)))
			return true;
	}
	return false;
}

// check if text is contained in a row and calls tw_coldel upon it, returns list of indices 
function checkChildrenReturnIndexList(children, value, indexList, exact) {
	var index = 0;
	for(let c = 0; c < children.length; ++c) {
		if(typeof(children[c].tagName) == 'undefined')
			continue;
		var comp = ignoreHTML ? removeHTMLFromString(children[c].innerHTML.trim()) : children[c].innerHTML.trim();
		if(!indexList.includes(index) && ((exact && comp == value) || (!exact && comp.includes(value))) ) {
			tw_coldel(children[c]);
			indexList.push(index);
		}
		index += 1;
	}
	return indexList;
}

// adds a class to a given index in a row, ignores colspan
function checkChildrenIndex(children, index, adclass) {
	for(let c = 0; c < children.length; ++c) {
		if(typeof(children[c].tagName) == 'undefined')
			continue;
		if(children[c].hasAttribute('colspan'))
			index -= children[c].colSpan;
		else
			index -= 1;
		if(index < 0) {
			if(index == -1 && !children[c].hasAttribute('colspan'))
				children[c].classList.add(adclass);
			return;
		}
	}
}

// adds given class to all neighbours
function checkNeighboursAddClass(element, addClass) {
	var children = element.parentNode.childNodes;
	for(let c = 0; c < children.length; ++c) {
		if(typeof(children[c].tagName) == 'undefined')
			continue;
		if(children[c] != element) {
			children[c].classList.add(addClass);
		}
	}
}

// get index of cell
// colum index when a TD / TH is given, row index when TR is given
function getCellPositionIndex(dom) {
	var index = 0;
	while((dom = dom.previousSibling) != null) {
		if(typeof(dom.tagName) != 'undefined')
			++index;
	}
	return index;
}

// gets cell within a row by given index
function getCellByIndex(dom, index) {
	if(dom.tagName == 'TR')
		dom = dom.firstChild;
	while((dom = dom.nextSibling) != null) {
		if(typeof(dom.tagName) != 'undefined')
			--index;
		if(index < 0)
			break;
	}
	return dom;
}

// goes up the node tree until a certain tag is reached | returns false if the requested tag is not found
function getParentNodeByTag(dom, node) {
	var tableBreaker = 'TABLE'; // stop if end of table is reached
	if(!Array.isArray(node))
		node = [node];
	while(!node.includes(dom.tagName)) {
		dom = dom.parentNode;
		if(dom.tagName == 'HTML')
			return false;
		else if(!node.includes(tableBreaker) && dom.tagName == tableBreaker)
			return false;
	}
	return dom;
}

// regex function to remove HTML from given string
function removeHTMLFromString(str) {
	return str.replace(/<[^>]*>?/g, '');
}

// retrieves the currently selected text and replaces the input if one is found
function getSelectedText(input) {
	if(!selectedInclude || !window.getSelection)
		return input;
	var tmp = window.getSelection().toString();
	if(tmp.length > 0)
		return tmp;
	return input;
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
	dialog.innerHTML = '<h3 style="text-align:center;">' + errorTitle + '</h3>\
	<hr>\
	<p style="text-align:justify;">' + errorMessage + '</p>\
	<p style="text-align:center;"><input type="button" style="padding:0.5em;font-weight:bold;" onclick="document.getElementById(\'tw_err' + id + '\').remove();" value="' + browser.i18n.getMessage("errorButton") + '"></p>';
	document.getElementsByTagName('BODY')[0].insertBefore(dialog, document.getElementsByTagName('BODY')[0].firstChild);
}

// TW highlights cells with given value
function tw_highlight(dom, exact) {
	dom = getParentNodeByTag(dom, ['TD', 'TH']);
	if(dom === false) {
		showError(browser.i18n.getMessage("errorTitle"), browser.i18n.getMessage("errorNoCellFound"));
		return;
	}
	var targetField = ignoreHTML ? removeHTMLFromString(dom.innerHTML.trim()) : dom.innerHTML.trim();
	if(!exact)
		targetField = getSelectedText(targetField);
	dom = getParentNodeByTag(dom, ['TABLE']);
	dom.querySelectorAll('td, th').forEach((elem) => {
		if(exact && (ignoreHTML ? removeHTMLFromString(elem.innerHTML.trim()) : elem.innerHTML.trim()) == targetField) {
			elem.classList.add(twHightlightClass);
		}
		else if(!exact && (ignoreHTML ? removeHTMLFromString(elem.innerHTML.trim()) : elem.innerHTML.trim()).includes(targetField)) {
			elem.classList.add(twHightlightClass);
		}
	});
}

// TW highlights row (x) or column (y)
function tw_highlight_xy(dom, markrow) {
	dom = getParentNodeByTag(dom, ['TD', 'TH']);
	if(dom === false) {
		showError(browser.i18n.getMessage("errorTitle"), browser.i18n.getMessage("errorNoCellFound"));
		return;
	}
	if(markrow) {
		dom = getParentNodeByTag(dom, ['TR']);
		dom.classList.add(twHightlightClass);
	} else {
		var index = getCellPositionIndex(dom);
		dom = getParentNodeByTag(dom, ['TABLE']);

		var trList = dom.getElementsByTagName('TR');
		for(let tl = 0; tl < trList.length; ++tl) {
			checkChildrenIndex(trList[tl].childNodes, index, twHightlightClass)
		}
	}
}

// TW creates grid in table by marking cells alternatingly
function tw_tablegrid(dom) {
	dom = getParentNodeByTag(dom, ['TABLE']);
	if(dom === false) {
		showError(browser.i18n.getMessage("errorTitle"), browser.i18n.getMessage("errorNoTableFound"));
		return;
	}
	dom.classList.add(twGridClass);
}

// TW delete selected row
function tw_rowdel(dom) {
	dom = getParentNodeByTag(dom, ['TR']);
	if(dom === false) {
		showError(browser.i18n.getMessage("errorTitle"), browser.i18n.getMessage("errorNoCellFound"));
		return;
	}
	dom.classList.add(twHiddenClass);
}

// TW delete rows with selected cell's text
function tw_rowdelbyfield(dom, exact) {
	dom = getParentNodeByTag(dom, ['TD', 'TH']);
	if(dom === false) {
		showError(browser.i18n.getMessage("errorTitle"), browser.i18n.getMessage("errorNoCellFound"));
		return;
	}
	var targetField = ignoreHTML ? removeHTMLFromString(dom.innerHTML.trim()) : dom.innerHTML.trim();
	if(!exact)
		targetField = getSelectedText(targetField);
	dom = getParentNodeByTag(dom, ['TABLE']);

	var trList = dom.getElementsByTagName('TR');
	for(let tl = 0; tl < trList.length; ++tl) {
		if(checkChildren(trList[tl].childNodes, targetField, exact))
			trList[tl].classList.add(twHiddenClass);
	}
}

// TW delete selected column
function tw_coldel(dom) {
	dom = getParentNodeByTag(dom, ['TD', 'TH']);
	if(dom === false) {
		showError(browser.i18n.getMessage("errorTitle"), browser.i18n.getMessage("errorNoCellFound"));
		return;
	}
	var index = getCellPositionIndex(dom);
	dom = getParentNodeByTag(dom, ['TABLE']);

	var trList = dom.getElementsByTagName('TR');
	for(let tl = 0; tl < trList.length; ++tl) {
		checkChildrenIndex(trList[tl].childNodes, index, twHiddenClass);
	}
}

// TW delete columns with selected cell's text
function tw_coldelbyfield(dom, exact) {
	dom = getParentNodeByTag(dom, ['TD', 'TH']);
	if(dom === false) {
		showError(browser.i18n.getMessage("errorTitle"), browser.i18n.getMessage("errorNoCellFound"));
		return;
	}
	var targetField = ignoreHTML ? removeHTMLFromString(dom.innerHTML.trim()) : dom.innerHTML.trim();
	if(!exact)
		targetField = getSelectedText(targetField);
	var indexList = [getCellPositionIndex(dom)];
	tw_coldel(dom);
	dom = getParentNodeByTag(dom, ['TABLE']);

	var trList = dom.getElementsByTagName('TR');
	for(let tl = 0; tl < trList.length; ++tl) {
		indexList = checkChildrenReturnIndexList(trList[tl].childNodes, targetField, indexList, exact);
	}
}

// TW editor
function tw_editor(dom) {
	dom = getParentNodeByTag(dom, ['TD', 'TH']);
	tweShowEditor(dom);
}

// TW cellspan (rowspan + colspan)
function tw_cellspan(dom) {
	dom = getParentNodeByTag(dom, ['TABLE']);
	var userSelected = window.getSelection();
	if(!dom.contains(userSelected.anchorNode) || userSelected.anchorNode.tagName != 'TR') {
		showError(browser.i18n.getMessage("errorTitle"), browser.i18n.getMessage("errorCellSpanNoSelect"));
		return;
	}
	var selectedList = [];
	var colspan = 1;
	var rowspan = 1;
	let curColIndex = null;
	let minColIndex = null;
	let maxColIndex = null;
	let rowReference = null;
	// get the selected elements
	// NOTE: testing indicates that the selection is already sorted by occurance in the DOM!
	for(let i = 0; i < userSelected.rangeCount; ++i) {
		let tmp = userSelected.getRangeAt(i);
		tmp = tmp.startContainer.childNodes[tmp.startOffset];
		if(tmp.colSpan > 1 || tmp.rowSpan > 1) {
			showError(browser.i18n.getMessage("errorTitle"), browser.i18n.getMessage("errorCellSpanAlreadyMerged"));
			return;
		}
		if(curColIndex == null) {
			curColIndex = getCellPositionIndex(tmp);
			minColIndex = curColIndex;
			rowReference = getParentNodeByTag(tmp, 'TR');
		} else {
			let tmpColIndex = getCellPositionIndex(tmp);
			if(tmpColIndex != minColIndex && tmpColIndex != curColIndex + 1) {
				showError(browser.i18n.getMessage("errorTitle"), browser.i18n.getMessage("errorCellSpanCantMerge"));
				return;
			}
			if(tmpColIndex == minColIndex) { // indicate new row
				if(maxColIndex == null) {
					maxColIndex = curColIndex;
				} else if(maxColIndex > curColIndex) {
					showError(browser.i18n.getMessage("errorTitle"), browser.i18n.getMessage("errorCellSpanCantMerge"));
					return;
				}
				let tmpParentRow = getParentNodeByTag(tmp, 'TR');
				if(rowReference != tmpParentRow.previousElementSibling) {
					showError(browser.i18n.getMessage("errorTitle"), browser.i18n.getMessage("errorCellSpanCantMerge"));
					return;
				}
				rowReference = tmpParentRow;
				rowspan += 1;
			}
			curColIndex = tmpColIndex;
			if(maxColIndex == null)
				colspan += 1;
		}
		selectedList.push(tmp);
	}
	if(maxColIndex != null && curColIndex != maxColIndex) {
		showError(browser.i18n.getMessage("errorTitle"), browser.i18n.getMessage("errorCellSpanCantMerge"));
		return;
	}
	if(colspan == 1 && rowspan == 1)
		return;
	selectedList[0].dataset[tweCellSpanOriginalValue] = (selectedList[0].hasAttribute("colSpan") ? selectedList[0].colSpan : 0) + ' ' + (selectedList[0].hasAttribute("rowSpan") ? selectedList[0].rowSpan : 0);
	selectedList[0].colSpan = colspan;
	selectedList[0].rowSpan = rowspan;
	for(let i = 1; i < selectedList.length; ++i) {
		selectedList[i].classList.add(twHiddenClass);
	}
	userSelected.removeAllRanges();
}

// TW cellsplit
function tw_cellsplit(dom) {
	dom = getParentNodeByTag(dom, ['TD', 'TH']);
	if(dom === false) {
		showError(browser.i18n.getMessage("errorTitle"), browser.i18n.getMessage("errorNoCellFound"));
		return;
	}
	if(!(dom.colSpan > 1) && !(dom.rowSpan > 1)) {
		showError(browser.i18n.getMessage("errorTitle"), browser.i18n.getMessage("errorCellSpanCantMerge"));
		return;
	}
	var colspan = dom.colSpan;
	var rowspan = dom.rowSpan;
	var index = getCellPositionIndex(dom);
	dom.dataset[tweCellSplitOriginalValue] = (dom.hasAttribute("colSpan") ? dom.colSpan : 0) + ' ' + (dom.hasAttribute("rowSpan") ? dom.rowSpan : 0);
	dom.colSpan = 1;
	dom.rowSpan = 1;
	let curRow = null;
	let firstCell = null;
	for(let row = 0; row < rowspan; ++row) {
		let col = 1;
		if(curRow == null) {
			curRow = getParentNodeByTag(dom, ['TR']);
			firstCell = getCellByIndex(curRow, index);
		} else {
			curRow = curRow.nextElementSibling;
			firstCell = getCellByIndex(curRow, index - 1);
			col = 0;
		}
		for(col; col < colspan; ++col) {
			let tmp = document.createElement(dom.tagName);
			tmp.classList.add(twInjectedCellClass);
			firstCell.parentNode.insertBefore(tmp, firstCell.nextSibling);
		}
	}
}

// TW sort by rows
function tw_sortrows(dom, descending) {
	dom = getParentNodeByTag(dom, ['TD', 'TH']);
	if(dom === false) {
		showError(browser.i18n.getMessage("errorTitle"), browser.i18n.getMessage("errorNoCellFound"));
		return;
	}
	var referenceCell = dom;
	dom = getParentNodeByTag(dom, ['TABLE']);
	if(dom.querySelectorAll('[rowspan]').length > 0) { // don't sort when rowspan in table
		showError(browser.i18n.getMessage("errorTitle"), browser.i18n.getMessage("errorCantSortRowspan"));
		return;
	}
	var referenceIndex = getCellPositionIndex(referenceCell);
	var tr = dom.getElementsByTagName('tr');
	var iterationStop = tr.length;

	var tableClass = null;
	for(let i = 0; i < dom.classList.length; ++i) {
		if(dom.classList[i].includes(twTableSortMarker)) {
			tableClass = dom.classList[i];
			break;
		}
	}
	if(tableClass == null) {
		tableClass = twTableSortMarker + Object.keys(twTableIndices).length.toString();
		dom.classList.add(tableClass);
		twTableIndices[tableClass] = {'row': Array.from(Array(iterationStop).keys())};
	}
	else if(typeof twTableIndices[tableClass]['row'] == 'undefined')
		twTableIndices[tableClass]['row'] = Array.from(Array(iterationStop).keys());

	for(let i = 1; i < tr.length; ++i) { // loop the sort
		--iterationStop;
		for(let j = 0; j < iterationStop; ++j) { // swap rows if necessary for sort
			var a = getCellByIndex(tr[j], referenceIndex);
			if(a == null || a.tagName == 'TH')
				continue;
			var tmpCnt = 0;
			do {
				++tmpCnt;
				var b = getCellByIndex(tr[j+tmpCnt], referenceIndex);
				if(j + tmpCnt > tr.length)
					break;
			} while(b == null || b.tagName == 'TH');
			if(ignoreHTML)
				var strComp = removeHTMLFromString(a.innerHTML).toLowerCase().localeCompare(removeHTMLFromString(b.innerHTML).toLowerCase());
			else
				var strComp = a.innerHTML.toLowerCase().localeCompare(b.innerHTML.toLowerCase());
			if((!descending && strComp == 1) || (descending && strComp == -1)) {
				tr[j].parentNode.insertBefore(tr[j+tmpCnt], tr[j]);
				var swap = twTableIndices[tableClass]['row'][j];
				twTableIndices[tableClass]['row'][j] = twTableIndices[tableClass]['row'][j+tmpCnt];
				twTableIndices[tableClass]['row'][j+tmpCnt] = swap;
			}
		}
	}
}

// TW sort by columns
function tw_sortcolumns(dom, descending) {
	dom = getParentNodeByTag(dom, ['TD', 'TH']);
	if(dom === false) {
		showError(browser.i18n.getMessage("errorTitle"), browser.i18n.getMessage("errorNoCellFound"));
		return;
	}
	var referenceCell = dom;
	do {
		if(dom.tagName == 'TR')
			var referenceRowIndex = getCellPositionIndex(dom);
		dom = dom.parentNode;
	} while(dom.tagName != 'TABLE');
	if(dom.querySelectorAll('[colspan]').length > 0) { // don't sort when colspan in table
		showError(browser.i18n.getMessage("errorTitle"), browser.i18n.getMessage("errorCantSortColspan"));
		return;
	}
	var referenceColIndex = getCellPositionIndex(referenceCell);
	var tr = dom.getElementsByTagName('TR');
	var iterationStop = tr[0].querySelectorAll('td,th').length;

	var tableClass = null;
	for(let i = 0; i < dom.classList.length; ++i) {
		if(dom.classList[i].includes(twTableSortMarker)) {
			tableClass = dom.classList[i];
			break;
		}
	}
	if(tableClass == null) {
		tableClass = twTableSortMarker + Object.keys(twTableIndices).length.toString();
		dom.classList.add(tableClass);
		twTableIndices[tableClass] = {'col': Array.from(Array(iterationStop).keys())};
	}
	else if(typeof twTableIndices[tableClass]['col'] == 'undefined')
		twTableIndices[tableClass]['col'] = Array.from(Array(iterationStop).keys());

	for(let i = 1; i < tr[0].querySelectorAll('td,th').length; ++i) { // loop the sort
		--iterationStop;
		for(let j = 0; j < iterationStop; ++j) {
			var a = getCellByIndex(tr[referenceRowIndex], j);
			var b = getCellByIndex(tr[referenceRowIndex], j + 1);
			if(a == null || b == null)
				continue;
			if(ignoreHTML)
				var strComp = removeHTMLFromString(a.innerHTML).toLowerCase().localeCompare(removeHTMLFromString(b.innerHTML).toLowerCase());
			else
				var strComp = a.innerHTML.toLowerCase().localeCompare(b.innerHTML.toLowerCase());
			if((!descending && strComp == 1) || (descending && strComp == -1)) {
				for(let k = 0; k < tr.length; ++k) {
					tr[k].insertBefore(tr[k].querySelectorAll('td,th')[j + 1], tr[k].querySelectorAll('td,th')[j]);
				}
				var swap = twTableIndices[tableClass]['col'][j];
				twTableIndices[tableClass]['col'][j] = twTableIndices[tableClass]['col'][j + 1];
				twTableIndices[tableClass]['col'][j + 1] = swap;
			}
		}
	}
}

// TW export table to new tab
function tw_exportnewtab(dom) {
	dom = getParentNodeByTag(dom, ['TABLE']);
	var table = dom.innerHTML.replace(/&nbsp;|&#160;/g, ' ').replace(/\u00A0|\u202F/g, ' ');
	table = table.replace(/&#60;|&lt;/g, '%3C').replace(/&#62;|&gt;/g, '%3E');
	table = new URLSearchParams('table=' + table.replace(/&amp;|&#38;|&#x26;/g, '%26') + (dom.classList.contains(twGridClass) ? '&grid=true' : '')).toString();
	browser.runtime.sendMessage({
		task: 'exportNewTab',
		tabledata: table
	});
}

// TW export table to print
function tw_exportprint(dom) {
	dom = getParentNodeByTag(dom, ['TABLE']);
	while(dom.tagName != 'BODY') {
		checkNeighboursAddClass(dom, twPrintHiddenClass);
		dom = dom.parentNode;
	}
	window.print();
	var printlist = dom.getElementsByClassName(twPrintHiddenClass);
	while(printlist.length > 0) {
		printlist[0].classList.remove(twPrintHiddenClass);
	}
}

// TW reset all modifications of the selected table
function tw_reset(dom) {
	dom = getParentNodeByTag(dom, ['TABLE']);
	dom.classList.remove(twGridClass);
	var hiddenList = dom.getElementsByClassName(twHiddenClass);
	while(hiddenList.length > 0) {
		hiddenList[0].classList.remove(twHiddenClass);
	}
	var highlightList = dom.getElementsByClassName(twHightlightClass);
	while(highlightList.length > 0) {
		highlightList[0].classList.remove(twHightlightClass);
	}

	var injectedCellList = dom.getElementsByClassName(twInjectedCellClass);
	while(injectedCellList.length > 0) {
		injectedCellList[0].remove();
	}

	dom.querySelectorAll('[data-' + tweDataOriginalValue + ']').forEach((elem) => {
		elem.innerHTML = elem.dataset[tweDataOriginalValue];
		elem.removeAttribute('data-' + tweDataOriginalValue);
	});

	dom.querySelectorAll('[data-' + tweCellSplitOriginalValue + ']').forEach((elem) => {
		let colRowSpan = elem.dataset[tweCellSplitOriginalValue].split(' ');
		colRowSpan[0] == 0 ? elem.removeAttribute('colSpan') : elem.colSpan = colRowSpan[0];
		colRowSpan[1] == 0 ? elem.removeAttribute('rowSpan') : elem.rowSpan = colRowSpan[1];
		elem.removeAttribute('data-' + tweCellSplitOriginalValue);
	});

	dom.querySelectorAll('[data-' + tweCellSpanOriginalValue + ']').forEach((elem) => {
		let colRowSpan = elem.dataset[tweCellSpanOriginalValue].split(' ');
		colRowSpan[0] == 0 ? elem.removeAttribute('colSpan') : elem.colSpan = colRowSpan[0];
		colRowSpan[1] == 0 ? elem.removeAttribute('rowSpan') : elem.rowSpan = colRowSpan[1];
		elem.removeAttribute('data-' + tweCellSpanOriginalValue);
	});

	var tableClass = null;
	for(let i = 0; i < dom.classList.length; ++i) {
		if(dom.classList[i].includes(twTableSortMarker)) {
			tableClass = dom.classList[i];
			dom.classList.remove(tableClass);
			break;
		}
	}
	if(tableClass == null)
		return;

	if(typeof twTableIndices[tableClass]['row'] != 'undefined') {
		var tr = dom.getElementsByTagName('tr');
		var iterationStop = tr.length;
		for(let i = 1; i < tr.length; ++i) { // loop the sort
			--iterationStop;
			for(let j = 0; j < iterationStop; ++j) { // swap rows back if necessary
				if(twTableIndices[tableClass]['row'][j] > twTableIndices[tableClass]['row'][j+1]) {
					tr[j].parentNode.insertBefore(tr[j+1], tr[j]);
					var swap = twTableIndices[tableClass]['row'][j];
					twTableIndices[tableClass]['row'][j] = twTableIndices[tableClass]['row'][j+1];
					twTableIndices[tableClass]['row'][j+1] = swap;
				}
			}
		}
	}
	if(typeof twTableIndices[tableClass]['col'] != 'undefined') {
		var tr = dom.getElementsByTagName('tr');
		var iterationStop = tr[0].querySelectorAll('td,th').length;
		for(let i = 1; i < tr[0].querySelectorAll('td,th').length; ++i) { // loop the sort
			--iterationStop;
			for(let j = 0; j < iterationStop; ++j) {
				if(twTableIndices[tableClass]['col'][j] > twTableIndices[tableClass]['col'][j+1]) {
					for(let k = 0; k < tr.length; ++k) {
						tr[k].insertBefore(tr[k].querySelectorAll('td,th')[j + 1], tr[k].querySelectorAll('td,th')[j]);
					}
					var swap = twTableIndices[tableClass]['col'][j];
					twTableIndices[tableClass]['col'][j] = twTableIndices[tableClass]['col'][j + 1];
					twTableIndices[tableClass]['col'][j + 1] = swap;
				}
			}
		}
	}
	delete twTableIndices[tableClass];
}