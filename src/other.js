document.getElementById('title').innerText = "NextEdit"

var editor = ace.edit("editor")
var langTools = ace.require("ace/ext/language_tools")
editor.session.setMode("ace/mode/javascript")
editor.setOptions({
    cursorStyle: "smooth",
    showPrintMargin: false,
    theme: "ace/theme/one_dark"
})

var resizeTimer = null

window.addEventListener('resize', () => {
    if(resizeTimer != null) window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function() {
        editor.resize()
    }, 200);
})

var mainsession = editor.session
var newtab = document.querySelector("#newtab")
var tabbar = document.querySelector("#tabbar")