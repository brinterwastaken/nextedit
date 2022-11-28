document.getElementById('title').innerText = "NextEdit"

const rootcss = document.documentElement.style
var editor = ace.edit("editor")
var editordiv = document.getElementById('editor')
var langTools = ace.require("ace/ext/language_tools")
editor.session.setMode("ace/mode/javascript")
editor.setOptions({
    cursorStyle: "smooth",
    showPrintMargin: false,
    theme: "ace/theme/nord_dark"
})

var resizeTimer = null
var opacity = 0.8

window.onload = () => {
    editorbg = getComputedStyle(editordiv).getPropertyValue('background-color')
    
    if (tinycolor(editorbg).isLight()) {
        rootcss.setProperty('--main-fg', '#202020')
        rootcss.setProperty('--newtab-stroke', '#202020aa')
    } else {
        rootcss.setProperty('--main-fg', '#dfdfdf')
        rootcss.setProperty('--newtab-stroke', '#dfdfdfaa')
    }
    rootcss.setProperty('--editor-bg', editorbg)
    rootcss.setProperty('--bg-other', tinycolor.mix(editorbg, '#000000', amount = 15).setAlpha(opacity))
}

window.addEventListener('resize', () => {
    if(resizeTimer != null) window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function() {
        editor.resize()
    }, 200);
})

var mainsession = editor.session
var newtab = document.querySelector("#newtab")
var tabbar = document.querySelector("#tabbar")
