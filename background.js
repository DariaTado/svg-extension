

chrome.browserAction.onClicked.addListener(function(window)                         
{  
    let url = chrome.runtime.getURL("index.html")
    if (url){
        console.log("adding listener to browser action: new window", url)
        chrome.windows.create( {url: url, type: "normal"} )
    }
})

/* chrome.runtime.onInstalled.addListener(function() {
    // Replace all rules ...
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      // With a new rule ...
      chrome.declarativeContent.onPageChanged.addRules([
        {
          // That fires when a page's URL contains a 'g' ...
          conditions: [
            new chrome.declarativeContent.PageStateMatcher({
              pageUrl: { urlContains: 'hvactool' },
            })
          ],
          // And shows the extension's page action.
          actions: [ new chrome.declarativeContent.ShowPageAction() ]
        }
      ]);
    });
  }); 
  
  */