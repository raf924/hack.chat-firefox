'use strict';

var self = require('sdk/self');
var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var URL = require("sdk/url").URL;
var notifications = require("sdk/notifications");
var pageMod = require("sdk/page-mod");
var {
    setInterval, clearInterval
} = require("sdk/timers");


var myIconURL = self.data.url("myIcon.png");

var data = self.data.url("inject-notification.js");

function createButton(tab) {
    var button = buttons.ActionButton({
        id: "hackchat",
        label: "Go to " + tab.channel + " channel",
        icon: {
            "16": "./chatbubble-outline-16.png",
            "32": "./chatbubble-outline-32.png",
            "64": "./chatbubble-outline-64.png"
        },
        //badge: tab.channel + ": 0",
        badgeColor: "#292222",
        onClick: function (state) {
            tab.activate();
            tab.unread = 0;
            resetBadge(tab);
        }
    });
    return button;
}

pageMod.PageMod({
    include: "https://hack.chat/*",
    contentScriptWhen: 'ready',
    contentScriptFile: self.data.url('inject.js'),
    contentScriptOptions: {
        scriptUrl: data
    }
});

tabs.on("activate", function (tab) {
    if (tab.button) {
        tab.unread = 0;
        resetBadge(tab);
    }
});

tabs.on("close", function (tab) {
    if (tab.button) {
        clearInterval(tab.interval);
        tab.button.destroy();
    }
});

tabs.on("load", function (tab) {
    if (tab.url.split("hack.chat/").length > 1) {
        tab.channel = tab.url.split("?")[1];
        tab.unread = 0;
        resetBadge(tab);
        tab.button = createButton(tab);
        tab.interval = setInterval(function () {
            tab.badge.push(tab.badge.shift());
            tab.button.badge = tab.badge[0];
        }, 800);
        var worker = tab.attach({
            contentScript: 'document.addEventListener("notify", function (event) {self.port.emit("notify");});'
        });
        worker.port.on("notify", function () {
            tab.unread += 1;
            resetBadge(tab);
        });
    }

});

function resetBadge(tab) {
    tab.badge = tab.channel.match(/.{1,4}/g);
    tab.badge.push(tab.unread);
}
