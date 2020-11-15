const isVerboseGetParams = true
const isVerboseHideSticker = false
const isVerboseDashed = false
const isVerboseWriting = false

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

function getURLParameters(url) {
    if (!url) {
        url = decodeURI(window.location.search.substring(1))
    } else {
        url = decodeURI(url.split("?")[1])
    }
    if (isVerboseGetParams) { console.log("Getting parameters from string:", url) }
    if (url) {
        let params = url.split("&").map(token => { return token.split("=") }).reduce((acc, cur) => { acc[cur[0]] = cur[1]; return acc }, {})
        if (isVerboseGetParams) { console.log("Parameters after splitting:", params) }
        if (0 < Object.keys(params).filter(elem => { return elem }).length) {
            return numeriseParameters(params)
        }
    }
    if (isVerboseGetParams) { console.log("No parameters in:", url) }
    return null
}

function numeriseParameters(params) {
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
}

function handleHideStickerChange(e, calle) {
    let element = e.target
    let device = element.id.split("-")[1]
    let tadoSticker = element.id.split("-")[2]

    if (isVerboseHideSticker) {
        console.log("hideSticker calee", calle)
        console.log("hideSticker checked", element.checked)
    }

    if (element.checked) {
        menus[device][tadoSticker].group.setAttribute("display", "none")
    } else {
        menus[device][tadoSticker].group.removeAttribute("display")
    }
}

function updateDashFromInput(element){
    let device = element.id.split("-")[1]
    let tadoSticker = element.id.split("-")[2]

    if (isVerboseDashed) {
        console.log("dashed calee", calle)
        console.log("dashed checked", element.checked)
    }

    if (element.checked) {
        menus[device][tadoSticker].circle.setAttribute("stroke-dasharray", 5)
        menus[device][tadoSticker].arrowLine.setAttribute("stroke-dasharray", 5)
    } else {
        menus[device][tadoSticker].circle.removeAttribute("stroke-dasharray")
        menus[device][tadoSticker].arrowLine.removeAttribute("stroke-dasharray")
    }
}

function handleDashedChange(e, calle) {
    let element = e.target
    updateDashFromInput(element)
}

function updateWritingFromInput(element){
    let device = element.id.split("-")[1]
    let tadoSticker = element.id.split("-")[2]
    menus[device][tadoSticker].writing.textContent = element.value

    if (3 < element.value.toString().length) {
        let oldTransform = menus[device][tadoSticker].writing.getAttribute("transform")
        if (oldTransform) {
            let rotatePos = oldTransform.indexOf("rotate")
            if (-1 !== rotatePos) {
                oldTransform = oldTransform.substr(0, rotatePos - 1)
            }
        }
        let newTransform = [oldTransform, "rotate(-45)"].join(" ")
        menus[device][tadoSticker].writing.setAttribute("transform", newTransform)
        menus[device][tadoSticker].circle.style.display = 'none'
    } else {
        let oldTransform = menus[device][tadoSticker].writing.getAttribute("transform")
        if (oldTransform) {
            let rotatePos = oldTransform.indexOf("rotate")
            if (-1 !== rotatePos) {
                oldTransform = oldTransform.substr(0, rotatePos - 1)
            }
        }
        let newTransform = oldTransform
        menus[device][tadoSticker].writing.setAttribute("transform", newTransform)
        menus[device][tadoSticker].circle.style.display = ''
    }

    if ("" !== element.value.toString()) {
        if (isVerboseWriting) { console.log(device, tadoSticker, "writing not empty") }
        menus[device][tadoSticker].arrowGroup.setAttribute("display", null)
        menus[device][tadoSticker].labelGroup.setAttribute("display", null)
    } else {
        if (isVerboseWriting) { console.log(device, tadoSticker, "empty") }
        menus[device][tadoSticker].arrowGroup.setAttribute("display", "none")
        menus[device][tadoSticker].labelGroup.setAttribute("display", "none")
    }
}

function handleWritingChange(e, calle) {
    let element = e.target
    updateWritingFromInput(element )
}
function onWritingChange(e) {
    handleWritingChange(e, "change")
}
function onWritingKeyUp(e) {
    handleWritingChange(e, "keyUp")
}
function onWritingInput(e) {
    handleWritingChange(e, "input")
}
function onWritingPaste(e) {
    handleWritingChange(e, "paste")
}
function onDashedInput(e) {
    handleDashedChange(e, "oninput")
}
function onDashedChange(e) {
    handleDashedChange(e, "onchange")
}
function onHideStickerInput(e) {
    handleHideStickerChange(e, "oninput")
}
function onHideStickerChange(e) {
    handleHideStickerChange(e, "onchange")
}

function isTerminalOptional(device, terminal) {
    if (terminal.match(/NC/)) { return true }
    if ("N" === terminal) {
        if (-1 !== ["RU", "TC", "LT"].indexOf(device)) { return true }
    }
    return false
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
         __| |ds__________________________________________| |__
        (__   ____________________________________________   __)
           | |                                            | |`
)

const devices = ["BP", "BR", "BU", "RU", "LT", "TC"]
let root = document.getElementById("root")
const tadoStickers = {
    "BP": ["N", "L", "CH_COM", "CH_NC", "CH_NO", "HW_COM", "HW_NC", "HW_NO", "EARTH", "P1", "P2"],
    "BR": ["N", "L", "COM", "NC", "NO", "P1", "P2", "P3", "AnalogOut_A", "GND_B", "VCC_C"],
    "BU": ["N", "L", "NC2", "NC1", "NO2", "NO1", "AnalogOut_A", "GND_B", "VCC_C"],
    "RU": ["NO", "NC", "COM", "P1", "P2", "P3", "AnalogOut_A", "GND_B", "VCC_C"],
    "TC": ["COM", "NO", "P1", "P2", "P3"],
    "LT": ["NO", "NC", "COM", "P1", "P2", "P3"]
}

const friendlyNames = {
    "BP": ["N", "L", "CH_COM", "CH_NC", "CH_NO", "HW_COM", "HW_NC", "HW_NO", "EARTH", "P1", "P2"],
    "BR": ["N", "L", "COM", "NC", "NO", "P1", "P2", "P3", "A", "minus", "plus"],
    "BU": ["N", "L", "1", "4", "3", "4", "A", "minus", "plus"],
    "RU": ["NO", "NC", "COM", "P1", "P2", "P3", "A", "minus", "plus"],
    "TC": ["COM", "NO", "P1", "P2", "P3"],
    "LT": ["NO", "NC", "COM", "P1", "P2", "P3"]
}

function getFriendlyName(device, tadoSticker) {
    let index = tadoStickers[device].indexOf(tadoSticker)
    if (-1 !== index){
        let friendlyName = friendlyNames[device][index]
        return friendlyName ? friendlyName : tadoSticker
    }
    return tadoSticker
}

const menus = {}
const stickerLabels = {}

console.log(">>>>> Window url and input parameters:", JSON.stringify({
    origin: window.location.origin
    , protocol: window.location.protocol
    , hostname: window.location.hostname
    , pathname: window.location.pathname
    , payload: decodeURI(window.location.search.substring(1))
}, null, " "))

let urlParams = null
if (decodeURI(window.location.search.substring(1))) {
    urlParams = payload2obj(decodeURI(window.location.search.substring(1)))
    console.log("Parsed parameters:", JSON.stringify(urlParams, null, " "), urlParams)
    
    for (let device in tadoStickers) {
        stickerLabels[device] = {}
        console.log("Matching with device:", device)
        for (let tadoLabel of tadoStickers[device]) {
            console.log("Matching the sticker:", tadoLabel)
            stickerLabels[device][tadoLabel] = null
            if (urlParams.interface.terminalsAndLabels.hasOwnProperty(tadoLabel)) {
                //console.log("Sticker exact match:", tadoLabel)
                stickerLabels[device][tadoLabel] = {
                    writing: urlParams.interface.terminalsAndLabels[tadoLabel]
                    , optional: isTerminalOptional(device, tadoLabel)
                    , matched: tadoLabel
                }
            } else {
                let curStickerLabel = {} // { writing: string, optional: boolean }
                let terminalsAndLabels = urlParams.interface.terminalsAndLabels
                let systemTerminals = Object.keys(urlParams.interface.terminalsAndLabels)
                console.log("Trying to intellectually match the sticker:", tadoLabel, "with:", terminalsAndLabels)
                let rx = new RegExp(`${tadoLabel}`)
                switch (device) {
                    case "BP":
                        switch (tadoLabel) {
                            case "CH_COM":
                                if (0 < systemTerminals.filter(elem => { return elem.match(/COM1/) }).length) {
                                    curStickerLabel.matched = systemTerminals.filter(elem => { return elem.match(/COM1/) })[0]
                                    curStickerLabel.writing = terminalsAndLabels[systemTerminals.filter(elem => { return elem.match(/COM1/) })[0]]
                                } else if (0 < systemTerminals.filter(elem => { return elem.match(/COM/) }).length) {
                                    curStickerLabel.matched = systemTerminals.filter(elem => { return elem.match(/COM/) })[0]
                                    curStickerLabel.writing = terminalsAndLabels[systemTerminals.filter(elem => { return elem.match(/COM/) })[0]]
                                }
                                break
                            case "CH_NO":
                                if (0 < systemTerminals.filter(elem => { return elem.match(/NO1/) }).length) {
                                    curStickerLabel.matched = systemTerminals.filter(elem => { return elem.match(/NO1/) })[0]
                                    curStickerLabel.writing = terminalsAndLabels[systemTerminals.filter(elem => { return elem.match(/NO1/) })[0]]
                                } else if (0 < systemTerminals.filter(elem => { return elem.match(/NO/) }).length) {
                                    curStickerLabel.matched = systemTerminals.filter(elem => { return elem.match(/NO/) })[0]
                                    curStickerLabel.writing = terminalsAndLabels[systemTerminals.filter(elem => { return elem.match(/NO/) })[0]]
                                }
                                break
                            case "CH_NC":
                                if (0 < systemTerminals.filter(elem => { return elem.match(/NC1/) }).length) {
                                    curStickerLabel.matched = systemTerminals.filter(elem => { return elem.match(/NC1/) })[0]
                                    curStickerLabel.writing = terminalsAndLabels[systemTerminals.filter(elem => { return elem.match(/NC1/) })[0]]
                                } else if (0 < systemTerminals.filter(elem => { return elem.match(/NC/) }).length) {
                                    curStickerLabel.matched = systemTerminals.filter(elem => { return elem.match(/NC/) })[0]
                                    curStickerLabel.writing = terminalsAndLabels[systemTerminals.filter(elem => { return elem.match(/NC/) })[0]]
                                }
                                break
                            case "HW_COM":
                                if (0 < systemTerminals.filter(elem => { return elem.match(/COM2/) }).length) {
                                    curStickerLabel.matched = systemTerminals.filter(elem => { return elem.match(/COM2/) })[0]
                                    curStickerLabel.writing = terminalsAndLabels[systemTerminals.filter(elem => { return elem.match(/COM2/) })[0]]
                                }
                                break
                            case "HW_NO":
                                if (0 < systemTerminals.filter(elem => { return elem.match(/NO2/) }).length) {
                                    curStickerLabel.matched = systemTerminals.filter(elem => { return elem.match(/NO2/) })[0]
                                    curStickerLabel.writing = terminalsAndLabels[systemTerminals.filter(elem => { return elem.match(/NO2/) })[0]]
                                }
                                break
                            case "HW_NC":
                                if (0 < systemTerminals.filter(elem => { return elem.match(/NC2/) }).length) {
                                    curStickerLabel.matched = systemTerminals.filter(elem => { return elem.match(/NC2/) })[0]
                                    curStickerLabel.writing = terminalsAndLabels[systemTerminals.filter(elem => { return elem.match(/NC2/) })[0]]
                                }
                                break
                            case "EARTH":
                                //curStickerLabel.writing = "\u23da"
                                curStickerLabel.optional = true
                                break
                        }
                        break
                    case "BR":
                        switch(tadoLabel){
                            case "COM":
                                if (0 < systemTerminals.filter(elem => { return elem.match(/COM1/) }).length) {
                                    curStickerLabel.matched = systemTerminals.filter(elem => { return elem.match(/COM1/) })[0]
                                    curStickerLabel.writing = terminalsAndLabels[systemTerminals.filter(elem => { return elem.match(/COM1/) })[0]]
                                }
                            break
                            case "NO":
                                if (0 < systemTerminals.filter(elem => { return elem.match(/NO1/) }).length) {
                                    curStickerLabel.matched = systemTerminals.filter(elem => { return elem.match(/NO1/) })[0]
                                    curStickerLabel.writing = terminalsAndLabels[systemTerminals.filter(elem => { return elem.match(/NO1/) })[0]]
                                }    
                            break
                            case "NC":
                                if (0 < systemTerminals.filter(elem => { return elem.match(/NC1/) }).length) {
                                    curStickerLabel.matched = systemTerminals.filter(elem => { return elem.match(/NC1/) })[0]
                                    curStickerLabel.writing = terminalsAndLabels[systemTerminals.filter(elem => { return elem.match(/NC1/) })[0]]
                                }    
                            break
                        }
                        break
                    case "BU":
                        break
                    case "RU":
                        if (0<systemTerminals.filter(elem => { return elem.match(rx) }).length){
                            curStickerLabel.matched = systemTerminals.filter(elem => { return elem.match(rx) })[0]
                            curStickerLabel.writing = terminalsAndLabels[systemTerminals.filter(elem => { return elem.match(rx) })[0]]
                        }
                        break
                    case "LT":
                        if (0<systemTerminals.filter(elem => { return elem.match(rx) }).length){
                            curStickerLabel.matched = systemTerminals.filter(elem => { return elem.match(rx) })[0]
                            curStickerLabel.writing = terminalsAndLabels[systemTerminals.filter(elem => { return elem.match(rx) })[0]]
                        }
                        break
                    case "TC":
                        if (0<systemTerminals.filter(elem => { return elem.match(rx) }).length){
                            curStickerLabel.matched = systemTerminals.filter(elem => { return elem.match(rx) })[0]
                            curStickerLabel.writing = terminalsAndLabels[systemTerminals.filter(elem => { return elem.match(rx) })[0]]
                        }
                        break
                }
                curStickerLabel.optional = isTerminalOptional(device,tadoLabel)
                stickerLabels[device][tadoLabel] = curStickerLabel
            }
        }
    }
    console.log("stickerLabels", stickerLabels)
} else {
    let header = document.createElement("h1")
    header.textContent = "Make stickers from scratch"
    root.appendChild(header)
}



for (let device of devices) {
    //console.log("Device", device)
    let deviceRoot = document.createElement("div")
    deviceRoot.className = "device"
    deviceRoot.id = [deviceRoot.className, device].join("-")
    root.appendChild(deviceRoot)

    let heading = document.createElement("h2")
    heading.textContent = device
    deviceRoot.appendChild(heading)

    let top = document.createElement("div")
    top.className = "menu wrapper"
    top.id = [top.className, device].join("-")
    deviceRoot.appendChild(top)

    let svg = document.createElement("object")
    svg.className = "svg"
    svg.id = [svg.className, device].join("-")
    //type="image/svg+xml" width="680" height="840"
    svg.type = "image/svg+xml"
    svg.width = 2*340
    svg.height = 2*420
    svg.data = `svg/labeling-${device.toUpperCase()}.svg`
    //console.log("Inserting SVG from:", svg.data)

    svg.onload = function () {
        //console.log(`svg.onload fired, element.id:`, this.id);
        //console.log(`SVG.onload device:`, device);
        let stickerNodes = this.contentDocument.querySelectorAll("g[transform*=translate] g[title*='terminal sticker']")
        if (tadoStickers[device].length === stickerNodes.length) {
            //console.log(device, "Generating menu from SVG")
            let tsi = 0
            //get actual info from the SVG sticker file ---> fill actual info into the 'menus' global structure
            for (let tadoSticker of tadoStickers[device]) {
                let x = stickerNodes[tsi].parentNode.getAttribute("transform").match(/translate\(\s*(\d+)\s*\,\s*(\d+)\s*\)/)[1]
                //circle, label, arrow
                let circle = stickerNodes[tsi].parentNode.querySelector("circle")
                let writing = stickerNodes[tsi].parentNode.querySelector("text")
                let arrowLine = stickerNodes[tsi].parentNode.querySelector("g[title='system terminal label arrow'] line")
                let arrowTip = stickerNodes[tsi].parentNode.querySelector("g[title='system terminal label arrow'] polygon")
                let labelGroup = stickerNodes[tsi].parentNode.querySelector("g[title*='system terminal label'")
                let arrowGroup = stickerNodes[tsi].parentNode.querySelector("g[title='system terminal label arrow']")
                let menuElem = {
                    label: writing ? writing.textContent : null
                    , present: circle ? true : false
                    , dashed: circle ? circle.getAttribute("stroke-dasharray") ? true : false : false
                    , x: x
                    , hideSticker: false
                    , writing: writing
                    , circle: circle
                    , labelGroup: labelGroup
                    , arrowGroup: arrowGroup
                    , arrowLine: arrowLine
                    , arrowTip: arrowTip
                    , group: stickerNodes[tsi].parentNode
                }
                //console.log(device, tadoSticker, menuElem)
                if (menus[device]) {
                    //console.log(device, "has menu")
                    menus[device][tadoSticker] = menuElem
                } else {
                    //console.log(device, "has no menu yet", "adding", { [tadoSticker]: menuElem })
                    menus[device] = { [tadoSticker]: menuElem }
                }
                tsi++
            }
            //console.log("menu content", menus[device])
            //Render physical menu elements and fill with actual info from 'menus' structure
            let myRoot = svg.parentElement
            let myMenu = myRoot.getElementsByClassName("menu")[0]
            //console.log("root device element", myRoot)
            //console.log("menu element", myMenu)
            if (0 < Object.keys(menus[device]).length) {
                //let table = document.createElement("table")
                //table.style.backgroundColor = "red"
                //myMenu.appendChild(table)
                //let tableRow = document.createElement("tr")
                //table.appendChild(tableRow)

                for (let tadoSticker in menus[device]) {
                    let menuItemId = ["menuItem", device, tadoSticker].join("-")
                    let menuItem = menus[device][tadoSticker]

                    let cell = document.createElement("div")
                    cell.id = menuItemId
                    myMenu.appendChild(cell)
                    /* let cell = document.createElement("td")
                    cell.style.width=47
                    tableRow.appendChild(cell) */

                    let writingLabel = document.createElement("label")
                    writingLabel.className = "tadoLabel tado-terminal-label"
                    writingLabel.textContent = getFriendlyName(device, tadoSticker)
                    cell.appendChild(writingLabel)
                    let inputWriting = document.createElement("input")
                    inputWriting.type = "text"
                    inputWriting.value = menuItem.label
                    inputWriting.id = [menuItemId, "writing"].join("-")
                    inputWriting.className = "input-writing"
                    //inputWriting.onchange=onWritingChange
                    //inputWriting.onkeyup=onWritingKeyUp
                    //inputWriting.onpaste=onWritingPaste
                    inputWriting.oninput = onWritingInput
                    cell.appendChild(inputWriting)
                    writingLabel.for = inputWriting.id

                    let dashedGroup = document.createElement("div")

                    let inputDashed = document.createElement("input");
                    inputDashed.type = "checkbox";
                    inputDashed.checked = menuItem.dashed
                    inputDashed.id = [menuItemId, "dashed"].join("-")
                    inputDashed.oninput = onDashedInput

                    let dashedLabel = document.createElement("label")
                    dashedLabel.textContent = "dash:"
                    dashedLabel.for = inputDashed.id

                    dashedGroup.appendChild(dashedLabel)
                    dashedGroup.appendChild(inputDashed)
                    cell.appendChild(dashedGroup)

                    let hideStickerGroup = document.createElement("div")

                    let inputHideSticker = document.createElement("input");
                    inputHideSticker.type = "checkbox";
                    inputHideSticker.id = [menuItemId, "hideSticker"].join("-")
                    inputHideSticker.checked = menuItem.hideSticker
                    inputHideSticker.oninput = onHideStickerInput

                    let hideStickerLabel = document.createElement("label")
                    hideStickerLabel.textContent = "hide:"
                    hideStickerLabel.for = inputHideSticker.id

                    hideStickerGroup.appendChild(hideStickerLabel)
                    hideStickerGroup.appendChild(inputHideSticker)
                    cell.appendChild(hideStickerGroup)
                }
            } else { console.log(device, "has no menu") }

            //apply data from the URL's input params to the menu and svg
            if(stickerLabels && stickerLabels[device]) {
                if (0 < Object.keys(menus[device]).length) {
                    //apply data from the URL's input params to the menu
                    //console.log("apply data from the URL's input params to the menu:", menus[device])
                    for (let tadoSticker in menus[device]){
                        //stickerLabels[device][tadoSticker]
                        menus[device][tadoSticker].label = stickerLabels[device][tadoSticker].writing ? stickerLabels[device][tadoSticker].writing : null
                        menus[device][tadoSticker].dashed = stickerLabels[device][tadoSticker].optional
                    }
                    //apply data from menu to the svg
                    //console.log("apply data from menu to the svg")
                    for (let tadoSticker in menus[device]){
                        let menuItemId = ["menuItem", device, tadoSticker].join("-")
                        let writingElemId = [menuItemId, "writing"].join("-")
                        let dashElemId = [menuItemId, "dashed"].join("-")
                        let writingInput = document.getElementById(writingElemId)
                        writingInput.value = menus[device][tadoSticker].label
                        let dashInput = document.getElementById(dashElemId)
                        writingInput.checked = menus[device][tadoSticker].dashed
                        updateWritingFromInput(writingInput)
                        updateDashFromInput(dashInput)
                    }
                } else { console.log(device, "has no menu") }
            } else {
                console.log("No sticker labels generated for device:", device)
            }
        } else {
            console.log(device, "lengths do not match")
            console.log(device, "tadoStickers", tadoStickers[device].length, "svg stickers", stickerNodes.length)
            console.log(device, "tadoStickers", tadoStickers[device], "svg stickers", stickerNodes)
        }
    }
    deviceRoot.appendChild(svg)
}

