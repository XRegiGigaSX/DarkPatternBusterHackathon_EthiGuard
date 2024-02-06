const brw = chrome;

const activationPrefix = "activation_";
const storage = brw.storage.session || brw.storage.local;

async function getActivation(tabId) {
    return (await storage.get(`${activationPrefix}${tabId}`))[`${activationPrefix}${tabId}`];
}

async function setActivation(tabId, activation) {
    await storage.set({ [`${activationPrefix}${tabId}`]: activation });
}

async function removeActivation(tabId) {
    await storage.remove(`${activationPrefix}${tabId}`);
}

async function getActivationOrSetDefault(tabId) {
    let activation = await getActivation(tabId);
    if (activation === undefined) {
        activation = true;
        await setActivation(tabId, activation);
    }
    return activation;
}

brw.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if ("countVisible" in message) {
        getActivation(sender.tab.id).then((activation) => {
            if (activation === true) {
                displayPatternCount(message.countVisible, sender.tab.id);
            }
            sendResponse({ success: true });
        });
    } else if ("enableExtension" in message && "tabId" in message) {
        setActivation(message.tabId, message.enableExtension).then(() => {
            if (!message.enableExtension) {
                displayPatternCount("", message.tabId);
            }
            sendResponse({ success: true });
        });
    } else if ("action" in message && message.action == "getActivationState") {
        let tabId = message.tabId || sender.tab.id;
        getActivationOrSetDefault(tabId).then((activation) => {
            sendResponse({ isEnabled: activation });
        });
    } else {
        sendResponse({ success: false });
    }
    return true;
});

brw.tabs.onReplaced.addListener(async (addedTabId, removedTabId) => {
    await setActivation(addedTabId, await getActivation(removedTabId));
    await removeActivation(removedTabId);
});

brw.tabs.onRemoved.addListener(async (tabId) => {
    await removeActivation(tabId);
});

const iconsDefault = brw.runtime.getManifest().icons;
const iconsDisabled = Object.fromEntries(
    Object.entries(iconsDefault).map(([resolution, path]) => [resolution, `${path.slice(0, -4)}_grey.png`])
);

brw.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    const isHttpOrHttps = tab.url.toLowerCase().startsWith("http://") || tab.url.toLowerCase().startsWith("https://");
    const iconPath = isHttpOrHttps ? iconsDefault : iconsDisabled;

    brw.action.setIcon({ path: iconPath, tabId: tabId });
});

function displayPatternCount(count, tabId) {
    brw.action.setBadgeText({ tabId: tabId, text: count.toString() });

    const bgColor = count === 0 ? [0, 255, 0, 255] : [255, 0, 0, 255];
    brw.action.setBadgeBackgroundColor({ tabId: tabId, color: bgColor });
}

