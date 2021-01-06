{
    const global_fontSize = "10px"

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

    function parseDocument() {
        if (!document.querySelector("#id")) { console.log("#id not found in the document. Wrong callee?"); return null }
        let system = { id: parseInt(document.querySelector("#id").value) }
        if (!document.querySelector("form[action][method=get]").getAttribute("action").match(/^\/(\w+)\//)) {
            console.log("System class cannot be detected from the form action. Wrong callee?");
            return null
        }
        system.type = document.querySelector("form[action][method=get]").getAttribute("action").match(/^\/(\w+)\//)[1]
        let cssManufacturer = `#show-${system.type} [class*=manufacturers] [class*=manufacturer] img[title]`
        //console.log(cssManufacturer)
        let manuNode1 = document.querySelector(cssManufacturer)
        if (manuNode1) {
            system.manufacturer = manuNode1.title
        } else {
            let cssManu2 = `#show-${system.type} [data-summary-entry-name=mainManufacturer] > [title]`
            //console.log(cssManu2)
            let manuNode2 = document.querySelector(cssManu2)
            if (manuNode2) {
                system.manufacturer = manuNode2.title
            } else { console.log("Could not detect the manufacturer :-(") }
        }

        system.name = document.querySelector(`#show-${system.type} span.full-name`).textContent
        if ("boilerControl" === system.type) {
            let placement = document.querySelector("[class*=placement] .field-input").textContent.trim().toLowerCase()
            if (placement) { system.placement = placement }
        }

        let cssInterfaces = "div[class*=interface][data-id]"
        let interfaceNodeList = document.querySelectorAll(cssInterfaces)
        let interfaceIndex = 0
        if (interfaceNodeList && (0 < interfaceNodeList.length)) {
            let interfaces = []
            for (let interfaceNode of interfaceNodeList) {
                let interface = {}
                interface.id = interfaceNode.querySelector("div.interface-name a").getAttribute("href").match(/\d+/g)[0]
                interface.compatibilityId = parseInt(interfaceNode.getAttribute("data-id"))
                interface.name = interfaceNode.querySelector("div.interface-name a").textContent
                interface.connectorName = interfaceNode.querySelector("div.connector input[data-field=connector][value]").getAttribute("value")

                let cssSelectorTerminalsAndLabels = `div[class*=interface][data-id='${interface.compatibilityId}'] div.connectorFieldsAndValues div[class*=connectorFieldsColumn]:nth-child(2) [class=connector-field-props][data-field-name]`


                let terminalsAndLabels = Array.from(
                    document.querySelectorAll(cssSelectorTerminalsAndLabels)
                )
                    .map(elem => { return { [elem.getAttribute("data-field-name")]: elem.querySelector("[class=connector-field-value]").textContent } })
                    .reduce((acc, cur) => {
                        acc[Object.keys(cur)[0]] = cur[Object.keys(cur)[0]]
                        return acc
                    }, {})

                if (0 === Object.keys(terminalsAndLabels).length) {
                    cssSelectorTerminalsAndLabels = `div[class*=interface][data-id='${interface.compatibilityId}'] div.connectorFieldsAndValues div[class*=connectorFieldsColumn]:nth-child(1) [class=connector-field-props][data-field-name]`

                    terminalsAndLabels = Array.from(
                        document.querySelectorAll(cssSelectorTerminalsAndLabels)
                    )
                        .map(elem => { return { [elem.getAttribute("data-field-name")]: elem.querySelector("[class=connector-field-value]").textContent } })
                        .reduce((acc, cur) => {
                            acc[Object.keys(cur)[0]] = cur[Object.keys(cur)[0]]
                            return acc
                        }, {})
                }

                interface.terminalsAndLabels = terminalsAndLabels
                console.log("Found interface:", interface.name, interface.terminalsAndLabels)

                interfaces.push(interface)
                interfaceIndex++
            }
            system.interfaces = interfaces
        }
        return system
    }

    function injectActionElement(parentElement, legend, urlExpression, tagName, classValue, id) {
        let actionElement = null
        if (id) {
            actionElement = document.getElementById(id)
        }
        if (!actionElement) {
            actionElement = document.createElement(tagName)
            actionElement.id = id
            parentElement.appendChild(actionElement)
            console.log("Added new button:", actionElement)
        }
        actionElement.className = classValue
        actionElement.textContent = legend
        actionElement.setAttribute("onclick", `window.open(${urlExpression})`)
        actionElement.style.fontSize = global_fontSize
        return actionElement
    }

    function injectInterfaceAction(parentElement, system, interface) {
        //let endpoint = chrome.runtime.getURL("index.html")
        const endpoint = "https://dariatado.github.io/svg-extension/index.html"
        let params = {
            manufacturer: system.manufacturer
            , name: system.name
            , type: system.type
            , ...system.placement ? { placement: system.placement } : null
            , interface: {
                id: interface.id
                , cid: interface.compatibilityId
                , name: interface.name
                , connector: interface.connector
                , terminalsAndLabels: interface.terminalsAndLabels
            }
        }
        injectActionElement(parentElement, "labels...", `'${[endpoint, obj2payload(params)].join("?")}'`, "button", "text-button"
            , ["button", interface.compatibilityId].join("-"))
    }

    function obj2payload(obj) {
        return obj2payloadRecursive(obj)
    }

    function obj2payloadRecursive(obj, name) {
        if (("object" === typeof obj) && (!Array.isArray(obj))) {
            return Object.keys(obj)
                .filter(elem => { return elem })
                .map(elem => { return obj2payloadRecursive(obj[elem], [name, elem].filter(elem => { return elem }).join(".")) })
                .join("&")
        } else {
            return [name, obj].join("=")
        }
    }

    function injectButtons(system) {
        if (system.hasOwnProperty("interfaces")) {
            for (let interface of system.interfaces) {
                if (!interface.name.match(/WIRELESS/)) {
                    let cssInterface = `div[class*=interface][data-id='${interface.compatibilityId}'] div.interface-name`
                    let interfaceNode = document.querySelector(cssInterface)
                    console.log("Adding button to the interface:", interface.name, interface.id, interface.compatibilityId,)
                    if (!interfaceNode) {
                        console.log("Cannot find CSS selector:", cssInterface)
                    } else {
                        let lgButton = injectInterfaceAction(interfaceNode, system, interface)
                    }
                }
            }
        }
    }

    console.log(`
     ________________________________
    |                                |
    |         content script         |
    |                                |
    |   will add 'labels..' buttons  |
    |        to hvactool system      |
    |                                |`)
    if (document.querySelector("#id")) {
        //document.title = parseInt(document.querySelector("#id").value)
        let system = parseDocument()
        console.log("System:", system)
        injectButtons(system)
    } else {
        console.log("Cannot find #id on the page. Wrong page?")
    }
    console.log(`
    |                                |
    |         content script         |
    |            The End.            |
    |ds______________________________|`)
}