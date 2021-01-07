// Saves options to chrome.storage
function save_options() {
    var newSource = document.getElementById('index-page-source').value;
    if (newSource) {
        document.getElementById("test-link").href = newSource
        document.getElementById("test-link").textContent = newSource
    } else {
        document.getElementById("test-link").href = chrome.runtime.getURL("index.html")
        document.getElementById("test-link").textContent = "local"
    }
    chrome.storage.sync.set({
        svgPageSource: newSource
    }, function () {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.textContent = '';
        }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
        svgPageSource: 'self'
    }, function (items) {
        if (items && items.svgPageSource) {
            document.getElementById('index-page-source').value = items.svgPageSource;
            document.getElementById("test-link").href = items.svgPageSource
            document.getElementById("test-link").textContent = items.svgPageSource
        } else {
            document.getElementById("test-link").href = chrome.runtime.getURL("index.html")
            document.getElementById("test-link").textContent = "local"
        }

    });
}

console.log("svg-extension options.js--------->")

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);

console.log("svg-extension options.js<---------")
