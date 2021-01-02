# Label generator (svg-extension)
This is a Google Chrome extension that helps creating sticker(labels) images for using in the installation instructions documents.
If the extension starts correctly, you will see:

  - `'Labels...'` button will appear next to the interface on the *hvac-tool* pages (in the System View)
  - Clicking the `'Labels...'` button will open a new window (new tab) with the labeling pictures (stickers) and connect-box (connect wires to the box) pictures. 
	- Clicking the extension icon (in the Chrome top bar) will open a new window with some default Labels...
	- in the Extensions list you will see the 'cat' icon of the 'svg-extension'

# Installation
Note 1: It should not be necessary to remove previous version of the extension.
Note 2: Since this extension is not published in the Chrome WebStore, there is only one way to download and install it: from a ZIP archive.

## Download
Goto the GitHub page of this project (if you are reading this, you are already at this page). Make sure that you are in the correct branch of the GitHub. At the moment it is: https://github.com/tadodotcom/InstallationsAndHVACDatabase/tree/label-generator-v1.4

From the GitHub, click the tab **'< > Code'**. When the 'Code' page is loaded, at the top-right you will notice a large green button **'Code'**. 

1. Click the big green **'Code'** button and in the drop-down list click the **'Download ZIP'** item. 
1. Save the ZIP file to your local folder. 
1. Open your file manager and navigate to the downloads folder. 
1. Find your downloaded ZIP archive file. 
1. Unpack the archive into a folder (right-click the file and select 'Extract here')
1. Goto the Chrome browser. Click the *puzzle piece-shaped Extensions icon* located to the right of Chrome's Omnibox and in the drop-down list click **'Manage Extensions'**. 
1. From the Extensions page enable the *developer mode* by clicking the **'Developer mode'** slider. 
1. When the *developer mode* is *on* you will see two new buttons: 'Pack extension' and 'Load unpacked'. 
1. Click the **'Load unpacked'** button and navigate to the folder where the ZIP archive is extracted to (and click the 'Open' button in the dialog window to confirm). 

Correctly installed 'svg-extension' should show up in the list with the 'cat'<i class="fas fa-cat"></i> icon.

**Refresh(F5) the *hvac-tool* page** to let the svg-extension start working on it. If the extension starts correctly, you will see:

  - `'Labels...'` button will appear next to the interface on the *hvac-tool* pages (in the System View)
  - Clicking the `'Labels...'` button will open a new window (new tab) with the labeling pictures (stickers) and connect-box (connect wires to the box) pictures. 
	- Clicking the extension icon (in the Chrome top bar) will open a new window with some default Labels...

# How to start the script
There are two ways to start the extension, once it is installed in your Chrome browser: 

 1. From the hvac-tool page: by clicking the `'Labels...'` button on the *hvac-tool* *system* page
 2. From outside the hvac-or dicrectly, by clicking the extension icon (in the Chrome top bar).

# What can it do
You can edit the labels with the Label generator, make screenshot with means of your OS / browser and paste the screenshot in the instructions document. 
OR
You can save the picture as a file (.svg or .png*). *\*Bug: to save a .png you need to click the link *****

Outside the *hvac-tool*, the Label-generator page opens with some default stickers. 
From the *hvac-tool* (when you click on the `'Labels...'` button), the page opens with calculated stickers. The header will contain the systems name and manufacturer.

The page contains stickers for all devices and connect-box pictures for some devices.* *\*Starting from v1.4*

You can change how the stickers look and labelled:

- hide sticker
- dash (make the arrowline and eclosing circle dashed)
- edit the writing text and:
  - if the length of the writing is longer than 3, the enclosing circle will be removed
  - if the writing is empty, the connect-box picture wire will be removed 
  - if the wiring requires a *bridge*, the connect-box picture will be updated with the *bridge*
    - if the *bridge* is not supported, it will be yellow
    
Under each picture on the page there will be two links: labeling.svg and labeling.png. Hint: first time you need to click the link ***twice*** to download the image file.

