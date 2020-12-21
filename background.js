/**
 * @filedescription Initializes the extension's background page.
 */

//var nav = new NavigationCollector();
/* var eventList = ['onBeforeNavigate', 'onCreatedNavigationTarget',
  'onCommitted', 'onCompleted', 'onDOMContentLoaded',
  'onErrorOccurred', 'onReferenceFragmentUpdated', 'onTabReplaced',
  'onHistoryStateUpdated']; */
var eventList = [ 'onCompleted', 'onHistoryStateUpdated'];
eventList.forEach(function (e) {
  chrome.webNavigation[e].addListener(function (data) {
    if (typeof data) {
      if (data.url.match(/hvactool\.tado\.com\/(\w+)\//)) {
        let term = data.url.match(/hvactool\.tado\.com\/(\w+)\//)[1]
        console.log(e, term);
        if (-1 !== [
          "translationModule"
          ,"remote"
          , "roomThermostat"
          , "rfRoomThermostat"
          , "roomThermostatReceiver"
          , "auxiliaryControl"
          , "boiler"
          , "boilerControl"
          , "boilerControlWithFitsIn"
        ].indexOf(term)) {
          if (("onCompleted" === e) || ("onHistoryStateUpdated" === e)) {
            console.log("----> content script on:", data.tabId, data.url)
            chrome.tabs.executeScript(data.tabId, {
              file: "contentScript.js"
            })
          }
        }

      }
    }
    else
      console.error(chrome.i18n.getMessage('inHandlerError'), e);
  });
});
// Reset the navigation state on startup. We only want to collect data within a
// session.
/* chrome.runtime.onStartup.addListener(function () {
  nav.resetDataStorage();
}); */

console.log(`
 __| |____________________________________________| |__
(__   ____________________________________________   __)
   | |                                            | |
   | |            Background script               | |
   | |                                            | |
   | |      will add the index.html link          | |
   | |           to the 'cat' button              | |
 __| |ds__________________________________________| |__
(__   ____________________________________________   __)
   | |                                            | |`)
const actionUrl = chrome.runtime.getURL("index.html")
console.log("index.html's url:", actionUrl)
chrome.browserAction.onClicked.addListener(function (window) {
  chrome.tabs.create({ url: actionUrl }) //opens the page with 'default' stickers
})