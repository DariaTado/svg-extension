{
    const devices = ["BP", "BR", "RU", "LT", "TC"]
    let root = document.getElementById("root")
    
    for (device of devices){
        console.log("Device", device)
        let deviceRoot = document.createElement("div")
        deviceRoot.className = "device"
        deviceRoot.id = [deviceRoot.className, device.toLowerCase()].join("-")
        root.appendChild(deviceRoot)

        let top = document.createElement("div")
        top.className = "menu"
        top.id = [top.className, device.toLowerCase()].join("-")
        deviceRoot.appendChild(top)

        let svg = document.createElement("object")
        svg.className = "svg"
        svg.id = [svg.className, device.toLowerCase()].join("-")
        //type="image/svg+xml" width="680" height="840"
        svg.type = "image/svg+xml"
        svg.width = 680
        svg.height = 840
        svg.data=`svg/labeling-${device.toUpperCase()}.svg`
        svg.onload = function() {
            console.log(`svg loaded - ${this.id}`);
            let doc = this.contentDocument
            console.log("doc",doc)
            let elements = doc.getElementsByTagNameNS("http://www.w3.org/2000/svg", "g")
            console.log("elements", elements.length)
        }
        deviceRoot.appendChild(svg)
    }

    for (device of devices){
        /* let transformList = document.querySelectorAll("g[transform*=translate]")
        console.log("transform nodes", transformList.length)
        for (transNode of transformList){
            console.log(transNode.transform)
        } */
        let deviceRoot = document.getElementById(["device", device.toLowerCase()].join("-"))
        let deviceMenu = document.getElementById(["menu", device.toLowerCase()].join("-"))
        let svg = document.getElementById(["svg", device.toLowerCase()].join("-"))

    }
}