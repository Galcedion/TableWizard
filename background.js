const TABLEWIZARD_MENU_ITEM = "tablewizard-menu-item";

// MENU main
browser.menus.create({
	id: TABLEWIZARD_MENU_ITEM,
	contexts: ["page"],
	title: browser.i18n.getMessage("dropdownMain"),
	visible: false
});

// MENU markfields
browser.menus.create({
	id: 'tw_markfields',
	contexts: ["page"],
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

// MENU spacer markrow
browser.menus.create({
	id: 'tw_spacer_markrow',
	contexts: ["page"],
	type: 'separator',
	visible: true,
	parentId: TABLEWIZARD_MENU_ITEM
});


// MENU rowdel
browser.menus.create({
	id: 'tw_rowdel',
	contexts: ["page"],
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
	contexts: ["page"],
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
	contexts: ["page"],
	type: 'separator',
	visible: true,
	parentId: TABLEWIZARD_MENU_ITEM
});

// MENU coldel
browser.menus.create({
	id: 'tw_coldel',
	contexts: ["page"],
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
	contexts: ["page"],
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

/*
// MENU spacer colexport
browser.menus.create({
	id: 'tw_spacer_colexport',
	contexts: ["page"],
	type: 'separator',
	visible: true,
	parentId: TABLEWIZARD_MENU_ITEM
});

// MENU exportnewtab
browser.menus.create({
	id: 'tw_exportnewtab',
	contexts: ["page"],
	title: browser.i18n.getMessage("dropdownExportNewtab"),
	visible: true,
	parentId: TABLEWIZARD_MENU_ITEM
});

// MENU exportprint
browser.menus.create({
	id: 'tw_exportprint',
	contexts: ["page"],
	title: browser.i18n.getMessage("dropdownexportprint"),
	visible: true,
	parentId: TABLEWIZARD_MENU_ITEM
}); */

// MENU spacer rowreset
browser.menus.create({
	id: 'tw_spacer_rowreset',
	contexts: ["page"],
	type: 'separator',
	visible: true,
	parentId: TABLEWIZARD_MENU_ITEM
});

// MENU reset
browser.menus.create({
	id: 'tw_reset',
	contexts: ["page"],
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

function messageListener(listener) {
	switch(listener.task) {
		case 'enableCM':
			messageListenerDisplayCM(listener);
			break;
	}
}

function messageListenerDisplayCM(listener) {
	if(listener.enableCM) {
		browser.menus.update(TABLEWIZARD_MENU_ITEM, {
			visible: true,
		});
	}
	else
		browser.menus.update(TABLEWIZARD_MENU_ITEM, {visible: false});
	browser.menus.refresh();
}

function messageListenerHideCM() {
	browser.menus.update(TABLEWIZARD_MENU_ITEM, {visible: false});
	browser.menus.refresh();
}

browser.runtime.onMessage.addListener(messageListener);
browser.menus.onHidden.addListener(messageListenerHideCM);