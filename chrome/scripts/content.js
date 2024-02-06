const brw = chrome;
let constants;
let phidToPatternTypeMap = {};

initPatternHighlighter();

async function initPatternHighlighter(){
    const activationState = await brw.runtime.sendMessage({ action: "getActivationState" });
    if (activationState.isEnabled === true) {
        constants = await import(await brw.runtime.getURL("scripts/constants.js"));
        if (!constants.patternConfigIsValid) {
            console.error(brw.i18n.getMessage("errorInvalidConfig"));
            return;
        }
        console.log(brw.i18n.getMessage("infoExtensionStarted"));
        await patternHighlighting();
        brw.runtime.onMessage.addListener(function (message, sender, sendResponse) {
            console.log(message);
            if (message.action === "getPatternCount") {
                sendResponse(getPatternsResults());
            } else if (message.action === "redoPatternHighlighting") {
                patternHighlighting();
                sendResponse({ started: true });
            } else if ("showElement" in message) {
                showElement(message.showElement);
                sendResponse({ success: true });
            }
        });
    } else {
        console.log(brw.i18n.getMessage("infoExtensionDisabled"))
    }
}

const observer = new MutationObserver(async function () {
    await patternHighlighting(true);
});

async function patternHighlighting(waitForChanges = false) {
    if (this.lock === true) {
        return;
    }
    this.lock = true;
    observer.disconnect();
    if (waitForChanges === true) {
        await new Promise(resolve => { setTimeout(resolve, 2000) });
    }
    addPhidForEveryElement(document.body);
    let domCopyA = document.body.cloneNode(true);
    removeBlacklistNodes(domCopyA);
    await new Promise(resolve => { setTimeout(resolve, 1536) });
    addPhidForEveryElement(document.body);
    let domCopyB = document.body.cloneNode(true);
    removeBlacklistNodes(domCopyB);
    resetDetectedPatterns();
    findPatternDeep(domCopyB, domCopyA);
    domCopyA.replaceChildren();
    domCopyA = null;
    domCopyB.replaceChildren();
    domCopyB = null;
    sendResults();
    observer.observe(document.body, {
        subtree: true,
        childList: true,
        attributes: true,
        characterData: true,
    });
    this.lock = false;
}

function addPhidForEveryElement(dom) {
    this.counter = this.counter || 0;
    for (const node of dom.querySelectorAll("*")) {
        if (!node.dataset.phid) {
            node.dataset.phid = this.counter;
            this.counter += 1;
        }
    }
}

function getElementByPhid(dom, id) {
    return dom.querySelector(`[data-phid="${id}"]`)
}

function removeBlacklistNodes(dom) {
    for (const elem of dom.querySelectorAll(constants.tagBlacklist.join(","))) {
        elem.remove();
    }
}

function findPatterInNode(node, nodeOld) {
    for (const pattern of constants.patternConfig.patterns) {
        for (const func of pattern.detectionFunctions) {
            if (func(node, nodeOld)) {
                return pattern.className;
            }
        }
    }
    return null;
}

function findPatternDeep(node, domOld) {
    for (const child of node.children) {
        findPatternDeep(child, domOld);
    }
    let nodeOld = getElementByPhid(domOld, node.dataset.phid);
    let foundPattern = findPatterInNode(node, nodeOld);
    if (foundPattern) {
        let elem = getElementByPhid(document, node.dataset.phid);
        phidToPatternTypeMap[node.dataset.phid] = foundPattern;
        if (elem) {
            elem.classList.add(
                constants.patternDetectedClassName,
                constants.extensionClassPrefix + foundPattern
            );
        }
        if (nodeOld) {
            nodeOld.remove();
        }
        node.remove();
    }
}

function resetDetectedPatterns() {
    let regx = new RegExp("\\b" + constants.extensionClassPrefix + "[^ ]*[ ]?\\b", "g");
    document.querySelectorAll("." + constants.patternDetectedClassName).forEach(
        function (node) {
            node.className = node.className.replace(regx, "");
        }
    );
}

function elementIsVisible(elem) {
    const computedStyle = getComputedStyle(elem);
    if (computedStyle.visibility == "hidden" || computedStyle.display == "none" || computedStyle.opacity == "0") {
        return false;
    }
    return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
};

function getPatternsResults() {
    let results = {
        "patterns": [],
        "countVisible": 0,
        "count": 0,
    }
    for (const pattern of constants.patternConfig.patterns) {
        let elementsVisible = [];
        let elementsHidden = [];
        for (const elem of document.getElementsByClassName(constants.extensionClassPrefix + pattern.className)) {
            if (elementIsVisible(elem)) {
                elementsVisible.push(elem.dataset.phid);
            } else {
                elementsHidden.push(elem.dataset.phid);
            }
        }
        results.patterns.push({
            name: pattern.name,
            elementsVisible: elementsVisible,
            elementsHidden: elementsHidden,
        });
        results.countVisible += elementsVisible.length;
        results.count += elementsVisible.length + elementsHidden.length;
    }
    return results;
}

function sendResults() {
    let results = getPatternsResults();
    brw.runtime.sendMessage(results, function (response) { });
    console.log(brw.i18n.getMessage("infoNumberPatternsFound", [results.countVisible.toString()]));
}

function getAbsoluteOffsetFromBody(elem) {
    const rect = elem.getBoundingClientRect();
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY
    };
}

function showElement(phid) {
    for (const element of document.getElementsByClassName(constants.currentPatternClassName)) {
        element.remove();
    }
    let elem = getElementByPhid(document, phid);
    if (elem == null) {
        return;
    }
    elem.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center"
    });
    let highlightShadowElem = document.createElement("div");
    highlightShadowElem.style.position = "absolute";
    highlightShadowElem.style.height = elem.offsetHeight + "px";
    highlightShadowElem.style.width = elem.offsetWidth + "px";
    let elemXY = getAbsoluteOffsetFromBody(elem);
    highlightShadowElem.style.top = elemXY.top + "px";
    highlightShadowElem.style.left = elemXY.left + "px";
    highlightShadowElem.classList.add(constants.currentPatternClassName);
    document.body.appendChild(highlightShadowElem);

    let patternType = phidToPatternTypeMap[phid];
    let patternBox = document.createElement("div");
    patternBox.textContent = "☝️ " + patternType + " pattern found"
    patternBox.style.position = "absolute"
    patternBox.style.top = elemXY.top + "px";
    patternBox.style.left = elemXY.left + "px";
    patternBox.classList.add('pattern-box');
    document.body.appendChild(patternBox);

    setTimeout(() => {
        patternBox.remove();
    }, 10000);
}

