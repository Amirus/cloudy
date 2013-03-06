var storage = chrome.storage.sync; 

var addService = function (serviceName, serviceKeyword) {
    storage.get("services", function(items) {
        if (typeof items.services === "undefined") {
            // no preferences saved, do nothing
            console.log("No preferences saved, " + serviceName + 
                " is automatically added in default popup html.");
        } else if (typeof items.services.updates === "undefined" ||
                items.services.updates[serviceName] !== "supported"){
            console.log("Adding service " + serviceName);
            var insertIndex = 2;
            if (items.services.enabled.length < 2) {
                insertIndex = 0;
            }
            // insert SkyDrive as the third enabled service
            items.services.enabled.splice(insertIndex, 0, {
                keyword: serviceKeyword,
                name: serviceName
            });
            items.services.updates = items.services.updates || {};
            items.services.updates[serviceName] = "supported";
            
            storage.set({"services": items.services});
        }
    });
}

var onInit = function (details) {
    console.log("ON_INIT");
    if (details.reason === "update") {
        console.log("Cloudy was updated");
        if (details.previousVersion < "0.6.0.0") {
            // version 0.6.0.0 adds SkyDrive support
            console.log("Version 0.6.0.0 adds SkyDrive support");
            addService("SkyDrive", "SKYDRIVE");
            var notification = {
                done: false,
                template: "templates/skydrive-bubble.html"
            };
            storage.set({"notification": notification});
        }
    }
}

chrome.runtime.onInstalled.addListener(onInit);
