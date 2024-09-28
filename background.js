const TABLEWIZARD_MENU_ITEM = "tablewizard-menu-item";
const TABLEWIZARD_MENU_CONTEXT = ["page", "link", "image", "selection"];

// MENU main
browser.menus.create({
	id: TABLEWIZARD_MENU_ITEM,
	contexts: TABLEWIZARD_MENU_CONTEXT,
	title: browser.i18n.getMessage("dropdownMain"),
	visible: false
});

// MENU markfields
browser.menus.create({
	id: 'tw_markfields',
	contexts: TABLEWIZARD_MENU_CONTEXT,
	title: browser.i18n.getMessage("dropdownMarkFields"),
	visible: true,
	parentId: TABLEWIZARD_MENU_ITEM,
	onclick(info, tab) {
		browser.tabs.executeScript(tab.id, {
			frameId: info.frameId,
			code: `tw_highlight(browser.menus.getTargetElement(${info.targetElementId}));`,
		});
	}
});

// MENU markgrid
browser.menus.create({
	id: 'tw_markgrid',
	contexts: TABLEWIZARD_MENU_CONTEXT,
	title: browser.i18n.getMessage("dropdownMarkGrid"),
	visible: true,
	parentId: TABLEWIZARD_MENU_ITEM,
	onclick(info, tab) {
		browser.tabs.executeScript(tab.id, {
			frameId: info.frameId,
			code: `tw_tablegrid(browser.menus.getTargetElement(${info.targetElementId}));`,
		});
	}
});

// MENU spacer markrow
browser.menus.create({
	id: 'tw_spacer_markrow',
	contexts: TABLEWIZARD_MENU_CONTEXT,
	type: 'separator',
	visible: true,
	parentId: TABLEWIZARD_MENU_ITEM
});

// MENU rowdel
browser.menus.create({
	id: 'tw_rowdel',
	contexts: TABLEWIZARD_MENU_CONTEXT,
	title: browser.i18n.getMessage("dropdownRowDel"),
	visible: true,
	parentId: TABLEWIZARD_MENU_ITEM,
	onclick(info, tab) {
		browser.tabs.executeScript(tab.id, {
			frameId: info.frameId,
			code: `tw_rowdel(browser.menus.getTargetElement(${info.targetElementId}));`,
		});
	}
});

// MENU rowdelbyfield
browser.menus.create({
	id: 'tw_rowdelbyfield',
	contexts: TABLEWIZARD_MENU_CONTEXT,
	title: browser.i18n.getMessage("dropdownRowDelByField"),
	visible: true,
	parentId: TABLEWIZARD_MENU_ITEM,
	onclick(info, tab) {
		browser.tabs.executeScript(tab.id, {
			frameId: info.frameId,
			code: `tw_rowdelbyfield(browser.menus.getTargetElement(${info.targetElementId}));`,
		});
	}
});

// MENU spacer rowcol
browser.menus.create({
	id: 'tw_spacer_rowcol',
	contexts: TABLEWIZARD_MENU_CONTEXT,
	type: 'separator',
	visible: true,
	parentId: TABLEWIZARD_MENU_ITEM
});

// MENU coldel
browser.menus.create({
	id: 'tw_coldel',
	contexts: TABLEWIZARD_MENU_CONTEXT,
	title: browser.i18n.getMessage("dropdownColDel"),
	visible: true,
	parentId: TABLEWIZARD_MENU_ITEM,
	onclick(info, tab) {
		browser.tabs.executeScript(tab.id, {
			frameId: info.frameId,
			code: `tw_coldel(browser.menus.getTargetElement(${info.targetElementId}));`,
		});
	}
});

// MENU coldelbyfield
browser.menus.create({
	id: 'tw_coldelbyfield',
	contexts: TABLEWIZARD_MENU_CONTEXT,
	title: browser.i18n.getMessage("dropdownColDelByField"),
	visible: true,
	parentId: TABLEWIZARD_MENU_ITEM,
	onclick(info, tab) {
		browser.tabs.executeScript(tab.id, {
			frameId: info.frameId,
			code: `tw_coldelbyfield(browser.menus.getTargetElement(${info.targetElementId}));`,
		});
	}
});

// MENU spacer colsort
browser.menus.create({
	id: 'tw_spacer_colsort',
	contexts: TABLEWIZARD_MENU_CONTEXT,
	type: 'separator',
	visible: true,
	parentId: TABLEWIZARD_MENU_ITEM
});

// MENU sort rows asc
browser.menus.create({
	id: 'tw_sortrows_asc',
	contexts: TABLEWIZARD_MENU_CONTEXT,
	title: browser.i18n.getMessage("dropdownSortByRowsASC"),
	visible: true,
	parentId: TABLEWIZARD_MENU_ITEM,
	onclick(info, tab) {
		browser.tabs.executeScript(tab.id, {
			frameId: info.frameId,
			code: `tw_sortrows(browser.menus.getTargetElement(${info.targetElementId}), false);`,
		});
	}
});

// MENU sort rows desc
browser.menus.create({
	id: 'tw_sortrows_desc',
	contexts: TABLEWIZARD_MENU_CONTEXT,
	title: browser.i18n.getMessage("dropdownSortByRowsDESC"),
	visible: true,
	parentId: TABLEWIZARD_MENU_ITEM,
	onclick(info, tab) {
		browser.tabs.executeScript(tab.id, {
			frameId: info.frameId,
			code: `tw_sortrows(browser.menus.getTargetElement(${info.targetElementId}), true);`,
		});
	}
});

// MENU sort columns asc
browser.menus.create({
	id: 'tw_sortbycolumns_asc',
	contexts: TABLEWIZARD_MENU_CONTEXT,
	title: browser.i18n.getMessage("dropdownSortByColumnsASC"),
	visible: true,
	parentId: TABLEWIZARD_MENU_ITEM,
	onclick(info, tab) {
		browser.tabs.executeScript(tab.id, {
			frameId: info.frameId,
			code: `tw_sortcolumns(browser.menus.getTargetElement(${info.targetElementId}), false);`,
		});
	}
});

// MENU sort columns desc
browser.menus.create({
	id: 'tw_sortbycolumns_desc',
	contexts: TABLEWIZARD_MENU_CONTEXT,
	title: browser.i18n.getMessage("dropdownSortByColumnsDESC"),
	visible: true,
	parentId: TABLEWIZARD_MENU_ITEM,
	onclick(info, tab) {
		browser.tabs.executeScript(tab.id, {
			frameId: info.frameId,
			code: `tw_sortcolumns(browser.menus.getTargetElement(${info.targetElementId}), true);`,
		});
	}
});

// MENU spacer sortexport
browser.menus.create({
	id: 'tw_spacer_sortexport',
	contexts: TABLEWIZARD_MENU_CONTEXT,
	type: 'separator',
	visible: true,
	parentId: TABLEWIZARD_MENU_ITEM
});

// MENU exportnewtab
browser.menus.create({
	id: 'tw_exportnewtab',
	contexts: TABLEWIZARD_MENU_CONTEXT,
	title: browser.i18n.getMessage("dropdownExportNewtab"),
	visible: true,
	parentId: TABLEWIZARD_MENU_ITEM,
	onclick(info, tab) {
		browser.tabs.executeScript(tab.id, {
			frameId: info.frameId,
			code: `tw_exportnewtab(browser.menus.getTargetElement(${info.targetElementId}));`,
		});
	}
});

// MENU exportprint
browser.menus.create({
	id: 'tw_exportprint',
	contexts: TABLEWIZARD_MENU_CONTEXT,
	title: browser.i18n.getMessage("dropdownexportprint"),
	visible: true,
	parentId: TABLEWIZARD_MENU_ITEM,
	onclick(info, tab) {
		browser.tabs.executeScript(tab.id, {
			frameId: info.frameId,
			code: `tw_exportprint(browser.menus.getTargetElement(${info.targetElementId}));`,
		});
	}
});

// MENU spacer rowreset
browser.menus.create({
	id: 'tw_spacer_rowreset',
	contexts: TABLEWIZARD_MENU_CONTEXT,
	type: 'separator',
	visible: true,
	parentId: TABLEWIZARD_MENU_ITEM
});

// MENU reset
browser.menus.create({
	id: 'tw_reset',
	contexts: TABLEWIZARD_MENU_CONTEXT,
	title: browser.i18n.getMessage("dropdownreset"),
	visible: true,
	parentId: TABLEWIZARD_MENU_ITEM,
	onclick(info, tab) {
		browser.tabs.executeScript(tab.id, {
			frameId: info.frameId,
			code: `tw_reset(browser.menus.getTargetElement(${info.targetElementId}));`,
		});
	}
});

// handling of content script messages
function messageListener(listener) {
	switch(listener.task) {
		case 'enableCM': // context menu display
			messageListenerDisplayCM(listener);
			break;
		case 'exportNewTab': // data handler for newtab
			exportNewTab(listener);
			break;
	}
}

// toggle the display of TableWizard within the context menu
function messageListenerDisplayCM(listener) {
	if(listener.enableCM)
		browser.menus.update(TABLEWIZARD_MENU_ITEM, {visible: true});
	browser.menus.refresh();
}

// create a new tab with given table data
function exportNewTab(listener) {
	browser.tabs.create({
		url: '/tabletab.html?table=' + listener.tabledata,
		active: true,
	});
}

// hide TableWizard in context menu
function messageListenerHideCM() {
	browser.menus.update(TABLEWIZARD_MENU_ITEM, {visible: false});
	browser.menus.refresh();
}

browser.runtime.onMessage.addListener(messageListener); // listener for content script messages
browser.menus.onHidden.addListener(messageListenerHideCM); // listener for when context menu is closed