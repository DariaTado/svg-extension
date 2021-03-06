// Saves options to chrome.storage
function save_options() {
    var svgPageSource = document.getElementById('index-page-source').value;
    chrome.storage.sync.set({
        svgPageSource: svgPageSource
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
        document.getElementById('index-page-source').value = items.svgPageSource;
    });
}

console.log("svg-extension options.js--------->")

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);

console.log("svg-extension options.js<---------")
