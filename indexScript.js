//
// Global variables - dictionary of devices
//
const glbDeviceDict = {
    BP: {
        terminals: ["N", "L", "CH_COM", "CH_NC", "CH_NO", "HW_COM", "HW_NC", "HW_NO", "EARTH", "P1", "P2"
            , "Bridge_L_COM", "Bridge_COM_COM", "Bridge_L_HWCOM"]
        , defaultLabels: { "N": "N", "L": "L", "CH_NC": "2", "CH_NO": "4", "HW_NC": "1", "HW_NO": "3", "EARTH": "\u23DA" }
        , friendlyNames: ["N", "L", "CH COM", "CH NC", "CH NO", "HW COM", "HW NC", "HW NO", "EARTH", "P1", "P2"
            , "L+CH", "CH+HW", "L+HW"]
        , friendlyWritings: ["N", "L", "COM", "NC", "NO", "HW COM", "HW Off", "HW On", "EARTH", "P1", "P2"]
        , cssRules: {
            N: "N"
            , L: "L"
            , CHCOM: "CH_COM"
            , CHNC: "CH_NC"
            , CHNO: "CH_NO"
            , HWCOM: "HW_COM"
            , HWNC: "HW_NC"
            , HWNO: "HW_NO"
            , Ground: "EARTH"
            , BridgePositionCHCOMHWCOM: "Bridge_COM_COM"
            , BridgePositionLCHCOM: "Bridge_L_COM"
            , BridgePositionLHWCOM: "Bridge_L_HWCOM"
        }
    }
    , BR: {
        interfaceTypes: {
            mains: ["N", "L"]
            , potfree: ["COM", "NO", "NC", "P1", "P2"]
            , digital: ["VCC_C", "GND_B", "AnalogOut_A"]
        }
        , interfacePictureMedia: "file"
        , terminals: ["N", "L", "COM", "NC", "NO", "P1", "P2", "P3", "AnalogOut_A", "GND_B", "VCC_C"]
        , defaultLabels: { "COM": "COM", "NO": "NO" }
        , friendlyNames: ["N", "L", "COM", "NC", "NO", "P1", "P2", "P3", "A", "minus", "plus"]
        , friendlyWritings: ["N", "L", "COM", "NC", "NO", "P1", "P2", "P3", "A", "-", "+"]
        , cssRules: {
            N: "N"
            , L_1: null
            , L_2: "L"
            , COM: "COM"
            , NO: "NO"
            , NC: "NC"
            , P1: "P1"
            , P2: "P2"
            , P3: "P3"
            , A: "AnalogOut_A"
            , Negative: "GND_B"
            , Positive: "VCC_C"
        }
    }
    , BU: {
        interfaceTypes: {
            AnalogConnector: ["N", "L", "NC1", "NC2", "NO1", "NO2"]
            , DigitalConnector: ["VCC_C", "GND_B", "AnalogOut_A"]
        }
        , interfacePictureMedia: "group"
        , terminals: ["N", "L", "NC2", "NC1", "NO2", "NO1", "AnalogOut_A", "GND_B", "VCC_C"]
        , defaultLabels: { "N": "N", "L": "L", "NC2": "1", "NC1": "2", "NO2": "3", "NO1": "4" }
        , friendlyNames: ["N", "L", "1", "4", "3", "4", "A", "minus", "plus"]
        , friendlyWritings: ["N", "L", "1", "4", "3", "4", "A", "\u2212", "+"]
        , cssRules: {
            N: "N"
            , L: "L"
            , 1: "NC2"
            , 2: "NC1"
            , 3: "NO2"
            , 4: "NO1"
            , A: "AnalogOut_A"
            , Minus: "GND_B"
            , Plus: "VCC_C"
        }
    }

    , RU: {
        interfaceTypes: {
            relay: ["COM", "NO", "NC", "P1", "P2"]
            , digital: ["VCC_C", "GND_B", "AnalogOut_A"]
        }
        , interfacePictureMedia: "file"
        , terminals: ["NO", "NC", "COM", "P1", "P2", "P3", "AnalogOut_A", "GND_B", "VCC_C"]
        , defaultLabels: { "NO": "NO", "NC": "NC", "COM": "L", "P1": "N" }
        , friendlyNames: ["NO", "NC", "COM", "P1", "P2", "P3", "A", "minus", "plus"]
        , friendlyWritings: ["NO", "NC", "COM", "P1", "P2", "P3", "A", "\u2212", "+"]
        , cssRules: {
            COM: "COM"
            , NO: "NO"
            , NC: "NC"
            , P1: "P1"
            , P2: "P2"
            , P3: "P3"
            , other: "AnalogOut_A"
            , minus: "GND_B"
            , plus: "VCC_C"
        }
    }
    , LT: {
        terminals: ["NO", "NC", "COM", "P1", "P2", "P3"]
        , defaultLabels: { "NO": "NO", "COM": "COM", "P1": "L", "P2": "N" }
        , friendlyNames: ["NO", "NC", "COM", "P1", "P2", "P3"]
        , friendlyWritings: ["NO", "NC", "COM", "P1", "P2", "P3"]
    }
    , TC: {
        terminals: ["COM", "NO", "P1", "P2", "P3"]
        , defaultLabels: { "COM": "COM", "NO": "NO", "P1": "L", "P2": "N" }
        , friendlyNames: ["COM", "NO", "P1", "P2", "P3"]
        , friendlyWritings: ["COM", "NO", "P1", "P2", "P3"]
    }
}

const glbPictureNames = ["labeling", "connect"]
const glbUpdateSvgDimensions = false
const glbPictureScales = {
    labeling: { width: 1, height: 1.5 }
    , connect: { width: 1, height: 1 }
}
const glbPictureDimensions = {
    labeling: { width: 846, height: 398 }
    , connect: { width: 340, height: 420 }
}

function convertSvg2DeviceTerminal(device, svgTerminal) {
    return glbDeviceDict[device] && glbDeviceDict[device].cssRules && glbDeviceDict[device].cssRules[svgTerminal]
        ? glbDeviceDict[device].cssRules[svgTerminal]
        : null
}

function convertDevice2SvgTerminal(device, terminal) {
    if (glbDeviceDict[device] && glbDeviceDict[device].cssRules) {
        let terminalIndex = Object.values(glbDeviceDict[device].cssRules).indexOf(terminal)
        return (-1 !== terminalIndex) ? Object.keys(glbDeviceDict[device].cssRules)[terminalIndex] : null
    }
}

function getFriendlyName(device, terminal) {
    let terminalIndex = glbDeviceDict[device].terminals.indexOf(terminal)
    //console.log(device,"friendly name for terminal:", terminal, terminalIndex)
    if (-1 !== terminalIndex) {
        if (glbDeviceDict[device].friendlyNames) {
            return glbDeviceDict[device].friendlyNames[terminalIndex]
        }
    }
}

function getFriendlyWriting(device, terminal) {
    if (device && terminal) {
        if (glbDeviceDict[device] && glbDeviceDict[device].terminals) {
            let terminalIndex = glbDeviceDict[device].terminals.indexOf(terminal)
            if (-1 !== terminalIndex) {
                if (glbDeviceDict[device].friendlyWritings) {
                    let friendlyWriting = glbDeviceDict[device].friendlyWritings[terminalIndex]
                    return friendlyWriting ? friendlyWriting : null
                }
            }
        }
    }
}

function isWireOptional(device, terminal) {
    if (terminal.match(/NC/)) { return true }
    if ("N" === terminal) {
        if (-1 !== ["RU", "TC", "LT"].indexOf(device)) { return true }
    }
    return false
}

function payload2obj(payload) {
    function addOrSetProperty(obj, nameStr, value) {
        //console.log("adding or setting property of", obj, nameStr, value)
        let names = nameStr.split(".")
        if (1 < names.length) {
            if (!obj.hasOwnProperty(names[0])) { obj[names[0]] = {} }
            addOrSetProperty(obj[names[0]], names.slice(1, names.length).join("."), value)
        } else if (value) {
            if (value.match(/\[.*\]/) || value.match(/\{.*\}/)) {
                obj[names[0]] = JSON.parse(value)
            } else {
                obj[names[0]] = value
            }
        }
    }

    if (payload) {
        let splitPayload = payload.split("&").filter(elem => { return elem })
        //console.log("Payload tokens:", splitPayload)
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

function applyDashed(device, terminal) {
    let isDashed = menus[device][terminal].dashed
    if (menus[device][terminal].circle) {
        menus[device][terminal].circle.setAttribute("stroke-dasharray", isDashed ? 5 : "")
    }
    if (menus[device][terminal].arrowLine) {
        menus[device][terminal].arrowLine.setAttribute("stroke-dasharray", isDashed ? 5 : "")
    }
    if (menus[device][terminal].connectWirePath) {
        menus[device][terminal].connectWirePath.style.strokeDasharray = isDashed ? [5] : ""
        if ("BU" === device) {
            menus[device][terminal].connectWirePath.style.stroke = isDashed ? "#363636" : null
            menus[device][terminal].connectWirePath.style.strokeWidth = isDashed ? 0.6 : null
            menus[device][terminal].connectWirePath.style.fill = isDashed ? "transparent" : "#363636"
        }
    }
    if (menus[device][terminal].miniConnectWirePath) {
        menus[device][terminal].miniConnectWirePath.style.stroke = isDashed ? "#363636" : ""
        menus[device][terminal].miniConnectWirePath.style.strokeWidth = isDashed ? 0.3 : ""
        menus[device][terminal].miniConnectWirePath.style.fill = isDashed ? "transparent" : "#363636"
        menus[device][terminal].miniConnectWirePath.style.strokeDasharray = isDashed ? [2, 1] : ""
    }
}

function applyWriting(device, terminal) {
    let newWriting = menus[device][terminal].label
    if (menus[device][terminal].writtenText) {
        if ((menus[device][terminal].writtenText.textContent || newWriting)
            && (newWriting !== menus[device][terminal].writtenText.textContent)) {
            menus[device][terminal].writtenText.textContent = newWriting //this updates the svg text' elements text
            console.log("New writing:", newWriting)
            if (newWriting && (3 < newWriting.toString().length)) {
                //tilt up the writing 45°
                let oldTransform = menus[device][terminal].writtenText.getAttribute("transform")
                if (oldTransform) {
                    let rotatePos = oldTransform.indexOf("rotate")
                    if (-1 !== rotatePos) {
                        oldTransform = oldTransform.substr(0, rotatePos - 1)
                    }
                }
                let newTransform = [oldTransform, "rotate(-30)"].join(" ")
                menus[device][terminal].writtenText.setAttribute("transform", newTransform) //this rotates the text element
                menus[device][terminal].circle.style.visibility = "hidden" //this hides the circle around the text element
            } else {
                let oldTransform = menus[device][terminal].writtenText.getAttribute("transform")
                if (oldTransform) {
                    let rotatePos = oldTransform.indexOf("rotate")
                    if (-1 !== rotatePos) {
                        oldTransform = oldTransform.substr(0, rotatePos - 1)
                    }
                }
                let newTransform = oldTransform
                menus[device][terminal].writtenText.setAttribute("transform", newTransform)
                menus[device][terminal].circle.style.visibility = menus[device][terminal].present
                    && (!menus[device][terminal].hide)
                    ? "visible" : "hidden"
            }
        }
    }
}

function onHideSticker(e) {
    let element = e.target
    if (element) {
        let device = element.id.split("-")[1]
        let terminal = element.id.split("-")[2]
        menus[device][terminal].hide = element.checked
        applyMenu(device, terminal, false)
    }
}

function onForceBridge(e) {
    let element = e.target
    if (element) {
        let device = element.id.split("-")[1]
        let terminal = element.id.split("-")[2]
        menus[device][terminal].forceBridge = element.checked
        applyMenu(device, terminal, false)
    }
}

function calculatePictureType(device) {
    if (glbDeviceDict[device] && glbDeviceDict[device].interfacePictureMedia) {
        let matchedPictureTypes = Object.keys(glbDeviceDict[device].interfaceTypes)
            .filter(interfaceType => {
                return glbDeviceDict[device].interfaceTypes[interfaceType].filter(terminal => {
                    return menus[device][terminal].present
                }).length
            })
        if (0 < matchedPictureTypes.length) {
            //console.log(device, "matched PictureTypes:", matchedPictureTypes, "needed picture type:", matchedPictureTypes[0])
            return matchedPictureTypes[0]
        }
    }
}

function getInfoFromFileName(filePath) {
    if (filePath) {
        if (filePath.match(/svg\/([\-\w]+)\.svg/i)) {
            let fileNameParts = filePath.match(/svg\/([\-\w]+)\.svg/i)[1].split("-")
            return {
                ...2 <= fileNameParts.length && { device: fileNameParts[1] }
                , ...1 <= fileNameParts.length && { pictureName: fileNameParts[0] }
                , ...3 <= fileNameParts.length && { pictureType: fileNameParts[2] }
            }
        }
    }
}

function applyPictureType(device) {
    let neededPictureType = calculatePictureType(device) //calculated from menus[device]
    if (neededPictureType) {
        let svgObject = document.getElementById(["svgObject", "connect", device].join("-"))
        if (svgObject && (glbDeviceDict[device].interfacePictureMedia)) {
            //console.log(device, "media type:", glbDeviceDict[device].interfacePictureMedia)
            switch (glbDeviceDict[device].interfacePictureMedia) {
                case "file":
                    let fileNameInfo = getInfoFromFileName(svgObject.data)
                    let curPictureType = fileNameInfo ? fileNameInfo.pictureType : null
                    //console.log(device, "current picture type:", fileNameInfo)
                    if (curPictureType && (curPictureType !== neededPictureType)) {

                        svgObject.data = `svg/connect-${device}-${neededPictureType}.svg` //
                        console.log(device, "set new svg source:", svgObject.data)
                    }
                    break
                case "group":
                    let rules = svgObject.contentDocument.styleSheets && (0 < svgObject.contentDocument.styleSheets.length)
                        ? Array.from(svgObject.contentDocument.styleSheets[0].cssRules)
                            .filter(rule => {
                                return Object.keys(glbDeviceDict[device].interfaceTypes).filter(type => {
                                    return rule.selectorText.match(type)
                                })
                                    .length
                            })
                        : null
                    //console.log(device, "GROUP picture type", neededPictureType, rules)
                    rules.forEach(rule => {
                        if (rule.selectorText.match(neededPictureType)) {
                            rule.style.visibility = "visible"
                            rule.style.display = ""
                        } else {
                            rule.style.visibility = "hidden"
                            rule.style.display = "none"
                        }
                    })
                    break
                default:
            }
        }
    }
}

function onWritingChanged(e) {
    let element = e.target
    if (element) {
        let device = element.id.split("-")[1]
        let deviceTerminal = element.id.split("-")[2]
        menus[device][deviceTerminal].label = element.value
        menus[device][deviceTerminal].present = menus[device][deviceTerminal].label ? true : false

        applyMenu(device, deviceTerminal, true)
    }
}
function onDashed(e) {
    let element = e.target
    if (element) {
        let device = element.id.split("-")[1]
        let terminal = element.id.split("-")[2]
        menus[device][terminal].dashed = element.checked
        applyDashed(device, terminal)
    }
}

// ------------------------------------------------------------------------------------------------------
//       Matching function
// ------------------------------------------------------------------------------------------------------
function matchDeviceAndSystem(device, systemTerminalsAndLabels) {
    // returns { writing, dashed, matchedTo } , where "matchedTo" is the system terminal name
    //console.log("Matching", device, tadoStickers[device], "with", terminalsAndLabels)
    let deviceStickerWithLabels = {}
    for (let systemTerminal in systemTerminalsAndLabels) {
        let matchedDeviceTerminal = null
        let mandatory = false
        //console.log("device:", device, ", system terminal:", systemTerminal)
        if (-1 !== glbDeviceDict[device].terminals.indexOf(systemTerminal)) {
            matchedDeviceTerminal = systemTerminal//exact match
        } else {
            //console.log("No exact match:", device, systemTerminal, tadoStickers[device])
            switch (device) {
                case "BP":
                    switch (systemTerminal) {
                        case "COM":
                        case "COM1":
                        case "W":
                            matchedDeviceTerminal = "CH_COM"
                            break
                        case "NO":
                        case "NO1":
                        case "R":
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
                        case "W":
                            matchedDeviceTerminal = "COM"
                            break
                        case "NO1":
                        case "R":
                            matchedDeviceTerminal = "NO"
                            break
                        case "NC1":
                            matchedDeviceTerminal = "NC"
                            break
                        case "RX_TX":
                            matchedDeviceTerminal = "AnalogOut_A"
                            break
                        case "RX":
                            matchedDeviceTerminal = "VCC_C"
                            break
                        case "TX":
                            matchedDeviceTerminal = "GND_B"
                            break
                    }
                    break
                case "BU":
                    switch (systemTerminal) {
                        case "COM":
                        case "R":
                            matchedDeviceTerminal = "NC2" //terminal 1
                            mandatory = true
                            break
                        case "NO":
                        case "W":
                            matchedDeviceTerminal = "NO1" //terminal 4
                            break
                        case "NC":
                            matchedDeviceTerminal = "NC1"  //terminal 2
                            break
                        case "RX_TX":
                            matchedDeviceTerminal = "AnalogOut_A"
                            break
                        case "RX":
                            matchedDeviceTerminal = "VCC_C"
                            break
                        case "TX":
                            matchedDeviceTerminal = "GND_B"
                            break
                    }
                    break
                case "RU": // RU and LT are identical?
                    switch (systemTerminal) {
                        case "RX_TX":
                            matchedDeviceTerminal = "AnalogOut_A"
                            break
                        case "RX":
                            matchedDeviceTerminal = "VCC_C"
                            break
                        case "TX":
                            matchedDeviceTerminal = "GND_B"
                            break
                    }
                case "LT":
                    switch (systemTerminal) {
                        case "COM1":
                        case "W":
                            matchedDeviceTerminal = "COM"
                            break
                        case "NO1":
                        case "R":
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
                        case "W":
                            matchedDeviceTerminal = "COM"
                            break
                        case "NO1":
                        case "R":
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
    }
    if (0 < Object.keys(deviceStickerWithLabels).length) { return deviceStickerWithLabels }
    return null
}

function fixHWBridge(terminals) {
    if (terminals) {
        //(this is needed for the BP) if there is CH_COM, no HW_COM, an HW_NO or HW_NC, then remove the CH_COM
        // NC2 or NO2 present, COM2 not present, COM1 pesent --> remove COM1
        if ((terminals.HW_NC || terminals.HW_NO) && (!terminals.HW_COM) && terminals.CH_COM && terminals.L) {
            delete terminals.CH_COM
        }
    }
}

function applyHide(device, terminal) {
    if (menus[device][terminal].connectRule) {
        menus[device][terminal].connectRule.style.visibility = menus[device][terminal].present && (!menus[device][terminal].hide)
            ? "visible" : "hidden"
    } else if (menus[device][terminal].connectWirePath) {
        console.log(menus[device][terminal].forceBridge, menus[device][terminal])
        menus[device][terminal].connectWirePath.style.visibility = terminal.match(/^Bridge/)
            ? (menus[device][terminal].present && (!menus[device][terminal].hide)) || menus[device][terminal].forceBridge
                ? "visible" : "hidden"
            : menus[device][terminal].connectWirePath.style.visibility
    }
    if (menus[device][terminal].labelingGroup) {
        menus[device][terminal].labelingGroup.style.display = menus[device][terminal].hide ? "none" : ""
        //menus[device][deviceTerminal].labelingGroup.style.visibility = "hidden"
    }
    if (menus[device][terminal].connectGroup) {
        menus[device][terminal].connectGroup.style.visibility = (menus[device][terminal].present && (!menus[device][terminal].hide)) || menus[device][terminal].forceBridge
            ? "visible" : "hidden"
    }
    if (menus[device][terminal].arrowGroup) {
        menus[device][terminal].arrowGroup.style.visibility = menus[device][terminal].present && (!menus[device][terminal].hide)
            ? "visible" : "hidden"
    }
    if (menus[device][terminal].systemTerminalLabelGroup) {
        menus[device][terminal].systemTerminalLabelGroup.style.visibility = menus[device][terminal].present && (!menus[device][terminal].hide)
            ? "visible" : "hidden"
    }
    if (menus[device][terminal].circle) {
        menus[device][terminal].circle.visibility = menus[device][terminal].present && (!menus[device][terminal].hide)
            ? 3 < menus[device][terminal].label.toString().length
                ? "hidden"
                : "visible"
            : ""
    }
}

function applyMenu(device, terminal, doCalcPictureType) {
    menus[device][terminal].present = terminal.match(/^Bridge/)
        ? menus[device][terminal].present
        : menus[device][terminal].label ? true : false

    if (doCalcPictureType) { applyPictureType(device) }

    applyWriting(device, terminal)

    //applyBridges
    if (("BP" === device) && (-1 !== ["L", "CH_COM", "CH_NO", "CH_NC", "HW_COM", "HW_NO", "HW_NC"].indexOf(terminal))) {
        calculateBridges()
        applyMenu("BP", "Bridge_L_COM", false)
        applyMenu("BP", "Bridge_COM_COM", false)
        applyMenu("BP", "Bridge_L_HWCOM", false)
    }

    applyDashed(device, terminal)

    applyHide(device, terminal)

    //increasing the viewBox of the SVG
    let svgObject = document.getElementById(["svgObject", "labeling", device].join("-"))
    let parentSVG = svgObject.contentDocument.getElementsByTagName("svg")[0]
    let bBox = parentSVG.getBBox()
    let viewPort = parentSVG.getAttribute("viewBox")
    //console.log(bBox, viewPort, parentSVG.viewBox)
    if (parentSVG.viewBox.baseVal.y !== bBox.y) { parentSVG.viewBox.baseVal.y = bBox.y }
    if (parentSVG.viewBox.baseVal.height !== bBox.height) { parentSVG.viewBox.baseVal.height = bBox.height }
}

function calculateBridges(doCreateNewBridges) {
    if (menus && menus.BP) {
        if (doCreateNewBridges) {
            menus.BP["Bridge_COM_COM"] = {}
            menus.BP["Bridge_L_COM"] = {}
            menus.BP["Bridge_L_HWCOM"] = {}
        }
        if (menus.BP.L.label && (!menus.BP["CH_COM"].label) && (!menus.BP["HW_COM"].label)
            && (menus.BP["HW_NO"].label || menus.BP["HW_NC"].label)) {
            menus.BP["Bridge_COM_COM"].present = true
            menus.BP["Bridge_L_COM"].present = true
            menus.BP["Bridge_L_HWCOM"].present = false
        } else if (menus.BP.L.label && (!menus.BP["CH_COM"].label) && (menus.BP["CH_NO"].label || menus.BP["CH_NC"].label)) {
            menus.BP["Bridge_COM_COM"].present = false
            menus.BP["Bridge_L_COM"].present = true
            menus.BP["Bridge_L_HWCOM"].present = false
        } else if (menus.BP.L.label && (!menus.BP["HW_COM"].label) && (menus.BP["HW_NO"].label || menus.BP["HW_NC"].label)) {
            menus.BP["Bridge_COM_COM"].present = false
            menus.BP["Bridge_L_COM"].present = false
            menus.BP["Bridge_L_HWCOM"].present = true
        } else {
            menus.BP["Bridge_COM_COM"].present = false
            menus.BP["Bridge_L_COM"].present = false
            menus.BP["Bridge_L_HWCOM"].present = false
        }
    }
}

function downloadImageFile(event) {
    let device = event.target.id.split("-")[3]
    let pictureName = event.target.id.split("-")[2]
    let pictureType = event.target.id.split("-")[1]
    let svgObject = document.getElementById(["svgObject", pictureName, device].join("-"))
    if (svgObject) {
        let svgElement = svgObject.contentDocument.getElementsByTagName("svg")[0]
        if (svgElement) {
            let fakeDownloadLink = document.createElement("a")
            fakeDownloadLink.download = event.target.textContent
            let serializer = new XMLSerializer()
            let source = serializer.serializeToString(svgElement)
            switch (pictureType) {
                case "svg":
                    if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
                        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
                    }
                    if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
                        source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
                    }
                    //add xml declaration
                    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
                    //convert svg source to URI data scheme.
                    let svgUri = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
                    fakeDownloadLink.href = svgUri
                    fakeDownloadLink.dispatchEvent(new MouseEvent("click", {
                        bubbles: false,
                        cancelable: true
                    }))
                    fakeDownloadLink.remove()
                    break
                case "png":
                    let canvas = document.createElement('canvas');
                    canvas.id = ["canvas", event.target.id].join("-")
                    canvas.width = svgElement.width.baseVal.value
                    canvas.height = svgElement.height.baseVal.value
                    let svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
                    let DOMURL = self.URL || self.webkitURL || self
                    let svgBlobUri = DOMURL.createObjectURL(svgBlob);
                    let ctx = canvas.getContext('2d');
                    let img = new Image();

                    img.onload = function (e) {
                        ctx.drawImage(img, 0, 0);
                        let imgURI = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
                        //let svgImgUri = canvas.toDataURL("image/svg-xml")
                        fakeDownloadLink.href = imgURI
                        fakeDownloadLink.dispatchEvent(new MouseEvent("click", {
                            bubbles: false,
                            cancelable: true
                        }))

                        DOMURL.revokeObjectURL(svgBlobUri);
                        fakeDownloadLink.remove()
                    }
                    img.src = svgBlobUri
                    break
            }
        }
    }
}

console.log(`
----------------------------------
|                                |
|          svg-extension         |
|          Index script          |
|  (makes a page with stickers)  |
|               ...              |`)
console.log("Window.location:", {
    origin: window.location.origin
    , protocol: window.location.protocol
    , host: window.location.host
    , pathname: window.location.pathname
    , payload: decodeURI(window.location.search.substring(1))
})


//first, generate an empty menu structure (one menu per device)
const menus = Object.keys(glbDeviceDict).reduce((accDevice, curDevice) => {
    accDevice[curDevice] = glbDeviceDict[curDevice].terminals.reduce((accTerminal, curTerminal) => {
        accTerminal[curTerminal] = {
            label: null
            , present: false
            , dashed: isWireOptional(curDevice, curTerminal)
        }
        return accTerminal
    }, {})
    return accDevice
}, {})
const root = document.getElementById("root")
const urlParams = decodeURI(window.location.search.substring(1)) ? payload2obj(decodeURI(window.location.search.substring(1))) : null
const useDefault = !(urlParams && (0 < Object.keys(urlParams).length) && (urlParams.interface) && (urlParams.interface.terminalsAndLabels))

console.log("URL parameters:", urlParams)
console.log("MENUS:", menus)
console.log("useDEFAULT:", useDefault)

let header = document.createElement("h1")
header.style.visibility = "hidden"
header.textContent = "No system - default stickers"
if (!useDefault) {
    let notEmptyUrlTerminalMap = Object.keys(urlParams.interface.terminalsAndLabels)
        .filter(terminal => {
            return urlParams.interface.terminalsAndLabels[terminal]
        })
        .reduce((accMap, terminal) => {
            accMap[terminal] = urlParams.interface.terminalsAndLabels[terminal]
            return accMap
        }, {})
    console.log("Not empty URL terminals:", notEmptyUrlTerminalMap)
    for (let device in glbDeviceDict) {
        let matchedTerminalMap = matchDeviceAndSystem(device, notEmptyUrlTerminalMap)
        //console.log(device, "Matched terminals:", matchedTerminalMap)
        if ("BP" === device) {
            fixHWBridge(matchedTerminalMap)
            //console.log(device, "Matched terminals AFTER fix:", matchedTerminalMap)
        }
        //copy matched Stickers to the empty global sticker
        for (let terminal in matchedTerminalMap) {
            menus[device][terminal].label = matchedTerminalMap[terminal].writing
            menus[device][terminal].present = true
            menus[device][terminal].dashed = matchedTerminalMap[terminal].dashed
            menus[device][terminal].matchedTo = matchedTerminalMap[terminal].matchedTo
        }
        if (("BP" === device) && (matchedTerminalMap && (0 < matchedTerminalMap.length))) {
            calculateBridges(true)
            menus.BP.EARTH = {
                present: menus.BP.L.present
                , dashed: true
                , label: menus.BP.L.present ? `\u23DA` : null
            }
        }
    }
    //display system manufacturer and name in the heading
    header.textContent = [urlParams.manufacturer, urlParams.name].filter(word => { return word }).join(" - ")
        + ` (${urlParams.placement ? [urlParams.placement, urlParams.type].join(" ") : urlParams.type})`
        + ` - ${[urlParams.interface.name, urlParams.interface.connectorName].filter(word => { return word }).join(" - ")}`
} else {
    console.log("Empty URL parameters. Generating 'DEFAULT' stickers.")
    //fill menu from defaultLabels
    for (let device in glbDeviceDict) {
        for (let terminal in glbDeviceDict[device].defaultLabels) {
            menus[device][terminal].label = glbDeviceDict[device].defaultLabels[terminal]
            menus[device][terminal].present = menus[device][terminal].label ? true : false
            menus[device][terminal].dashed = isWireOptional(device, terminal)
            menus[device][terminal].matchedTo = terminal
        }
        if ("BP" === device) {
            calculateBridges(true)
        }
    }
}
root.appendChild(header)
header.style.visibility = "visible"
//
// appends menus and svgs
//
const tabsPerDevice = 5 // for the tab focus
let menuDeviceIndex = 0 // for the tab focus
for (let menuDevice in menus) {
    let isFocusSet = false
    let superContainer = document.createElement("div")
    superContainer.className = "superContainer"
    superContainer.id = [superContainer.className, menuDevice].join("-")
    root.appendChild(superContainer)

    let deviceHeading = document.createElement("h2")
    deviceHeading.className = "deviceHeading"
    deviceHeading.textContent = ["\t-", menuDevice].join("\t")
    superContainer.appendChild(deviceHeading)

    let deviceContainer = document.createElement("div")
    deviceContainer.className = "deviceContainer"
    deviceContainer.id = [deviceContainer.className, menuDevice].join("-")
    superContainer.appendChild(deviceContainer)

    let menuContainer = document.createElement("div")
    menuContainer.className = "menuContainer"
    menuContainer.id = [menuContainer.className, menuDevice].join("-")
    deviceContainer.appendChild(menuContainer)
    //Render physical menu elements and fill with actual info from 'menus' map
    if (0 < Object.keys(menus[menuDevice]).length) {

        for (let terminal in menus[menuDevice]) {
            let menuItemId = ["menuItem", menuDevice, terminal].join("-")
            let menuItem = menus[menuDevice][terminal]
            let cell = document.createElement("div")
            cell.id = menuItemId
            menuContainer.appendChild(cell)

            let writingLabel = document.createElement("label")
            writingLabel.className = "input-label"
            writingLabel.textContent = getFriendlyName(menuDevice, terminal)
            cell.appendChild(writingLabel)

            let inputWriting = document.createElement("input")
            inputWriting.tabIndex = tabsPerDevice * menuDeviceIndex + 1
            inputWriting.type = "text"
            inputWriting.value = menus[menuDevice][terminal].label
            inputWriting.size = 3
            inputWriting.id = [menuItemId, "writing"].join("-")
            inputWriting.className = "input-writing"
            inputWriting.oninput = onWritingChanged
            cell.appendChild(inputWriting)
            writingLabel.for = inputWriting.id
            menus[menuDevice][terminal].inputWriting = inputWriting
            //console.log(menuDevice, terminal, "inputWriting.size:", inputWriting.size)
            let inputWidth = window.getComputedStyle(inputWriting).width
            //console.log(menuDevice, terminal, "inputWriting.width:", inputWidth)
            if (terminal.match(/^Bridge/i)) {
                inputWriting.style.visibility = "hidden"
            }
            if (!isFocusSet && inputWriting.value) {
                inputWriting.focus()
                isFocusSet = true
            }

            let dashedGroup = document.createElement("div")

            let checkboxDashed = document.createElement("input");
            checkboxDashed.checked = menus[menuDevice][terminal].dashed
            checkboxDashed.className = "input-checkbox"
            checkboxDashed.id = [menuItemId, "dashed"].join("-")
            checkboxDashed.oninput = onDashed
            checkboxDashed.tabIndex = tabsPerDevice * menuDeviceIndex + 1 + 1
            checkboxDashed.type = "checkbox";

            let dashedLabel = document.createElement("label")
            dashedLabel.textContent = "dash:"
            dashedLabel.for = checkboxDashed.id

            dashedGroup.appendChild(dashedLabel)
            dashedGroup.appendChild(checkboxDashed)
            cell.appendChild(dashedGroup)
            menus[menuDevice][terminal].inputDashed = checkboxDashed

            let hideStickerGroup = document.createElement("div")

            let checkboxHide = document.createElement("input");
            checkboxHide.checked = menus[menuDevice][terminal].hide
            checkboxHide.className = "input-checkbox"
            checkboxHide.id = [menuItemId, "hideSticker"].join("-")
            checkboxHide.oninput = onHideSticker
            checkboxHide.tabIndex = tabsPerDevice * menuDeviceIndex + 1 + 2
            checkboxHide.type = "checkbox";

            let hideStickerLabel = document.createElement("label")
            hideStickerLabel.textContent = "hide:"
            hideStickerLabel.for = checkboxHide.id

            hideStickerGroup.appendChild(hideStickerLabel)
            hideStickerGroup.appendChild(checkboxHide)
            cell.appendChild(hideStickerGroup)
            menus[menuDevice][terminal].inputHide = checkboxHide

            if (terminal.match(/^Bridge/i)) {
                //add checkbox 'force bridge'
                let forceBridgeGroup = document.createElement("div")

                let cbForceBridge = document.createElement("input");
                cbForceBridge.checked = menus[menuDevice][terminal].hide
                cbForceBridge.className = "input-checkbox"
                cbForceBridge.id = [menuItemId, "forceBridge"].join("-")
                cbForceBridge.oninput = onForceBridge
                cbForceBridge.tabIndex = tabsPerDevice * menuDeviceIndex + 1 + 2
                cbForceBridge.type = "checkbox";

                let lblForceBridge = document.createElement("label")
                lblForceBridge.textContent = "force"
                lblForceBridge.for = cbForceBridge.id

                forceBridgeGroup.appendChild(lblForceBridge)
                forceBridgeGroup.appendChild(cbForceBridge)
                cell.appendChild(forceBridgeGroup)
                menus[menuDevice][terminal].forceBridgeCheckBox = cbForceBridge
            }
        }
    } else { console.log(menuDevice, "has no menu???") }

    let picturesContainer = document.createElement("div") // deviceRoot > h2, 
    picturesContainer.className = "picturesContainer"
    picturesContainer.id = [picturesContainer.className, menuDevice].join("-")
    deviceContainer.appendChild(picturesContainer)
    deviceContainer.appendChild(document.createElement("hr"))

    deviceHeading.addEventListener("click", (e) => {
        console.log("You clicked device heading!", e)
        if (deviceContainer) {
            let elemDisplay = window.getComputedStyle(deviceContainer).display
            switch (elemDisplay) {
                case "none":
                    e.target.classList.remove("hideDeviceContainer")
                    e.target.textContent = e.target.textContent.replace("+", "-")
                    deviceContainer.style.display = "block"
                    break
                case "block":
                    e.target.classList.add("hideDeviceContainer")
                    e.target.textContent = e.target.textContent.replace("-", "+")
                    deviceContainer.style.display = "none"
                    break
            }

        }
    })

    for (let pictureName of glbPictureNames) {
        let svgContainer = document.createElement("div") //svg-container contains download link and svg picture
        svgContainer.className = "svgContainer"
        svgContainer.id = [svgContainer.className, pictureName, menuDevice].join("-")
        picturesContainer.appendChild(svgContainer)
        let linksContainer = document.createElement("div") //linksContainer -- for the download links
        linksContainer.className = "linksContainer"
        linksContainer.id = [linksContainer.className, pictureName, menuDevice].join("-")

        const imageTypes = ["svg", "png"]
        //TODO: use button instead of the a (create temp. a when clicked) use css style for the button look
        let downloadLinks = imageTypes.map(imageType => {
            let downloadLink = document.createElement("button")
            downloadLink.tabIndex = tabsPerDevice * menuDeviceIndex + 1 + 4
            downloadLink.style.visibility = "hidden"
            downloadLink.className = "downloadLink"
            downloadLink.id = [downloadLink.className, imageType, pictureName, menuDevice].join("-")
            downloadLink.textContent = `${pictureName}-${menuDevice}.${imageType}`
            //downloadLink.download = downloadLink.textContent
            //downloadLink.target = "_blank"
            //downloadLink.href = downloadLink.textContent
            downloadLink.onclick = downloadImageFile
            linksContainer.appendChild(downloadLink)
            return downloadLink
        })

        //SVG object with ORIGINAL svg file content inside:
        let svgObject = document.createElement("object")
        svgObject.className = "svgObject"
        svgObject.id = [svgObject.className, pictureName, menuDevice].join("-")
        //type="image/svg+xml" width="680" height="840"
        svgObject.type = "image/svg+xml"
        if (glbUpdateSvgDimensions) {
            svgObject.width = glbPictureScales[pictureName].width * glbPictureDimensions[pictureName].width
            svgObject.height = glbPictureScales[pictureName].height * glbPictureDimensions[pictureName].height
        }
        let neededPictureType = "connect" === pictureName ? calculatePictureType(menuDevice) : null
        svgObject.data = neededPictureType && ("file" === glbDeviceDict[menuDevice].interfacePictureMedia)
            ? `svg/${pictureName}-${menuDevice}-${neededPictureType}.svg`
            : `svg/${pictureName}-${menuDevice}.svg`
        //console.log(menuDevice, pictureName, "url:", svgObject.data)
        svgContainer.appendChild(svgObject)
        svgContainer.appendChild(linksContainer)

        ///////////////////////////////////////////////////////////svg.onload()//////////////////////////////////////////////////////////////
        svgObject.onload = function (e) {
            //decode the svg file name into device and picture name
            let svgNameParts = getInfoFromFileName(this.data)
            let svgPictureName = svgNameParts.pictureName
            let svgDevice = svgNameParts.device
            //console.log("onload()", this.data.match(/svg\/(.+\.svg)$/)[1], "--->", svgDevice, svgPictureName)
            if ("labeling" === svgPictureName) {
                //resize the labeling svg (make space on the left and top)
                let outerSvgTag = this.contentDocument.querySelector("svg")
                outerSvgTag.setAttribute("style", "transform: scale(0.9) translate(-2.5%, 5%);")
                let labelingStickerList = this.contentDocument.querySelectorAll("g[transform*=translate] g[title*='terminal sticker']")
                let maxTsi = Math.min(labelingStickerList.length, Object.keys(glbDeviceDict[svgDevice].terminals).length)
                for (let tsi = 0; tsi < maxTsi; tsi++) {
                    let terminal = glbDeviceDict[svgDevice].terminals[tsi]
                    let x = labelingStickerList[tsi].parentNode.getAttribute("transform").match(/translate\(\s*(\d+)\s*\,\s*(\d+)\s*\)/)[1]
                    menus[svgDevice][terminal].circle = labelingStickerList[tsi].parentNode.querySelector("circle")
                    menus[svgDevice][terminal].writtenText = labelingStickerList[tsi].parentNode.querySelector("text")
                    menus[svgDevice][terminal].arrowLine = labelingStickerList[tsi].parentNode.querySelector("g[title='system terminal label arrow'] line")
                    menus[svgDevice][terminal].arrowTip = labelingStickerList[tsi].parentNode.querySelector("g[title='system terminal label arrow'] polygon")
                    menus[svgDevice][terminal].systemTerminalLabelGroup = labelingStickerList[tsi].parentNode.querySelector("g[title='system terminal label'")
                    menus[svgDevice][terminal].arrowGroup = labelingStickerList[tsi].parentNode.querySelector("g[title='system terminal label arrow']")
                    menus[svgDevice][terminal].labelingGroup = labelingStickerList[tsi].parentNode
                    applyMenu(svgDevice, terminal, false)
                }// end reading elements from labeling.svg

            } else if ("connect" === svgPictureName) {
                if ("group" === glbDeviceDict[svgDevice].interfacePictureMedia) {
                    //console.log(svgDevice, "applying GROUP picture type")
                    applyPictureType(svgDevice)
                }
                //let svgPictureType = 3===svgNameParts.length ? svgNameParts[2] : null
                let rules = this.contentDocument.styleSheets && (0 < this.contentDocument.styleSheets.length)
                    ? Array.from(this.contentDocument.styleSheets[0].cssRules)
                        .filter(rule => {
                            return rule.selectorText
                                && ((rule.selectorText.match(/Label(.+)/))
                                    || (rule.selectorText.match(/(Bridge.+)/)))
                        })
                    : null
                if (rules && (0 < rules.length)) {
                    //console.log(svgDevice, "found few '.Label*' and/or '.Bridge*' css selector(s):", rules.length, rules)
                    rules.forEach(rule => {
                        let svgTerminalName = rule.selectorText.match(/\.Label(.+)/)
                            ? rule.selectorText.match(/\.Label(.+)/)[1]
                            : rule.selectorText.match(/(Bridge.+)/)
                                ? rule.selectorText.match(/(Bridge.+)/)[1]
                                : null
                        let terminal = convertSvg2DeviceTerminal(svgDevice, svgTerminalName)
                        //console.log(svgDevice, "svg-terminal:", svgTerminalName, "terminal:", terminal)
                        if (terminal) {
                            menus[svgDevice][terminal].connectRule = rule
                            let connectGroup = this.contentDocument.querySelector(`g${rule.selectorText}:not([id*=mini])`)
                            menus[svgDevice][terminal].connectGroup = connectGroup
                            let miniConnectGroup = this.contentDocument.querySelector(`g${rule.selectorText}[id*=mini]`)
                            menus[svgDevice][terminal].miniConnectGroup = miniConnectGroup
                            if (miniConnectGroup) {
                                menus[svgDevice][terminal].connectWirePath = connectGroup.querySelector("path.st5") //outer
                                menus[svgDevice][terminal].miniConnectWirePath = miniConnectGroup.querySelector("path.st5")

                            } else if (connectGroup) {
                                if (rule.selectorText.match(/Label(.+)/)) {
                                    menus[svgDevice][terminal].connectWirePath = connectGroup.querySelector("g > path")
                                } else if (rule.selectorText.match(/Bridge(.+)/)) {
                                    menus[svgDevice][terminal].connectWirePath = connectGroup.querySelector("path")
                                }
                            }
                            applyMenu(svgDevice, terminal, false)
                        } else {
                            console.log(svgDevice, "svg+terminal not matched", svgTerminalName)
                        }
                    })
                } else {
                    //console.log(svgDevice, "Not found '.Label*' or '.Bridge*' css selector.")
                    for (let svgTerminal in glbDeviceDict[svgDevice].cssRules) {
                        let terminal = glbDeviceDict[svgDevice].cssRules[svgTerminal]
                        try {
                            let connectGroup = this.contentDocument.querySelector(`g#${svgTerminal}`)
                            if (connectGroup) {
                                if (terminal) {
                                    menus[svgDevice][terminal].connectGroup = connectGroup
                                    menus[svgDevice][terminal].connectWirePath = connectGroup.querySelector(`g > path`)
                                    menus[svgDevice][terminal].connectStickerRect = connectGroup.querySelector(`g > rect`)
                                    applyMenu(svgDevice, terminal, false)
                                } else {
                                    connectGroup.style.visibility = "hidden"
                                }
                            } else {
                                //console.log(svgDevice, `g#${svgTerminal}`, "not found in the svg")
                            }
                        } catch (err) {
                            console.log(svgDevice, err.message, svgTerminal, terminal, `g#${svgTerminal}`)
                        }
                    }
                }
                //TODO: a good place for applyMenu(svgDevice, ) call
            }//end of onLoad() the 'connect'.svg
            downloadLinks.forEach(item => { item.style.visibility = "visible" })
        }
        menuDeviceIndex++
    }
}

isFocusSet = false
for (let device in menus) {
    if (menus[device]) {
        for (let terminal in menus[device]) {
            if (menus[device][terminal]) {
                if (!isFocusSet && menus[device][terminal].label) {
                    if (menus[device][terminal].inputWriting) {
                        menus[device][terminal].inputWriting.focus()
                        isFocusSet = true
                    }
                }
            }
        }
    }
}

//append footer here
let footer = document.createElement("div")
footer.className = "footer"
footer.innerHTML = `By <a href="https://github.com/dariatado" tabIndex=99>@DariaTado</a> 2020`
root.appendChild(footer)

console.log(`
|          svg-extension         |
|          Index script          |
|            The End.            |
|ds______________________________|`);