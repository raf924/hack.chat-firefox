var url = self.options.scriptUrl;
var head = document.getElementsByTagName("head")[0];
var script = document.createElement("script");
script.type = "text/javascript";
script.src = url;
head.appendChild(script);
