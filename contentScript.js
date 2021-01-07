{
    function parseDocument() {

        if (!document.querySelector("#id")) { console.log("#id not found in the document. Wrong callee?"); return null }
        system = { id: parseInt(document.querySelector("#id").value) }
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
                //console.log("Found interface:", interface.name, interface.terminalsAndLabels)
                //inject 'labels' button here
                let injectee = document.querySelector(`div[class*=interface][data-id='${interface.compatibilityId}'] div.interface-name`)
                if (injectee) {
                    //console.log("Adding button to the interface:", injectee)
                    let actionId = ["button", interface.compatibilityId].join("-")
                    let actionElement = document.getElementById(actionId)
                    if (!actionElement) {
                        actionElement = document.createElement("button")
                        actionElement.id = actionId
                        actionElement.className = "text-button"
                        actionElement.onclick = fireAction
                        actionElement.textContent = "labels..."
                        actionElement.style.fontSize = "0.6em"
                        injectee.appendChild(actionElement)
                    }
                } else {
                    //console.log("injection node not found?", `div[class*=interface][data-id='${interface.compatibilityId}'] div.interface-name`)
                }

                interfaces.push(interface)
            }
            system.interfaces = interfaces
        }
        return system
    }

    function obj2payload(obj, name) {
        if (("object" === typeof obj) && (!Array.isArray(obj))) {
            return Object.keys(obj)
                .filter(elem => { return elem })
                .map(elem => { return obj2payload(obj[elem], [name, elem].filter(elem => { return elem }).join(".")) })
                .join("&")
        } else {
            return [name, obj].join("=")
        }
    }

    function fireAction(event) {
        //console.log("event:", event)
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

            chrome.storage.sync.get({
                svgPageSource: ''
            }, function (items) {
                //console.log("Stored value for index.html url:", items);
                if (items && items.svgPageSource && (!items.svgPageSource.match(/self/i))) {
                    endpoint = items.svgPageSource
                } else {
                    endpoint = chrome.runtime.getURL("index.html")
                }
                //console.log("Resulting index.html url:", endpoint)
                let fakeLink = document.createElement("a")
                fakeLink.href = `${endpoint}?${obj2payload(params)}`
                fakeLink.download = "index.html"
                fakeLink.target = "_blank"
                //console.log("clicking the fake link:", fakeLink)
                fakeLink.dispatchEvent(new MouseEvent("click", {
                    //view:"window",
                    bubbles: false,
                    cancelable: true
                }))
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
    //console.log("endpoint:", endpoint)
    var system = null
    //console.log("system:", system)
    chrome.storage.sync.get({
        svgPageSource: 'self'
    }, function (items) {
        //console.log("Stored value for svgPageSource:", items);
        if (items && items.svgPageSource && (!items.svgPageSource.match(/self/i))) {
            endpoint = items.svgPageSource
        }
        //console.log("Resulting svg-extension index.html url:", endpoint)
        parseDocument()
    });
    console.log(`
    |                                |
    |          svg-extension         |
    |         content script         |
    |            The End.            |
    |ds______________________________|`)
}