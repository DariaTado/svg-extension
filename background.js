console.log(
    ` __| |____________________________________________| |__
    (__   ____________________________________________   __)
       | |                                            | |
       | |                                            | |
       | |                                            | |
       | |           Background script svg            | |
       | |                                            | |
       | |                                            | |
     __| |ds__________________________________________| |__
    (__   ____________________________________________   __)
       | |                                            | |`
    )

console.log("background script: index.html", chrome.runtime.getURL("index.html"))

const actionUrl = chrome.runtime.getURL("index.html")
chrome.browserAction.onClicked.addListener(function(window)                         
{  
  chrome.tabs.create( {url: actionUrl} )
})