/**
 * @filedescription Initializes the extension's background page.
 */

//var nav = new NavigationCollector();
/* var eventList = ['onBeforeNavigate', 'onCreatedNavigationTarget',
  'onCommitted', 'onCompleted', 'onDOMContentLoaded',
  'onErrorOccurred', 'onReferenceFragmentUpdated', 'onTabReplaced',
  'onHistoryStateUpdated']; */
var eventList = ['onBeforeNavigate', 'onCreatedNavigationTarget',
  'onCommitted', 'onCompleted', 'onDOMContentLoaded',
  'onErrorOccurred', 'onReferenceFragmentUpdated', 'onTabReplaced',
  'onHistoryStateUpdated'];
eventList.forEach(function (e) {
  chrome.webNavigation[e].addListener(function (data) {
    if (typeof data) {
      if (data.url.match(/hvactool\.tado\.com\/(\w+)\//)) {
        let term = data.url.match(/hvactool\.tado\.com\/(\w+)\//)[1]
        //console.log(e, term);
        if (-1 !== [
          "translationModule"
          , "remote"
          , "roomThermostat"
          , "rfRoomThermostat"
          , "roomThermostatReceiver"
          , "auxiliaryControl"
          , "boiler"
          , "boilerControl"
          , "boilerControlWithFitsIn"
        ].indexOf(term)) {
          console.log(e, term)
          if (("onCompleted" === e) || ("onHistoryStateUpdated" === e)) {
            console.log("----> content script on:", data.tabId, data.url)
            chrome.tabs.executeScript(data.tabId, {
              file: "contentScript.js"
            })
          } else {
            //console.log(e, term, " - this event is ignored for this term by the extesion")
          }
        } else {
          //console.log(e, term, "ignore")
        }

      } else {
        console.log(e, "this traffic is not *hvactool*, thus is ignored by the extension")
      }
    }
    else {
      console.error('inHandlerError', e)
    }
  });
});
// Reset the navigation state on startup. We only want to collect data within a
// session.
/* chrome.runtime.onStartup.addListener(function () {
  nav.resetDataStorage();
}); */

console.log(`
----------------------------------
|           svg-extension        |
|         Background script      |
|                                |
|   will add the index.html link |
|        to the 'cat' button     |
|                                |
`)

const doSync = true
let actionUrl = chrome.runtime.getURL("index.html")
if (doSync) {
  chrome.storage.sync.get({
    svgPageSource: 'self'
  }, function (items) {
    console.log("Stored value for page source:", items.svgPageSource);
    if('self' !== items.svgPageSource ){
      actionUrl = items.svgPageSource
    }
    console.log("Browser action url:", actionUrl)
    chrome.browserAction.onClicked.addListener(function (window) {
      chrome.tabs.create({ url: actionUrl }) 
    })
  });
} else {
  console.log("Browser action url:", actionUrl)
  chrome.browserAction.onClicked.addListener(function (window) {
    chrome.tabs.create({ url: actionUrl }) 
  })
}

console.log(`
|           svg-extension        |
|        Background script       |
|            The End.            |
|ds______________________________|
`)