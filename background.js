/**
 * Switch to last used tab after closing a current one.
 */
(function(){
    // wrap in function scope, just in case
    
    var browserWindows = {};

    chrome.tabs.onSelectionChanged.addListener(function(tabId, selectInfo) {
        var windowId = selectInfo.windowId;

        if (typeof browserWindows[windowId] === 'undefined') {
            browserWindows[windowId] = {
                currentTabId: null,
                previousTabId: null
            }
        }

        browserWindows[windowId].previousTabId = browserWindows[windowId].currentTabId;
        browserWindows[windowId].currentTabId = tabId;

        if (browserWindows[windowId].currentTabId == browserWindows[windowId].previousTabId) {
            browserWindows[windowId].previousTabId = null;
        }
    });


    chrome.tabs.onRemoved.addListener(function(tabId, removedInfo) {
        if (typeof browserWindows[removedInfo.windowId] === 'undefined') {
            return;
        }

        if (removedInfo.isWindowClosing) {
            delete browserWindows[removedInfo.windowId];
            return;
        }

        if (tabId != browserWindows[removedInfo.windowId].currentTabId) {
            // don't do anything if not current tab is being closed
            return;
        }

        if (browserWindows[removedInfo.windowId].previousTabId !== null) {
            // switch to that tab
            chrome.tabs.update(browserWindows[removedInfo.windowId].previousTabId, {selected: true});
        }
    });
})();
