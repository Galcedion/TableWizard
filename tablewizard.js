var twHightlightClass = 'tw_highlight_' + Date.now().toString();
var twHiddenClass = 'tw_hidden_' + Date.now().toString();
var twPrintHiddenClass = 'tw_print_' + Date.now().toString();

tw_check();

// check if the page contains tables
function tw_check() {
	if((document.getElementsByTagName("table").length > 0))
		tw_attach();
}

// attach event handlers to tables
function tw_attach() {
	var injectCSS = document.createElement('style');
	injectCSS.type = 'text/css';
	injectCSS.innerHTML = '.' + twHightlightClass + '{background-color: #FF0000AA !important; }\
	.' + twHiddenClass + '{display: none !important; }\
	@media print {.' + twPrintHiddenClass + ' {display: none!important; }}';
	document.getElementsByTagName('head')[0].appendChild(injectCSS);
	var tableList = document.getElementsByTagName("table");
	for(let t = 0; t < tableList.length; ++t) {
		if(tableList[t].tagName.toLowerCase() != 'table')
			continue;
		tableList[t].addEventListener("contextmenu", function() {
			browser.runtime.sendMessage({
				task: 'enableCM',
				enableCM: true
			});
		});
	}
}

// check if text is contained in children or not
function checkChildren(children, value) {
	for(let c = 0; c < children.length; ++c) {
		if(typeof(children[c].tagName) == 'undefined')
			continue;
		if(children[c].innerHTML.trim() == value)
			return true;
	}
	return false;
}

// check if text is contained in a row and calls tw_coldel upon it, returns list of indices 
function checkChildrenReturnIndexList(children, value, indexList) {
	var index = 0;
	for(let c = 0; c < children.length; ++c) {
		if(typeof(children[c].tagName) == 'undefined')
			continue;
		if(children[c].innerHTML.trim() == value && !indexList.includes(index)) {
			tw_coldel(children[c]);
			indexList.push(index);
		}
		index += 1;
	}
	return indexList;
}

// hides a given index in a row, ignores colspan
function checkChildrenIndex(children, index) {
	for(let c = 0; c < children.length; ++c) {
		if(typeof(children[c].tagName) == 'undefined')
			continue;
		if(children[c].hasAttribute('colspan'))
			index -= children[c].colSpan;
		else index -= 1;
		if(index < 0) {
			if(index == -1 && !children[c].hasAttribute('colspan'))
				children[c].classList.add(twHiddenClass);
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

// get index of a cell within a column
function getColIndex(dom) {
	var chain = dom;
	var index = 0;
	while((dom = dom.previousSibling) != null) {
		if(typeof(dom.tagName) != 'undefined')
			++index;
	}
	return index;
}

// TW highlights cells with given value
function tw_highlight(dom) {
	if(!['TD', 'TH'].includes(dom.tagName)) {
		alert(); //TODO
		return;
	}

	var targetField = dom.innerHTML.trim();
	while(dom.tagName != 'TABLE') {
		dom = dom.parentNode;
	}

	dom.querySelectorAll('td, th').forEach((elem) => {if(elem.innerHTML.trim() == targetField) {elem.classList.add(twHightlightClass);}});
}

// TW delete selected tow
function tw_rowdel(dom) {
	if(dom.tagName != 'TR') {
		do {
			dom = dom.parentNode;
		} while(dom.tagName != 'TR');
	}
	dom.classList.add(twHiddenClass);
}

// TW delete rows with selected cell's text
function tw_rowdelbyfield(dom) {
	if(!['TD', 'TH'].includes(dom.tagName)) {
		alert(); //TODO
		return;
	}

	var targetField = dom.innerHTML.trim();
	do {
		dom = dom.parentNode;
	} while(dom.tagName != 'TABLE');

	var trList = dom.getElementsByTagName('TR');
	for(let tl = 0; tl < trList.length; ++tl) {
		if(checkChildren(trList[tl].childNodes, targetField))
			trList[tl].classList.add(twHiddenClass);
	}
}

// TW delete selected column
function tw_coldel(dom) {
	if(!['TD', 'TH'].includes(dom.tagName)) {
		alert(); //TODO
		return;
	}

	var index = getColIndex(dom);
	do {
		dom = dom.parentNode;
	} while(dom.tagName != 'TABLE');

	var trList = dom.getElementsByTagName('TR');
	for(let tl = 0; tl < trList.length; ++tl) {
		checkChildrenIndex(trList[tl].childNodes, index)
	}
}

// TW delete columns with selected cell's text
function tw_coldelbyfield(dom) {
	if(!['TD', 'TH'].includes(dom.tagName)) {
		alert(); //TODO
		return;
	}

	var targetField = dom.innerHTML.trim();
	var index = getColIndex(dom);
	var indexList = [index];
	tw_coldel(dom);

	do {
		dom = dom.parentNode;
	} while(dom.tagName != 'TABLE');

	var trList = dom.getElementsByTagName('TR');
	for(let tl = 0; tl < trList.length; ++tl) {
		indexList = checkChildrenReturnIndexList(trList[tl].childNodes, targetField, indexList);
	}
}

// TW export table to new tab
function tw_exportnewtab(dom) {
	while(dom.tagName != 'TABLE') {
		dom = dom.parentNode;
	}
	var table = new URLSearchParams(dom.innerHTML).toString();
	browser.runtime.sendMessage({
		task: 'exportNewTab',
		tabledata: table
	});
}

// TW export table to print
function tw_exportprint(dom) {
	while(dom.tagName != 'TABLE') {
		dom = dom.parentNode;
	}
	//dom = dom.parentNode;
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
	if(dom.tagName != 'TABLE') {
		do {
			dom = dom.parentNode;
		} while(dom.tagName != 'TABLE');
	}
	var hiddenList = dom.getElementsByClassName(twHiddenClass);
	while(hiddenList.length > 0) {
		hiddenList[0].classList.remove(twHiddenClass);
	}
	var highlightList = dom.getElementsByClassName(twHightlightClass);
	while(highlightList.length > 0) {
		highlightList[0].classList.remove(twHightlightClass);
	}
}