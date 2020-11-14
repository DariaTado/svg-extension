{
    const systemTypes = [{ type: "roomThermostat", nameForFile: "RT" }
    , { type: "roomThermostatReceiver", nameForFile: "RF_Receiver" }
    , { type: "auxiliaryControl", nameForFile: "External_Controller" }
    , { type: "remote", nameForFile: "RT" }
    , { type: "boilerControl", nameForFile: "Boiler" }
    , { type: "boilerControlWithFitsIn", nameForFile: "Boiler" }
    , { type: "boiler", nameForFile: "Boiler" }
]

const devices = [{
    hvac: "tado° Wireless Receiver UK"
    , pattern: /tado.*\s+Wireless\s+Receiver\s+UK/ //used to get deviceId
    , boxHw: "BP02"
    , shortName: "BP"
    , deviceId: 25
    , id: 25
    , displayName: "BP UK"
    , prefix: "BP" //used in file name
}
    , {
    hvac: "tado° Wireless Receiver EU"
    , pattern: /tado.*\s+Wireless\s+Receiver\s+EU/
    , boxHw: "BR02"
    , shortName: "BR"
    , deviceId: 24
    , id: 24
    , displayName: "BR EU"
    , prefix: "BR"
}
    , {
    hvac: "tado° Extension Kit"
    , pattern: /tado.*\s+Extension\s+Kit/
    , boxHw: "BU01"
    , shortName: "BU"
    , deviceId: 13
    , id: 13
    , displayName: "EKIT"
    , prefix: "BU"
}
    , {
    hvac: "tado° Smart Thermostat"
    , pattern: /tado.*\s+Smart\s+Thermostat/
    , boxHw: "RU01"
    , shortName: "RU"
    , deviceId: 12
    , id: 12
    , displayName: "ST"
    , prefix: "RU"
}
    , {
    hvac: "2-terminal connector (WAGO)"
    , pattern: /2\-terminal connector/
    , boxHw: "TC01"
    , shortName: "TC"
    , deviceId: 27
    , id: 27
    , displayName: "Wago"
    , prefix: "TC"
}
    , {
    publicName: "Luster terminal"
    , pattern: /Luster terminal/
    , boxHw: "LT01"
    , shortName: "LT"
    , deviceId: 15
    , id: 15
    , displayName: "Luster terminal"
}
    , {
    publicName: "Connector Kit (BY)"
    , pattern: /Connector Kit \(BY\)/
    , boxHw: "BY01"
    , shortName: "BY"
    , deviceId: 10
    , id: 10
    , displayName: "Old BY"
    , prefix: "BY"
}
    , {
    publicName: "Connector Kit (BX)"
    , pattern: /Connector Kit \(BX\)/
    , boxHw: "BX01"
    , shortName: "BX"
    , deviceId: 8
    , id: 8
    , displayName: "Old BX"
    , prefix: "BX"
}]

function getSystemInfoFromWindow() {
    let system = {}
    system.id = parseInt(document.querySelector("#id").value)
    system.type = document.querySelector("form[action][method=get]").getAttribute("action").match(/^\/(\w+)\//)[1]
    let cssManufacturer = `#show-${system.type} [class*=manufacturers] [class*=manufacturer] img[title]`
    //console.log(cssManufacturer)
    let manuNode1 = document.querySelector(cssManufacturer)
    if (manuNode1){
        system.manufacturer = manuNode1.title
    } else {
        let cssManu2 = `#show-${system.type} [data-summary-entry-name=mainManufacturer] > [title]`
        //console.log(cssManu2)
        let manuNode2 = document.querySelector(cssManu2)
        if (manuNode2){
            system.manufacturer = manuNode2.title
        } else { console.log("Could not detect the manufacturer :-(")}
    }
    
    system.name = document.querySelector(`#show-${system.type} span.full-name`).textContent
    if ("boilerControl" === system.type) {
        let placement = document.querySelector("[class*=placement] .field-input").textContent.trim().toLowerCase()
        if (placement) { system.placement = placement }
    }

    let cssInterfaces = "div[class*=interface][data-id]"
    let intList = document.querySelectorAll(cssInterfaces)
    let intCnt = 0
    if (intList && (0 < intList.length)) {
        let interfaces = []
        for (let intNode of intList) {
            let interface = {}

            interface.compatibilityId = parseInt(intNode.getAttribute("data-id"))

            let cssInterface = cssInterfaces.replace(/\[data\-id\]/, `[data-id='${interface.compatibilityId}']`)

            interface.name = intNode.querySelector("div.interface-name a").textContent
            interface.id = intNode.querySelector("div.interface-name a").getAttribute("href").match(/\d+/g)[0]
            interface.connectorName = intNode.querySelector("div.connector input[data-field=connector][value]").getAttribute("value")
            let tbmList = intNode.querySelectorAll("[class*=terminal-blocks-matchings] [class*=terminal-blocks-matching]")

            if (tbmList) {
                let tbms = []
                let tbmIndex = 0
                for (let tbmNode of tbmList) {
                    let tbm = {}

                    let deviceLongName = tbmNode.querySelector("legend").firstChild.textContent
                    tbm.deviceLongName = deviceLongName
                    let deviceId = devices.filter(deviceObj => { return deviceLongName.match(deviceObj.pattern) })[0].id

                    let legend = tbmNode.querySelector("legend").lastChild.textContent

                    let tbmId = parseInt(tbmNode.querySelector("object[data]").data.match(/tbmId\=(\d+)/)[1])

                    if (tbmId) { tbm.id = tbmId }
                    if (deviceId) { tbm.deviceId = deviceId }
                    if (legend && ("" < legend) && (deviceLongName !== legend)) {
                        tbm.legend = legend
                        if (legend.match(/bridge\s+not\s+present/gi)) { tbm.bridgePresent = false }
                        else if (legend.match(/bridge\s+present/gi)) { tbm.bridgePresent = true }
                    }

                    tbms.push(tbm)
                }
                if (0 < tbms.length) { interface.tbms = tbms }
            }
            interfaces.push(interface)

            intCnt++
        }
        system.interfaces = interfaces
    }
    return system
}

function makeFileNameFromParams(params) {
    if (params) {
        const version = 4.4
        let devicePrefix = devices.filter(device => params.deviceId === device.id)[0].prefix
        let systemNameForFile = systemTypes.filter(systemType => params.systemType === systemType.type)[0].nameForFile
        let legend = null
        if (params.hasOwnProperty("bridgePresent")) {
            if (("" !== params.bridgePresent) && (null !== params.bridgePresent) && (unknown !== params.bridgePresent)) {
                if (params.bridgePresent) {
                    legend = "bridge present"
                } else {
                    legend = "bridge not present"
                }
            }
        }
        let fileName = [devicePrefix + version
            , [systemNameForFile, "Template"].join("_")
            , legend
            , params.locale]
            .filter(elem => elem)
            .join(" - ")

        return fileName
    }
    return null
}


const global_fontSize = "10px"


function injectMenu(parentElement, legend, items, selected, id, classAttr) {
    //TODO: move to CSS: menuSelectElement.style.fontSize = 10
    //console.log("menu\t" + id)
    //console.log(items)
    if (items) {
        //console.log("items found!")
        if (legend) {
            //console.log("legend present!")
            let menuLegendElement = document.createElement("legend")
            menuLegendElement.textContent = legend
            parentElement.appendChild(menuLegendElement)
            menuLegendElement.style.fontSize = global_fontSize
        }
        let menuSelectElement = document.createElement("select")
        menuSelectElement.id = id
        if (classAttr) { menuSelectElement.setAttribute("class", classAttr) }
        for (let item of items) {
            //console.log(item)
            //console.log(typeof items)
            let menuOption = document.createElement("option")
            if (("object" === typeof item) && (item.hasOwnProperty("value"))) {
                menuOption.value = item.value
                menuOption.textContent = item.legend
                if (selected === item.value) { menuOption.setAttribute("selected", "selected") }
            } else {
                menuOption.value = item
                menuOption.textContent = item
                if (selected === item) { menuOption.setAttribute("selected", "selected") }
            }
            menuSelectElement.appendChild(menuOption)
        }
        parentElement.appendChild(menuSelectElement)
        menuSelectElement.style.fontSize = global_fontSize
        return menuSelectElement
    }
}

function injectLanguageMenu(parentElement, id) {
    return injectMenu(parentElement, "", ["en", "de", "es", "it", "fr", "nl"], "en", "language-menu-" + id, "language menu")
}

function injectDeviceMenu(parentElement, devices, selectedDevice, id) {
    return injectMenu(parentElement, "", devices, selectedDevice, "device-menu-" + id, "device menu")
}

function injectActionElement(parentElement, legend, urlExpression, tagName, classValue) {
    let actionElement = document.createElement(tagName)
    actionElement.setAttribute("class", classValue)
    actionElement.textContent = legend
    actionElement.setAttribute("onclick", `window.open(${urlExpression})`)
    parentElement.appendChild(actionElement)
    actionElement.style.fontSize = global_fontSize
    return actionElement
}

function injectInterfaceAction(parentElement, system, interface, tbm) {
    const docEndpoint = "https://script.google.com/a/tado.com/macros/s/AKfycbyyu3I8pzXvG92XDi2ct8xKfQ2b6fCP5ENX81KI2ryC/dev"
    let flowEndpoint = chrome.runtime.getURL("index.html")
    let params = {
        systemId: system.id
        , systemType: system.type
        , manufacturer: system.manufacturer
        , systemName: system.name
        , interfaceCompatibilityId: interface.compatibilityId
        , interfaceName: interface.name
        , connectorName: interface.connectorName
        //, locale: "en"
        //, deviceId: tbmDeviceId
        //, tbmId: tbmId
        //, tbmLegend: legend
        //, bridgePresent: bridgePresent
    }

    let defaultDevice = -1 !== ["roomThermostat", "remote"].indexOf(system.type)
        ? 13 //BU01
        : -1 !== ["roomThermostatReceiver", "auxiliaryControl", "boiler", "boilerControl", "boilerControlWithFitsIn"].indexOf(system.type)
            ? 12 //RU01
            : 12 //RU01
    let urlExpression = ""

    if (tbm) {
        params.tbmId = tbm.id
        if (tbm.hasOwnProperty("legend")) { params.tbmLegend = tbm.legend }
        if (tbm.hasOwnProperty("bridgePresent")) { params.bridgePresent = tbm.bridgePresent }
        if (tbm.hasOwnProperty("deviceLongName")) { params.deviceLongName = tbm.deviceLongName }
        params.deviceId = tbm.deviceId
        injectLanguageMenu(parentElement, `${interface.compatibilityId}-${tbm.id}`)
        urlExpression += ` +'&locale=' + document.getElementById('language-menu-${interface.compatibilityId}-${tbm.id}').value`
    } else {
        let deviceMenuItems = devices
            .sort((a, b) => a.boxHw < b.boxHw ? -1 : a.id - b.id)
            .map(device => { return { value: device.id, legend: device.boxHw } })
        injectDeviceMenu(parentElement, deviceMenuItems, defaultDevice, interface.compatibilityId)
        urlExpression += ` +'&deviceId=' + document.getElementById('device-menu-${interface.compatibilityId}').value`
        injectLanguageMenu(parentElement, interface.compatibilityId)
        urlExpression += ` +'&locale=' + document.getElementById('language-menu-${interface.compatibilityId}').value`
    }

    let payload = encodeURI(Object.keys(params).map(paramName => [paramName, params[paramName]].join("=")).join("&"))

    let docUrl = [docEndpoint, payload].join("?")
    let flowUrl = [flowEndpoint, payload].join("?")
    let flowUrlExpression = `'${flowUrl}'${urlExpression}`
    let docUrlExpression = `'${docUrl}'${urlExpression}`

    
    injectActionElement(parentElement, "d", docUrlExpression, "button", "text-button")
    injectActionElement(parentElement, "f", flowUrlExpression, "button", "text-button")
}

function loopInterfaces(system) {
    if (system.hasOwnProperty("interfaces")) {
        for (let interface of system.interfaces) {
            if (!interface.name.match(/WIRELESS/)) {
                let cssInterface = `div[class*=interface][data-id='${interface.compatibilityId}']`
                let intNode = document.querySelector(cssInterface)
                let noTbmNode = document.createElement("div")
                noTbmNode.setAttribute("class", "interface-flow")
                noTbmNode.style.borderWidth = "0.1px"
                noTbmNode.style.borderColor = "#ffffff"//"#fbe895" //yellow "Sweet Corn"
                noTbmNode.style.borderStyle = "solid"
                let node1 = intNode.firstElementChild
                node1.appendChild(noTbmNode)
                injectInterfaceAction(noTbmNode, system, interface)

                if (interface.hasOwnProperty("tbms")) {
                    let tbmList = intNode.querySelectorAll("[class*=terminal-blocks-matchings] [class*=terminal-blocks-matching]")
                    for (let tbmNode of tbmList) {
                        let newTbmNode = document.createElement("div")
                        newTbmNode.setAttribute("class", "interface-tbm-flow")
                        newTbmNode.style.borderWidth = "0.1px"
                        newTbmNode.style.borderColor = "#ffffff" //"#bcde88" //green "Yellow Green"
                        newTbmNode.style.borderStyle = "solid"

                        tbmNode.appendChild(newTbmNode)

                        let url = tbmNode.querySelector("div[class*=terminal-blocks] > object[data]").getAttribute("data")
                        let tbmNodeId = parseInt(url.match(/tbmId\=(\d+)/)[1])
                        let tbmObj = interface.tbms.filter(tbm => { return tbmNodeId === tbm.id })[0]
                        injectInterfaceAction(newTbmNode, system, interface, tbmObj)
                    }
                }
            }
        }
    }
}

console.log(
` __| |____________________________________________| |__
(__   ____________________________________________   __)
   | |                                            | |
   | |                                            | |
   | |                                            | |
   | |            My content Script !             | |
   | |                                            | |
   | |                                            | |
 __| |ds__________________________________________| |__
(__   ____________________________________________   __)
   | |                                            | |`
)

let systemId = parseInt(document.querySelector("#id").value)
document.title = systemId 
let endpoint = chrome.runtime.getURL("index.html")
console.log(endpoint)
}