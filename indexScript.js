const isVerboseGetParams = true
const isVerboseHideSticker = false
const isVerboseDashed = false
const isVerboseWriting = false
const devices = ["BP", "BR", "BU", "RU", "LT", "TC"]
const deviceTerminals = {
    "BP": ["N", "L", "CH_COM", "CH_NC", "CH_NO", "HW_COM", "HW_NC", "HW_NO", "EARTH", "P1", "P2"],
    "BR": ["N", "L", "COM", "NC", "NO", "P1", "P2", "P3", "AnalogOut_A", "GND_B", "VCC_C"],
    "BU": ["N", "L", "NC2", "NC1", "NO2", "NO1", "AnalogOut_A", "GND_B", "VCC_C"],
    "RU": ["NO", "NC", "COM", "P1", "P2", "P3", "AnalogOut_A", "GND_B", "VCC_C"],
    "TC": ["COM", "NO", "P1", "P2", "P3"],
    "LT": ["NO", "NC", "COM", "P1", "P2", "P3"]
}
const defaultLabels = {
    "BP": { "N": "N", "L": "L", "CH_NC": "2", "CH_NO": "4", "HW_NC": "1", "HW_NO": "3", "EARTH": "\u23DA;" },
    "BR": { "COM": "COM", "NO": "NO" },
    "BU": { "N": "N", "L": "L", "NC2": "1", "NC1": "2", "NO2": "3", "NO1": "4" },
    "RU": { "NO": "NO", "NC": "NC", "COM": "L", "P1": "N" },
    "TC": { "COM": "COM", "NO": "NO", "P1": "L", "P2": "N" },
    "LT": { "NO": "NO", "COM": "COM", "P1": "L", "P2": "N" }
}
const friendlyNames = {
    "BP": ["N", "L", "CH_COM", "CH_NC", "CH_NO", "HW_COM", "HW_NC", "HW_NO", "EARTH", "P1", "P2"],
    "BR": ["N", "L", "COM", "NC", "NO", "P1", "P2", "P3", "A", "minus", "plus"],
    "BU": ["N", "L", "1", "4", "3", "4", "A", "minus", "plus"],
    "RU": ["NO", "NC", "COM", "P1", "P2", "P3", "A", "minus", "plus"],
    "TC": ["COM", "NO", "P1", "P2", "P3"],
    "LT": ["NO", "NC", "COM", "P1", "P2", "P3"]
}
const friendlyWritings = {
    "BP": ["N", "L", "COM", "NC", "NO", "HW COM", "HW Off", "HW On", "EARTH", "P1", "P2"],
    "BR": ["N", "L", "COM", "NC", "NO", "P1", "P2", "P3", "A", "\u2212", "+"],
    "BU": ["N", "L", "1", "4", "3", "4", "A", "\u2212", "+"],
    "RU": ["NO", "NC", "COM", "P1", "P2", "P3", "A", "\u2212", "+"],
    "TC": ["COM", "NO", "P1", "P2", "P3"],
    "LT": ["NO", "NC", "COM", "P1", "P2", "P3"]
}


function addOrSetProperty(obj, nameStr, value) {
    //console.log("adding or setting property of", obj, nameStr, value)
    let names = nameStr.split(".")
    if (1 < names.length) {
        if (!obj.hasOwnProperty(names[0])) { obj[names[0]] = {} }
        addOrSetProperty(obj[names[0]], names.slice(1, names.length).join("."), value)
    } else {
        if (value.match(/\[.*\]/) || value.match(/\{.*\}/)) {
            obj[names[0]] = JSON.parse(value)
        } else {
            obj[names[0]] = value
        }
    }
}

const connectLabel2tadoStickerMap = {
    BP: {
        LabelN: "N"
        , LabelL: "L"
        , LabelCHCOM: "CH_COM"
        , LabelCHNC: "CH_NC"
        , LabelCHNO: "CH_NO"
        , LabelHWCOM: "HW_COM"
        , LabelHWNC: "HW_NC"
        , LabelHWNO: "HW_NO"
        , LabelGround: "EARTH"
    }

}
function getTadoStickerByConnectLabel(device, label) {
    if (connectLabel2tadoStickerMap.hasOwnProperty(device)) {
        if (connectLabel2tadoStickerMap[device].hasOwnProperty(label)) {
            return connectLabel2tadoStickerMap[device][label]
        }
    }
    return null
}

function getFriendlyName(device, tadoSticker) {
    let index = deviceTerminals[device].indexOf(tadoSticker)
    if (-1 !== index) {
        let friendlyName = friendlyNames[device][index]
        return friendlyName ? friendlyName : tadoSticker
    }
    return tadoSticker
}

function getFriendlyWriting(device, tadoSticker) {
    let index = deviceTerminals[device].indexOf(tadoSticker)
    if (-1 !== index) {
        let friendlyName = friendlyWritings[device][index]
        return friendlyName ? friendlyName : tadoSticker
    }
    return tadoSticker
}

function isTerminalOptional(device, terminal) {
    if (terminal.match(/NC/)) { return true }
    if ("N" === terminal) {
        if (-1 !== ["RU", "TC", "LT"].indexOf(device)) { return true }
    }
    return false
}

function payload2obj(payload) {
    if (payload) {
        let splitPayload = payload.split("&").filter(elem => { return elem })
        console.log("payload tokens:", splitPayload)
        let obj = {}
        for (let token of splitPayload) {
            let name = token.split("=")[0]
            let value = token.split("=")[1]
            addOrSetProperty(obj, name, value)
        }
        return obj
    }
    return null
}

/* function numeriseParameters(params) {
    Object.keys(params)
        .filter(key => { return key.match(/Id$/m) })
        .forEach(key => { params[key] = Number(params[key]) })
    Object.keys(params).forEach(key => {
        if (params[key] && ("string" === typeof params[key]) && ("true" === params[key].toLowerCase())) {
            params[key] = true
        } else if (params[key] && ("string" === typeof params[key]) && ("false" === params[key].toLowerCase())) {
            params[key] = false
        }
    })
    return params
} */

function updateFromDashedInput(element) {
    if (element) {
        let device = element.id.split("-")[1]
        let deviceTerminal = element.id.split("-")[2]

        if (element.checked) {
            menus[device][deviceTerminal].circle.setAttribute("stroke-dasharray", 5)
            menus[device][deviceTerminal].arrowLine.setAttribute("stroke-dasharray", 5)
        } else {
            menus[device][deviceTerminal].circle.removeAttribute("stroke-dasharray")
            menus[device][deviceTerminal].arrowLine.removeAttribute("stroke-dasharray")
        }
    } else { console.log("!updateDashFromInputElement() called with element = ", element)}
}

function updateFromWritingInput(str, device, deviceTerminal) {
        if (menus[device][deviceTerminal].writingElem) {
            menus[device][deviceTerminal].writingElem.textContent = str
            if (3 < str.length) {
                let oldTransform = menus[device][deviceTerminal].writingElem.getAttribute("transform")
                if (oldTransform) {
                    let rotatePos = oldTransform.indexOf("rotate")
                    if (-1 !== rotatePos) {
                        oldTransform = oldTransform.substr(0, rotatePos - 1)
                    }
                }
                let newTransform = [oldTransform, "rotate(-45)"].join(" ")
                menus[device][deviceTerminal].writingElem.setAttribute("transform", newTransform)
                menus[device][deviceTerminal].circle.style.display = 'none'
            } else {
                let oldTransform = menus[device][deviceTerminal].writingElem.getAttribute("transform")
                if (oldTransform) {
                    let rotatePos = oldTransform.indexOf("rotate")
                    if (-1 !== rotatePos) {
                        oldTransform = oldTransform.substr(0, rotatePos - 1)
                    }
                }
                let newTransform = oldTransform
                menus[device][deviceTerminal].writingElem.setAttribute("transform", newTransform)
                menus[device][deviceTerminal].circle.style.display = ''
            }
            if ("" !== str) {
                if (isVerboseWriting) { console.log(device, deviceTerminal, "writing not empty") }
                menus[device][deviceTerminal].arrowGroup.setAttribute("display", null)
                menus[device][deviceTerminal].labelGroup.setAttribute("display", null)
            } else {
                if (isVerboseWriting) { console.log(device, deviceTerminal, "empty") }
                menus[device][deviceTerminal].arrowGroup.setAttribute("display", "none")
                menus[device][deviceTerminal].labelGroup.setAttribute("display", "none")
            }
        } else { console.log("!", device, deviceTerminal, "writingElem is ", menus[device][deviceTerminal].writingElem) }
}

function handleHideStickerChange(e) {
    let element = e.target
    let device = element.id.split("-")[1]
    let tadoSticker = element.id.split("-")[2]

    if (element.checked) {
        menus[device][tadoSticker].group.setAttribute("display", "none")
    } else {
        menus[device][tadoSticker].group.removeAttribute("display")
    }
}

function handleWritingChange(e) { 
    if (element) {
        let device = element.id.split("-")[1]
        let deviceTerminal = element.id.split("-")[2]
        updateFromWritingValue(element.value.toString(), device, deviceTerminal)
    } else { console.log("!updateWritingFromInput() called with element = ", element) }
}
function handleDashedChange(e) { updateFromDashedInput(e.target) }
function onWritingChange(e) { handleWritingChange(e) }
function onWritingKeyUp(e) { handleWritingChange(e) }
function onWritingInput(e) { handleWritingChange(e) }
function onWritingPaste(e) { handleWritingChange(e) }
function onDashedInput(e) { handleDashedChange(e) }
function onDashedChange(e) { handleDashedChange(e) }
function onHideStickerInput(e) { handleHideStickerChange(e) }
function onHideStickerChange(e) { handleHideStickerChange(e) }

// ------------------------------------------------------------------------------------------------------
//       Matching function
// ------------------------------------------------------------------------------------------------------
function matchDeviceWithSystemTerminalsAndLabels(device, terminalsAndLabels) {
    // returns { matched, optional, writing } , where "matched" is the matched-with system's terminal name
    //console.log("Matching", device, tadoStickers[device], "with", terminalsAndLabels)
    let deviceStickerWithLabels = {}
    for (let systemTerminal in terminalsAndLabels) {
        let matchedTadoLabel = null
        let mandatory = false
        let stickerItem = null
        //console.log("device:", device, ", system terminal:", systemTerminal)
        if (-1 !== deviceTerminals[device].indexOf(systemTerminal)) {
            //exact match
            matchedTadoLabel = systemTerminal

        } else {
            //console.log("No exact match:", device, systemTerminal, tadoStickers[device])
            switch (device) {
                case "BP":
                    switch (systemTerminal) {
                        case "COM":
                        case "COM1":
                            matchedTadoLabel = "CH_COM"
                            break
                        case "NO":
                        case "NO1":
                            matchedTadoLabel = "CH_NO"
                            break
                        case "NC":
                        case "NC1":
                            matchedTadoLabel = "CH_NC"
                            break
                        case "COM2":
                            matchedTadoLabel = "HW_COM"
                            break
                        case "NO2":
                            matchedTadoLabel = "HW_NO"
                            break
                        case "NC2":
                            matchedTadoLabel = "HW_NC"
                            break
                    }
                    break
                case "BR":
                    switch (systemTerminal) {
                        case "COM1":
                            matchedTadoLabel = "COM"
                            break
                        case "NO1":
                            matchedTadoLabel = "NO"
                            break
                        case "NC1":
                            matchedTadoLabel = "NC"
                            break
                    }
                    break
                case "BU":
                    switch (systemTerminal) {
                        case "COM":
                            matchedTadoLabel = "NC2" //terminal 1
                            mandatory = true
                            break
                        case "NO":
                            matchedTadoLabel = "NO1" //terminal 4
                            break
                        case "NC":
                            matchedTadoLabel = "NC1"  //terminal 2
                            break
                    }
                    break
                case "RU": // RU and LT are identical?
                case "LT":
                    switch (systemTerminal) {
                        case "COM1":
                            matchedTadoLabel = "COM"
                            break
                        case "NO1":
                            matchedTadoLabel = "NO"
                            break
                        case "NC1":
                            matchedTadoLabel = "NC"
                            break
                        case "L":
                            //TODO: check for COM
                            if (terminalsAndLabels.hasOwnProperty("COM")) {
                                matchedTadoLabel = "P2"
                            } else if (terminalsAndLabels.hasOwnProperty("COM1")) {
                                matchedTadoLabel = "P2"
                            } else {
                                matchedTadoLabel = "COM"
                            }
                            break
                        case "N":
                            matchedTadoLabel = "P1"
                            break
                    }
                    break
                case "TC": //should be like RU and LT, but the NC is not present
                    switch (systemTerminal) {
                        case "COM1":
                            matchedTadoLabel = "COM"
                            break
                        case "NO1":
                            matchedTadoLabel = "NO"
                            break
                        case "NC1":
                        case "NC":
                            matchedTadoLabel = "P3"
                            break
                        case "L":
                            //TODO: check for COM
                            if (terminalsAndLabels.hasOwnProperty("COM")) {
                                matchedTadoLabel = "P2"
                            } else if (terminalsAndLabels.hasOwnProperty("COM1")) {
                                matchedTadoLabel = "P2"
                            } else {
                                matchedTadoLabel = "COM"
                            }
                            break
                        case "N":
                            matchedTadoLabel = "P1"
                            break
                    }
                    break
            }
        }
        if (matchedTadoLabel) {
            deviceStickerWithLabels[matchedTadoLabel] = {
                writing: Array.isArray(terminalsAndLabels[systemTerminal])
                    ? 0 < terminalsAndLabels[systemTerminal].length
                        ? JSON.stringify(terminalsAndLabels[systemTerminal])
                        : getFriendlyWriting(device, matchedTadoLabel)
                    : terminalsAndLabels[systemTerminal]
                , optional: (!mandatory) && isTerminalOptional(device, systemTerminal)
                , matchedWith: systemTerminal
            }
        }
        //console.log("Result", device, systemTerminal, "=>", matchedTadoLabel)
    }
    if (0 < Object.keys(deviceStickerWithLabels).length) { return deviceStickerWithLabels }
    return null
}

console.log(
    ` __| |____________________________________________| |__
(__   ____________________________________________   __)
   | |                                            | |
   | |                                            | |
   | |                                            | |
   | |            Index script svg                | |
   | |                                            | |
   | |                                            | |
  _| |ds__________________________________________| |__
(__   ____________________________________________   __)
   | |                                            | |`
)
console.log(">>>>> Window url and input parameters:", JSON.stringify({
    origin: window.location.origin
    , protocol: window.location.protocol
    , hostname: window.location.hostname
    , pathname: window.location.pathname
    , payload: decodeURI(window.location.search.substring(1))
}, null, " "))

//
// Global variables, sorry
//
const pictureNames = ["labeling", "connect"]
const isDimensionsSet = true
const pictureScales = {
    labeling: {
        width: 1
        , height: 1.5
    }
    , connect: {
        width: 1
        , height: 1
    }
}
const pictureDimensions = {
    labeling: {
        width: 846
        , height: 398
    }
    , connect: {
        width: 340
        , height: 420
    }
}
//initialise menus 
const menus = devices.reduce((accDevice, curDevice) => {
    accDevice[curDevice] = deviceTerminals[curDevice].reduce((accTerminal, curTerminal) => {
        accTerminal[curTerminal] = {
            label: null
            , present: false
            , dashed: isTerminalOptional(curDevice, curTerminal)
        }
        return accTerminal
    }, {})
    return accDevice
}, {})
console.log("Menus for all tado° devices:", menus)
const root = document.getElementById("root")
const urlParams = decodeURI(window.location.search.substring(1)) ? payload2obj(decodeURI(window.location.search.substring(1))) : null
var useDefault = true

if (urlParams && (0 < Object.keys(urlParams).length)) {
    console.log("URL params:", urlParams)
    let notEmptyTerminalsAndLabels = Object.keys(urlParams.interface.terminalsAndLabels)
        .filter(key => { return urlParams.interface.terminalsAndLabels[key].length })
        .reduce((accObj, curKey) => {
            accObj[curKey] = urlParams.interface.terminalsAndLabels[curKey]
            return accObj
        }, {})
    for (let device of devices) {
        let matchedTadoTerminals = matchDeviceWithSystemTerminalsAndLabels(device, notEmptyTerminalsAndLabels)
        //copy matched Stickers to the empty global sticker
        for (let matchedTadoTerminal in matchedTadoTerminals) {
            menus[device][matchedTadoTerminal].label = matchedTadoTerminals[matchedTadoTerminal].writing
            menus[device][matchedTadoTerminal].present = true
            menus[device][matchedTadoTerminal].dashed = matchedTadoTerminals[matchedTadoTerminal].optional
            menus[device][matchedTadoTerminal].matchedTo = matchedTadoTerminals[matchedTadoTerminal].matchedWith
        }
        console.log(device, "matched terminals", matchedTadoTerminals)
    }
    useDefault = false
} else {
    console.log("Empty or invalid URL params => Make stickers from scratch")
    let header = document.createElement("h1")
    header.textContent = "Make stickers from scratch"
    root.appendChild(header)
}

//
// appends menus and svgs
//
for (let device of Object.keys(menus)) {
    console.log(device, "drawing menu")

    let deviceContainer = document.createElement("div")
    deviceContainer.className = "device-container"
    deviceContainer.id = [deviceContainer.className, device].join("-")
    root.appendChild(deviceContainer)

    let deviceHeading = document.createElement("h2")
    deviceHeading.className = "device-heading"
    deviceHeading.textContent = device
    deviceContainer.appendChild(deviceHeading)

    let menuContainer = document.createElement("div")
    menuContainer.className = "menu-container"
    menuContainer.id = [menuContainer.className, device].join("-")
    deviceContainer.appendChild(menuContainer)
    //Render physical menu elements and fill with actual info from 'menus' map
    if (0 < Object.keys(menus[device]).length) {
        for (let deviceTerminal in menus[device]) {
            let menuItemId = ["menuItem", device, deviceTerminal].join("-")
            let menuItem = menus[device][deviceTerminal]
            let cell = document.createElement("div")
            cell.id = menuItemId
            menuContainer.appendChild(cell)

            let writingLabel = document.createElement("label")
            writingLabel.className = "tadoLabel tado-terminal-label"
            writingLabel.textContent = getFriendlyName(device, deviceTerminal)
            cell.appendChild(writingLabel)
            let inputWriting = document.createElement("input")
            inputWriting.type = "text"
            inputWriting.value = menuItem.label
            inputWriting.id = [menuItemId, "writing"].join("-")
            inputWriting.className = "input-writing"
            inputWriting.oninput = onWritingInput
            cell.appendChild(inputWriting)
            writingLabel.for = inputWriting.id
            menus[device][deviceTerminal].inputWriting = inputWriting

            let dashedGroup = document.createElement("div")

            let checkboxDashed = document.createElement("input");
            checkboxDashed.type = "checkbox";
            checkboxDashed.checked = menuItem.dashed
            checkboxDashed.id = [menuItemId, "dashed"].join("-")
            checkboxDashed.oninput = onDashedInput

            let dashedLabel = document.createElement("label")
            dashedLabel.textContent = "dash:"
            dashedLabel.for = checkboxDashed.id

            dashedGroup.appendChild(dashedLabel)
            dashedGroup.appendChild(checkboxDashed)
            cell.appendChild(dashedGroup)
            menus[device][deviceTerminal].inputDashed = checkboxDashed

            let hideStickerGroup = document.createElement("div")

            let checkboxHide = document.createElement("input");
            checkboxHide.type = "checkbox";
            checkboxHide.id = [menuItemId, "hideSticker"].join("-")
            checkboxHide.checked = menuItem.hideSticker
            checkboxHide.oninput = onHideStickerInput

            let hideStickerLabel = document.createElement("label")
            hideStickerLabel.textContent = "hide:"
            hideStickerLabel.for = checkboxHide.id

            hideStickerGroup.appendChild(hideStickerLabel)
            hideStickerGroup.appendChild(checkboxHide)
            cell.appendChild(hideStickerGroup)
            menus[device][deviceTerminal].inputHide = checkboxHide
        }
    } else { console.log(device, "has no menu???") }

    let picturesContainer = document.createElement("div") // deviceRoot > h2, 
    picturesContainer.className = "pictures-container"
    picturesContainer.id = [picturesContainer.className, device].join("-")
    deviceContainer.appendChild(picturesContainer)

    for (let pictureName of pictureNames) {
        let svgFileUrl = `svg/${pictureName}-${device.toUpperCase()}.svg`
        let svgContainer = document.createElement("div") //svg-container contains download link and svg picture
        svgContainer.className = "svg-container"
        svgContainer.id = [svgContainer.className, pictureName, device].join("-")
        picturesContainer.appendChild(svgContainer)
        //SVG download link
        let downloadLink = document.createElement("a")
        downloadLink.className = "download-link"
        downloadLink.id = ["downloadLink", device].join("-")
        downloadLink.textContent = `download ${pictureName}-${device}.svg`
        downloadLink.download = svgFileUrl.split("/")[svgFileUrl.split("/").length - 1]
        downloadLink.style.display = "none"
        svgContainer.appendChild(downloadLink)
        //SVG itself
        let svgObject = document.createElement("object")
        svgObject.className = "svg"
        svgObject.id = [svgObject.className, pictureName, device].join("-")
        //type="image/svg+xml" width="680" height="840"
        svgObject.type = "image/svg+xml"
        if (isDimensionsSet) {
            svgObject.width = pictureScales[pictureName].width * pictureDimensions[pictureName].width
            svgObject.height = pictureScales[pictureName].height * pictureDimensions[pictureName].height
        }
        svgObject.data = svgFileUrl
        //console.log("Inserting SVG from:", svg.data)
        svgContainer.appendChild(svgObject)

        ///////////////////////////////////////////////////////////svg.onload()//////////////////////////////////////////////////////////////
        svgObject.onload = function () {
            console.log("onload", device, pictureName)

            if ("labeling" === pictureName) {
                //svg elements to the menu
                let labelingTerminalSticker = this.contentDocument.querySelectorAll("g[transform*=translate] g[title*='terminal sticker']")
                let tsi = 0 //tado sticker index
                let maxTsi = Math.min([labelingTerminalSticker.length, deviceTerminals[device].length])
                //menus[device] = {}
                //read SVG elements of the corresponding SYSTEM label (circle, text, arrow)
                for (let tsi = 0; tsi < maxTsi; tsi++) {
                    let x = labelingTerminalSticker[tsi].parentNode.getAttribute("transform").match(/translate\(\s*(\d+)\s*\,\s*(\d+)\s*\)/)[1]
                    //circle, label, arrow
                    let circle = labelingTerminalSticker[tsi].parentNode.querySelector("circle")
                    let writingElem = labelingTerminalSticker[tsi].parentNode.querySelector("text")
                    let arrowLine = labelingTerminalSticker[tsi].parentNode.querySelector("g[title='system terminal label arrow'] line")
                    let arrowTip = labelingTerminalSticker[tsi].parentNode.querySelector("g[title='system terminal label arrow'] polygon")
                    let labelGroup = labelingTerminalSticker[tsi].parentNode.querySelector("g[title*='system terminal label'")
                    let arrowGroup = labelingTerminalSticker[tsi].parentNode.querySelector("g[title='system terminal label arrow']")

                    menus[device][deviceTerminal] = menuElem
                    menus[device][deviceTerminal].writingElem = writingElem
                    menus[device][deviceTerminal].circle = circle
                    menus[device][deviceTerminal].arrowGroup = arrowGroup
                    menus[device][deviceTerminal].arrowLine = arrowLine
                    menus[device][deviceTerminal].arrowTip = arrowTip
                    menus[device][deviceTerminal].labelingGroup = labelingTerminalSticker[tsi].parentNode
                }
                // end reading elements from labeling.svg

            } else if ("connect" === pictureName) {
                //get wires from svg
                let innerSvg = this.contentDocument.styleSheets
                console.log("parsing", device, pictureName)
                let ruleMap = Array.from(this.contentDocument.styleSheets[0].cssRules)
                    .filter(rule => { return rule.selectorText.match(/\.Label(.+)/) })
                    .reduce((acc, cur) => {
                        let connectLabel = cur.selectorText.match(/^\.(Label.+)$/)[1]
                        let tadoSticker = getTadoStickerByConnectLabel(device, connectLabel)
                        if (tadoSticker) {
                            let terminalGroup = this.contentDocument.querySelector(`g[class*=${connectLabel}]`)
                            let wirePath = terminalGroup.querySelector("g > path")
                            let stickerRect = terminalGroup.querySelector("g > rect")
                            acc[tadoSticker] = { group: terminalGroup, wire: wirePath, sticker: stickerRect }
                        }
                        return acc
                    }, {})
                console.log(device, "wire visibility rules:", ruleMap)
                if ("BP" === device) {
                    let bridgeRules = Array.from(this.contentDocument.styleSheets[0].cssRules)
                        .filter(rule => { return rule.selectorText.match(/\.Label(.+)/) })
                    console.log(bridgeRules)
                }

                if (0 < this.contentDocument.styleSheets[0].cssRules.length) {
                    if (Object.keys(menus[device]).length === this.contentDocument.styleSheets[0].cssRules.length) {

                    } else {
                        console.log(`menu length (${Object.keys(menus[device]).length}) != svg labels (${this.contentDocument.styleSheets[0].cssRules.length})`, device, pictureName)
                    }
                }
                //apply menu values to the `connect-${device}.svg`
                if (matchedTerminals && matchedTerminals[device]) {
                    if (0 < Object.keys(menus[device]).length) {
                        for (let tadoSticker in menus[device]) {
                            let wirePresent = menus[device][tadoSticker].label ? true : false
                            let wireDashed = menus[device][tadoSticker].dashed

                            //updateWritingFromInput(writingInput)
                            //updateDashFromInputElement(dashInput)
                        }
                    } else { console.log(device, "has no menu") }
                } else {
                    console.log("I could not make any stickers for this device? -->", device)
                }
                //end of parsing the 'connect'.svg
            }
            //applying data from the menu to the .svg
            for (let deviceTerminal in menus[device]) {
                //apply data from the menu to the .svg
                updateFromWritingInput(menus[device][deviceTerminal].label, device, deviceTerminal)
                updateFromDashedInput(menus[device][deviceTerminal].checkboxDashed)
            }
            //end of applying data from the menu to the .svg

            //creating svg download link
            let svg = svgObject.contentDocument.getElementById("svg")
            //console.log("Inner svg", device, pictureName, svg)
            let serializer = new XMLSerializer()
            let source = serializer.serializeToString(svg)
            if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
                source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
            }
            if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
                source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
            }

            //add xml declaration
            source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

            //convert svg source to URI data scheme.
            var url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);

            downloadLink.href = url
            downloadLink.style.display = ""
            //end of creating svg download link
        }
    }
}

//append footer here
let footer = document.createElement("div")
footer.className = "footer"
footer.innerHTML = `Brought to you by <a href="mailto:daria.samkova@tado.com?subject=label_generator">@DariaTado</a> 2020`
root.appendChild(footer)