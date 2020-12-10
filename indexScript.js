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
        N: "N"
        , L: "L"
        , CHCOM: "CH_COM"
        , CHNC: "CH_NC"
        , CHNO: "CH_NO"
        , HWCOM: "HW_COM"
        , HWNC: "HW_NC"
        , HWNO: "HW_NO"
        , Ground: "EARTH"
        , "Bridge_COM-COM": "Bridge_COM-COM".replace(/\-/g,"_")
        , "Bridge_L-COM": "Bridge_L-COM".replace(/\-/g,"_")
        , "Bridge_L_-_HWCOM": "Bridge_L_-_HWCOM".replace(/\-/g,"_")
    }

}
function convertPrintedLabel2Terminal(device, label) {
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

function isWireOptional(device, terminal) {
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

function applyDashed(isChecked, device, deviceTerminal) {
    if (isChecked) {
        menus[device][deviceTerminal].circle.setAttribute("stroke-dasharray", 5)
        menus[device][deviceTerminal].arrowLine.setAttribute("stroke-dasharray", 5)
        //TODO: implement the connect-svg 
    } else {
        menus[device][deviceTerminal].circle.removeAttribute("stroke-dasharray")
        menus[device][deviceTerminal].arrowLine.removeAttribute("stroke-dasharray")
        //TODO: implement the connect-svg 
    }
}

function applyNewWriting(newWriting, device, deviceTerminal) {
    if (menus[device][deviceTerminal].writtenText) {
        menus[device][deviceTerminal].writtenText.textContent = newWriting

        if (newWriting && (3 < newWriting.toString().length)) {
            let oldTransform = menus[device][deviceTerminal].writtenText.getAttribute("transform")
            if (oldTransform) {
                let rotatePos = oldTransform.indexOf("rotate")
                if (-1 !== rotatePos) {
                    oldTransform = oldTransform.substr(0, rotatePos - 1)
                }
            }
            let newTransform = [oldTransform, "rotate(-30)"].join(" ")
            menus[device][deviceTerminal].writtenText.setAttribute("transform", newTransform)
            menus[device][deviceTerminal].circle.style.visibility = "hidden"
        } else {
            let oldTransform = menus[device][deviceTerminal].writtenText.getAttribute("transform")
            if (oldTransform) {
                let rotatePos = oldTransform.indexOf("rotate")
                if (-1 !== rotatePos) {
                    oldTransform = oldTransform.substr(0, rotatePos - 1)
                }
            }
            let newTransform = oldTransform
            menus[device][deviceTerminal].writtenText.setAttribute("transform", newTransform)
            menus[device][deviceTerminal].circle.style.visibility = "visible"
        }
        
        if (newWriting && ("" !== newWriting)) {
            if (isVerboseWriting) { console.log(device, deviceTerminal, "writing not empty") }
            menus[device][deviceTerminal].arrowGroup.style.visibility = "visible"
            menus[device][deviceTerminal].systemTerminalLabelGroup.style.visibility = "visible"
            //TODO: unhide wires in the connect.svg
        } else {
            if (isVerboseWriting) { console.log(device, deviceTerminal, "empty writing") }
            menus[device][deviceTerminal].arrowGroup.style.visibility = "hidden"
            menus[device][deviceTerminal].systemTerminalLabelGroup.style.visibility = "hidden"
            menus[device][deviceTerminal].circle.style.visibility = "hidden"
            //TODO: hide wires in the connect.svg
        }

        
    } else { 
        console.log(device, deviceTerminal, "ERROR writtenTextent in the menus is:", menus[device][deviceTerminal].writtenText) 
    }
}

function onHideSticker(e) {
    let element = e.target
    if (element){
        let device = element.id.split("-")[1]
        let deviceTerminal = element.id.split("-")[2]
        applyHide(element.checked, device, deviceTerminal)
    }
}
function onWritingChanged(e) { 
    let element = e.target
    if (element) {
        let device = element.id.split("-")[1]
        let deviceTerminal = element.id.split("-")[2]
        applyNewWriting(element.value.toString(), device, deviceTerminal)
    } 
}
function onDashed(e) { 
    let element = e.target
    if (element) {
        let device = element.id.split("-")[1]
        let deviceTerminal = element.id.split("-")[2]
        applyDashed(element.checked, device, deviceTerminal) 
    } 
}

// ------------------------------------------------------------------------------------------------------
//       Matching function
// ------------------------------------------------------------------------------------------------------
function matchDeviceAndSystem(device, systemTerminalsAndLabels) {
    // returns { matched, optional, writing } , where "matched" is the matched-with system's terminal name
    //console.log("Matching", device, tadoStickers[device], "with", terminalsAndLabels)
    let deviceStickerWithLabels = {}
    for (let systemTerminal in systemTerminalsAndLabels) {
        let matchedDeviceTerminal = null
        let mandatory = false
        //console.log("device:", device, ", system terminal:", systemTerminal)
        if (-1 !== deviceTerminals[device].indexOf(systemTerminal)) {
            //exact match
            matchedDeviceTerminal = systemTerminal

        } else {
            //console.log("No exact match:", device, systemTerminal, tadoStickers[device])
            switch (device) {
                case "BP":
                    switch (systemTerminal) {
                        case "COM":
                        case "COM1":
                            matchedDeviceTerminal = "CH_COM"
                            break
                        case "NO":
                        case "NO1":
                            matchedDeviceTerminal = "CH_NO"
                            break
                        case "NC":
                        case "NC1":
                            matchedDeviceTerminal = "CH_NC"
                            break
                        case "COM2":
                            matchedDeviceTerminal = "HW_COM"
                            break
                        case "NO2":
                            matchedDeviceTerminal = "HW_NO"
                            break
                        case "NC2":
                            matchedDeviceTerminal = "HW_NC"
                            break
                    }
                    break
                case "BR":
                    switch (systemTerminal) {
                        case "COM1":
                            matchedDeviceTerminal = "COM"
                            break
                        case "NO1":
                            matchedDeviceTerminal = "NO"
                            break
                        case "NC1":
                            matchedDeviceTerminal = "NC"
                            break
                    }
                    break
                case "BU":
                    switch (systemTerminal) {
                        case "COM":
                            matchedDeviceTerminal = "NC2" //terminal 1
                            mandatory = true
                            break
                        case "NO":
                            matchedDeviceTerminal = "NO1" //terminal 4
                            break
                        case "NC":
                            matchedDeviceTerminal = "NC1"  //terminal 2
                            break
                    }
                    break
                case "RU": // RU and LT are identical?
                case "LT":
                    switch (systemTerminal) {
                        case "COM1":
                            matchedDeviceTerminal = "COM"
                            break
                        case "NO1":
                            matchedDeviceTerminal = "NO"
                            break
                        case "NC1":
                            matchedDeviceTerminal = "NC"
                            break
                        case "L":
                            //TODO: check for COM
                            if (systemTerminalsAndLabels.hasOwnProperty("COM")) {
                                matchedDeviceTerminal = "P2"
                            } else if (systemTerminalsAndLabels.hasOwnProperty("COM1")) {
                                matchedDeviceTerminal = "P2"
                            } else {
                                matchedDeviceTerminal = "COM"
                            }
                            break
                        case "N":
                            matchedDeviceTerminal = "P1"
                            break
                    }
                    break
                case "TC": //should be like RU and LT, but the NC is not present
                    switch (systemTerminal) {
                        case "COM1":
                            matchedDeviceTerminal = "COM"
                            break
                        case "NO1":
                            matchedDeviceTerminal = "NO"
                            break
                        case "NC1":
                        case "NC":
                            matchedDeviceTerminal = "P3"
                            break
                        case "L":
                            //TODO: check for COM
                            if (systemTerminalsAndLabels.hasOwnProperty("COM")) {
                                matchedDeviceTerminal = "P2"
                            } else if (systemTerminalsAndLabels.hasOwnProperty("COM1")) {
                                matchedDeviceTerminal = "P2"
                            } else {
                                matchedDeviceTerminal = "COM"
                            }
                            break
                        case "N":
                            matchedDeviceTerminal = "P1"
                            break
                    }
                    break
            }
        }
        if (matchedDeviceTerminal) {
            deviceStickerWithLabels[matchedDeviceTerminal] = {
                writing: Array.isArray(systemTerminalsAndLabels[systemTerminal])
                    ? 0 < systemTerminalsAndLabels[systemTerminal].length
                        ? JSON.stringify(systemTerminalsAndLabels[systemTerminal])
                        : getFriendlyWriting(device, matchedDeviceTerminal)
                    : systemTerminalsAndLabels[systemTerminal]
                , dashed: mandatory ? false : isWireOptional(device, systemTerminal)
                , matchedTo: systemTerminal
            }
        }
        console.log(device, "matched:", systemTerminal, "=>", matchedDeviceTerminal, deviceStickerWithLabels[matchedDeviceTerminal])
    }
    if (0 < Object.keys(deviceStickerWithLabels).length) { return deviceStickerWithLabels }
    return null
}


function applyHide(checked, device, deviceTerminal){
    menus[device][deviceTerminal].hide = checked
    applyMenu(device, deviceTerminal)
}
       

function applyMenu(device, terminalName) {
    console.log(device, terminalName, "Apply Menu Settings", menus[device][terminalName])
    //TODO: labeling.svg
    applyNewWriting(menus[device][terminalName].label, device, terminalName)
    //connect.svg
    if(terminalName.match(/^Bridge/)){
        if (menus[device][terminalName].connectRule){
            menus[device][terminalName].connectRule.style.visibility = menus[device][terminalName].label && (0<menus[device][terminalName].label.length)
            ? "visible" : "hidden"
            if (menus[device][terminalName].present && menus[device][terminalName].dashed) {
                menus[device][terminalName].connectWirePath.style.strokeDasharray = "5"
            } else {
                menus[device][terminalName].connectWirePath.style.strokeDasharray = ""
            } 
        }
    } else {
        if (menus[device][terminalName].connectRule){
            menus[device][terminalName].connectRule.style.visibility = menus[device][terminalName].label && (0<menus[device][terminalName].label.length)
                ? "visible" : "hidden"
            if (menus[device][terminalName].dashed) {
                menus[device][terminalName].connectWirePath.style.strokeDasharray = "5"
                menus[device][terminalName].connectStickerRect.style.strokeDasharray = "3"
            } else {
                menus[device][terminalName].connectWirePath.style.strokeDasharray = ""
                menus[device][terminalName].connectStickerRect.style.strokeDasharray = ""
            }
        }
    }
    if (menus[device][terminalName].hide){
        if (menus[device][terminalName].printedStickerGroup){
            menus[device][terminalName].printedStickerGroup.style.display = "none"
            //menus[device][deviceTerminal].printedStickerGroup.style.visibility = "hidden"
        }
        if (menus[device][terminalName].connectRule){
            menus[device][terminalName].connectRule.style.visibility = "hidden"
        }
    } else {
        if (menus[device][terminalName].printedStickerGroup){
            menus[device][terminalName].printedStickerGroup.style.display = ""
            //menus[device][deviceTerminal].printedStickerGroup.style.visibility = "visible"
        }    
        if (menus[device][terminalName].connectRule){
            menus[device][terminalName].connectRule.style.visibility = menus[device][terminalName].label && (0<menus[device][terminalName].label.length)
            ? "visible" : "hidden"
        } 
    }
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
console.log(">>>>>>>> window.location <<<<<<<<<", JSON.stringify({
    origin: window.location.origin
    , protocol: window.location.protocol
    , hostname: window.location.hostname
    , pathname: window.location.pathname
    , payload: decodeURI(window.location.search.substring(1))
}, null, " "))

//
// Global variables
//
const pictureNames = ["labeling", "connect"]
const doUpdateOriginalDimensions = true
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
//first, generate an empty menu structure (one menu per device)
const menus = devices.reduce((accDevice, curDevice) => {
    accDevice[curDevice] = deviceTerminals[curDevice].reduce((accTerminal, curTerminal) => {
        accTerminal[curTerminal] = {
            label: null
            , present: false
            , dashed: isWireOptional(curDevice, curTerminal)
        }
        return accTerminal
    }, {})
    return accDevice
}, {})
console.log("MENUS:", menus)
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
        let matchedTadoTerminals = matchDeviceAndSystem(device, notEmptyTerminalsAndLabels)
        //copy matched Stickers to the empty global sticker
        for (let matchedTadoTerminal in matchedTadoTerminals) {
            menus[device][matchedTadoTerminal].label = matchedTadoTerminals[matchedTadoTerminal].writing
            menus[device][matchedTadoTerminal].present = true
            menus[device][matchedTadoTerminal].dashed = matchedTadoTerminals[matchedTadoTerminal].dashed
            menus[device][matchedTadoTerminal].matchedTo = matchedTadoTerminals[matchedTadoTerminal].matchedTo
        }
        console.log(device, "matched terminals", matchedTadoTerminals)
        if ("BP" === device){
            if (menus.BP.L.label && !menus.BP["CH_COM"].label && !menus.BP["HW_COM"].label){
                menus.BP["Bridge_COM_COM"]= {present: true}
                menus.BP["Bridge_L_COM"] = {present: true}
                menus.BP["Bridge_L_HWCOM"] = {present : false}
            } else if (menus.BP.L.label && !menus.BP["CH_COM"].label && (menus.BP["CH_NO"].label || menus.BP["CH_NC"].label)){
                menus.BP["Bridge_COM_COM"] = {present : false}
                menus.BP["Bridge_L_COM"]={present: true}
                menus.BP["Bridge_L_HWCOM"] = {present:false}
            } else if (menus.BP.L.label && !menus.BP["HW_COM"].label && (menus.BP["HW_NO"].label || menus.BP["HW_NC"].label) ){
                menus.BP["Bridge_COM_COM"] = {present : false}
                menus.BP["Bridge_L_COM"] = {present :false}
                menus.BP["Bridge_L_HWCOM"]={present: true}
            } else {
                menus.BP["Bridge_COM_COM"] = {present : false}
                menus.BP["Bridge_L_COM"] = {present : false}
                menus.BP["Bridge_L_HWCOM"] = {present : false}
            }
            menus.BP.EARTH = {
                present: true
                , dashed: true
                , label: `\u23DA`
            }
        }
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
            if (!deviceTerminal.match(/^Bridge/i)) {
                let inputWriting = document.createElement("input")
                inputWriting.type = "text"
                inputWriting.value = menuItem.label
                inputWriting.id = [menuItemId, "writing"].join("-")
                inputWriting.className = "input-writing"
                inputWriting.oninput = onWritingChanged
                cell.appendChild(inputWriting)
                writingLabel.for = inputWriting.id
                menus[device][deviceTerminal].inputWriting = inputWriting
            }

            let dashedGroup = document.createElement("div")

            let checkboxDashed = document.createElement("input");
            checkboxDashed.type = "checkbox";
            checkboxDashed.checked = menuItem.dashed
            checkboxDashed.id = [menuItemId, "dashed"].join("-")
            checkboxDashed.oninput = onDashed

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
            checkboxHide.oninput = onHideSticker

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
        downloadLink.textContent = `${pictureName}-${device}.svg`
        downloadLink.alt
        //downloadLink.download = svgFileUrl.split("/")[svgFileUrl.split("/").length - 1]
        downloadLink.style.display = "none"
        svgContainer.appendChild(downloadLink)
        //SVG itself
        let svgObject = document.createElement("object")
        svgObject.className = "svg"
        svgObject.id = [svgObject.className, pictureName, device].join("-")
        //type="image/svg+xml" width="680" height="840"
        svgObject.type = "image/svg+xml"
        if (doUpdateOriginalDimensions) {
            svgObject.width = pictureScales[pictureName].width * pictureDimensions[pictureName].width
            svgObject.height = pictureScales[pictureName].height * pictureDimensions[pictureName].height
        }
        svgObject.data = svgFileUrl
        //console.log("Inserting SVG from:", svg.data)
        svgContainer.appendChild(svgObject)

        ///////////////////////////////////////////////////////////svg.onload()//////////////////////////////////////////////////////////////
        svgObject.onload = function () {
            console.log(device, "onload()", pictureName)

            if ("labeling" === pictureName) {
                //svg elements to the menu
                console.log(device, "onload()2", pictureName)
                let labelingTerminalSticker = this.contentDocument.querySelectorAll("g[transform*=translate] g[title*='terminal sticker']")
                let maxTsi = Math.min(labelingTerminalSticker.length, Object.keys(deviceTerminals[device]).length)
                
                console.log(device,"terminalStickerNodes", labelingTerminalSticker, labelingTerminalSticker.length, "maxTsi", maxTsi, Object.keys(deviceTerminals[device]).length)
                
                //read SVG elements of the corresponding SYSTEM label (circle, text, arrow)
                for (let tsi = 0; tsi < maxTsi; tsi++) {
                    let terminalName = deviceTerminals[device][Object.keys(deviceTerminals[device])[tsi]]
                    console.log(device, "sticker", terminalName, "menu", menus[device][terminalName])
                    let x = labelingTerminalSticker[tsi].parentNode.getAttribute("transform").match(/translate\(\s*(\d+)\s*\,\s*(\d+)\s*\)/)[1]
                    //circle, label, arrow
                    menus[device][terminalName].circle = labelingTerminalSticker[tsi].parentNode.querySelector("circle")
                    menus[device][terminalName].writtenText = labelingTerminalSticker[tsi].parentNode.querySelector("text")
                    menus[device][terminalName].arrowLine = labelingTerminalSticker[tsi].parentNode.querySelector("g[title='system terminal label arrow'] line")
                    menus[device][terminalName].arrowTip = labelingTerminalSticker[tsi].parentNode.querySelector("g[title='system terminal label arrow'] polygon")
                    menus[device][terminalName].systemTerminalLabelGroup = labelingTerminalSticker[tsi].parentNode.querySelector("g[title='system terminal label'")
                    menus[device][terminalName].arrowGroup = labelingTerminalSticker[tsi].parentNode.querySelector("g[title='system terminal label arrow']")
                    menus[device][terminalName].printedStickerGroup = labelingTerminalSticker[tsi].parentNode
                    applyMenu(device,terminalName)
                }
                // end reading elements from labeling.svg
            } else if ("connect" === pictureName) {
                //get wires from svg
                let innerSvg = this.contentDocument.styleSheets
                console.log("parsing", device, pictureName)
                
                if ("BP" === device) {
                    console.log("Yes, I am a ", device)
                    let connectRules = Array.from(this.contentDocument.styleSheets[0].cssRules)
                        .filter(rule => { return rule.selectorText.match(/\.Label(.+)/) })
                    console.log("CSS rules wires:", connectRules)
                    connectRules.forEach(rule => {
                        //let className = rule.selectorText.match(/\.(Label.+)/)[1]
                        let printedLabelName = rule.selectorText.match(/\.Label(.+)/)[1]
                        let terminalName = convertPrintedLabel2Terminal(device,printedLabelName )
                        console.log(device, "printedLabel", printedLabelName, "terminalName", terminalName, "menu dashed", menus[device][terminalName].dashed)
                        if (terminalName){
                            menus[device][terminalName].connectRule = rule
                            let wireGroup = this.contentDocument.querySelector(`g${rule.selectorText}`)
                            menus[device][terminalName].connectGroup = wireGroup
                            menus[device][terminalName].connectWirePath = wireGroup.querySelector("g > path")
                            menus[device][terminalName].connectStickerRect = wireGroup.querySelector("g > rect")

                            applyMenu(device, terminalName)
                        }
                    })
                    let bridgeRules = Array.from(this.contentDocument.styleSheets[0].cssRules)
                        .filter(rule => { return rule.selectorText.match(/\.BridgePosition(.+)/) })
                    bridgeRules.forEach( rule => {
                        let bridgeGroup = this.contentDocument.querySelector(`g${rule.selectorText}`)
                        let bridgeName = bridgeGroup.id.replace(/\-/g, "_")
                        menus.BP[bridgeName].connectRule = rule
                        menus.BP[bridgeName].connectGroup = bridgeGroup
                        menus.BP[bridgeName].connectWirePath = bridgeGroup.querySelector("path")

                        applyMenu(device, terminalName)
                    })
                }

                
                //end of parsing the 'connect'.svg
            }

            
            

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
            downloadLink.download = downloadLink.textContent
            //end of creating svg download link
        }
    }
}

//append footer here
let footer = document.createElement("div")
footer.className = "footer"
footer.innerHTML = `Brought to you by <a href="mailto:daria.samkova@tado.com?subject=label_generator">@DariaTado</a> 2020`
root.appendChild(footer)