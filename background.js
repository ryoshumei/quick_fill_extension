// Description: This file is responsible for the context menu item and its functionality
//
chrome.runtime.onInstalled.addListener(() => {
    // create the context menu item
    chrome.contextMenus.create({
        id: "parent",
        title: "Fill form with saved data",
        contexts: ["editable"]
    });

    // child menu items
    chrome.contextMenus.create({
        id: "fillEmail",
        parentId: "parent",
        title: "Email : example@example.com",
        contexts: ["editable"]
    });
    chrome.contextMenus.create({
        id: "fillEmail1",
        parentId: "parent",
        title: "Email username : example",
        contexts: ["editable"]
    });
    chrome.contextMenus.create({
        id: "fillEmail2",
        parentId: "parent",
        title: "Email domain : example.com",
        contexts: ["editable"]
    });
    chrome.contextMenus.create({
        id: "fillAddress",
        parentId: "parent",
        title: "Address : 東京都中央区日本橋1-1-1サンプルビルディング101号室",
        contexts: ["editable"]
    });
    chrome.contextMenus.create({
        id: "fillAddress1",
        parentId: "parent",
        title: "Address 1 : 東京都中央区",
        contexts: ["editable"]
    });
    chrome.contextMenus.create({
        id: "fillAddress2",
        parentId: "parent",
        title: "Address 2 : 日本橋1-1-1",
        contexts: ["editable"]
    });
    chrome.contextMenus.create({
        id: "fillAddress3",
        parentId: "parent",
        title: "Address 3 : サンプルビルディング101号室",
        contexts: ["editable"]
    });
    chrome.contextMenus.create({
        id: "fillPhone1",
        parentId: "parent",
        title: "Phone 1 : 080-1234-5678",
        contexts: ["editable"]
    });
    chrome.contextMenus.create({
        id: "fillPhone2",
        parentId: "parent",
        title: "Phone 2 : 08012345678",
        contexts: ["editable"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    // create a array of all the child menu item ids
    const childMenuItems = [
        'fillEmail',
        'fillEmail1',
        'fillEmail2',
        'fillAddress',
        'fillAddress1',
        'fillAddress2',
        'fillAddress3',
        'fillPhone1',
        'fillPhone2'
    ];
    const dataIds = [
        'email',
        'email1',
        'email2',
        'address',
        'address1',
        'address2',
        'address3',
        'phone1',
        'phone2'
    ];
    // creat a map of child menu item ids and data ids
    const childMenuItemsMap = new Map();
    childMenuItems.forEach((item, index) => {
        childMenuItemsMap.set(item, dataIds[index]);
    });
    // check if the clicked menu item is a child menu item
    const menuItemName = info.menuItemId;
    if (childMenuItems.includes(menuItemName)) {
        dataId = childMenuItemsMap.get(menuItemName);
        // execute the content script
        chrome.scripting.executeScript({
            target: {tabId: tab.id},
            func: triggerFillFormInContentScript,
            args: [dataId]
        });
    }
});

function triggerFillFormInContentScript(menuItemName) {

    // Get data from chrome storage
    chrome.storage.local.get('user_data', function (result) {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            return;
        }
        const dataInStorage = result.user_data;
        // create a array of all the data ids
        const email = dataInStorage.emailUser + '@' + dataInStorage.emailDomain;
        const email1 = dataInStorage.emailUser;
        const email2 = dataInStorage.emailDomain;
        const address = dataInStorage.address1 + dataInStorage.address2 + dataInStorage.address3;
        const address1 = dataInStorage.address1;
        const address2 = dataInStorage.address2;
        const address3 = dataInStorage.address3;
        const phone1 = dataInStorage.phone1 + '-' + dataInStorage.phone2 + '-' + dataInStorage.phone3;
        const phone2 = dataInStorage.phone1 + dataInStorage.phone2 + dataInStorage.phone3;
        const data = {
            email,
            email1,
            email2,
            address,
            address1,
            address2,
            address3,
            phone1,
            phone2
        }
        // console.log('this is background.js');
        // console.log(data);
        // console.log(data[menuItemName]);
        // Send a custom event to the content script
        // Make an event object
        const event = new CustomEvent('fillForm', {detail: data[menuItemName]});
        // Dispatch the event
        document.dispatchEvent(event); // content script will receive the event
    });
}
