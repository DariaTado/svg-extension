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

    function fireAction(event) {
        console.log("event:", event)
        let dataId = event.target.id.split("-")[1] ? Number(event.target.id.split("-")[1]) : null
        if (dataId) {
            let interface = system.interfaces.filter(interface => {
                return dataId === interface.compatibilityId
            })[0]

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

            let fakeLink = document.createElement("a")
            fakeLink.href = `${endpoint}?${obj2payload(params)}`
            fakeLink.download = "index.html"
            fakeLink.dispatchEvent(new MouseEvent("click", {
                bubbles: false,
                cancelable: true
            }))
        }
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

    function fireAction(event) {
        console.log("event:", event.target.id)
        let dataId = event.target.id.split("-")[1] ? Number(event.target.id.split("-")[1]) : null
        console.log("data id:", dataId)
        if (dataId) {
            let interface = system.interfaces.filter(interface => {
                return dataId === interface.compatibilityId
            })[0]

            if (interface) {
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

                let fakeLink = document.createElement("a")
                fakeLink.href = `${endpoint}?${obj2payload(params)}`
                fakeLink.download = "index.html"
                fakeLink.target = "_blank"
                console.log("clicking the fake link:", fakeLink)
                fakeLink.dispatchEvent(new MouseEvent("click", {
                    //view:"window",
                    bubbles: false,
                    cancelable: true
                }))
            }


        }
    }

    function injectButtons() {
        if (system && system.interfaces && Array.isArray(system.interfaces) && (0 < system.interfaces.length)) {
            system.interfaces.filter(interface => {
                return interface.name ? !interface.name.match("WIRELESS") : null
            }).forEach(interface => {
                let interfaceNode = document.querySelector(`div[class*=interface][data-id='${interface.compatibilityId}'] div.interface-name`)
                if (interfaceNode) {
                    console.log("Adding button to the interface:", interfaceNode)

                    //injectInterfaceAction(interfaceNode, interface)
                    let actionId = ["button", interface.compatibilityId].join("-")
                    let actionElement = document.getElementById(actionId)
                    if (!actionElement) {
                        actionElement = document.createElement("button")
                        actionElement.id = actionId
                        actionElement.className = "text-button"
                        actionElement.onclick = fireAction
                        actionElement.textContent = "labels..."
                        interfaceNode.appendChild(actionElement)
                    }
                }
            })
        }
    }

    console.log(`
     ________________________________
    |          svg-extension         |
    |         content script         |
    | it will add 'labels..' buttons |
    |     to the hvac-tool system    |
    |                                |`)
    var endpoint = chrome.runtime.getURL("index.html")
    console.log("endpoint:" , endpoint)
    var system = null
    if (document.querySelector("#id")) {
        const doSync = true
        if (doSync) {
            chrome.storage.sync.get({
                svgPageSource: 'self'
            }, function (items) {
                console.log("Stored value for svgPageSource:", items);
                if (items && items.svgPageSource && (!items.svgPageSource.match(/self/i))) {
                    endpoint = items.svgPageSource
                }
                console.log("Browser action url:", endpoint)

                system = parseDocument()
                console.log("System:", system)
                injectButtons(system)
            });
        } else {
            console.log("svg-extension index.html url:", endpoint)
            let system = parseDocument()
            console.log("system:", system)
            injectButtons(system)
        }
    } else {
        console.log("Cannot find #id on the page. Wrong page?")
    }
    console.log(`
    |                                |
    |          svg-extension         |
    |         content script         |
    |            The End.            |
    |ds______________________________|`)
}