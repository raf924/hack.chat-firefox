function notifyMe() {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
        alert("This browser does not support system notifications");
    }
    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                var notification = new Notification("Hey! You're now going to receive notifications if you nickname is mentioned! Isn't that great?!");
            }
        });
    }

}

if ("mozNotification" in navigator) {
    window.Notification = {
        "permission": "granted"
    };
}
var timer = window.setInterval(checkNick, 500);
var notifyEvent = new Event("notify");
var windowIsActive = true;
window.onfocus = function () {
    windowIsActive = true;
}
window.onblur = function () {
    windowIsActive = false
}

function checkNick() {
    if (myNick) {
        window.clearInterval(timer);
        notifyMe();
        var nick = myNick.split("#")[0];
        var password = myNick.split("#")[1];
        var new_PushMessage = pushMessage;
        pushMessage = function (args) {
            if (args.text.split("@" + nick).length > 1 && !windowIsActive) {
                document.dispatchEvent(notifyEvent);
                var notification = new Notification("Hey!", {
                    body: args.nick + " is calling you name in the " + myChannel + " hack.chat channel! Come see what it's about!",
                });
            }
            new_PushMessage(args);
        };
    }
}
