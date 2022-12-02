const rootcss = document.documentElement.style
const editordiv = document.getElementById('editor')

var editor = ace.edit("editor")
var langTools = ace.require("ace/ext/language_tools")

editor.session.setMode("ace/mode/javascript")
editor.setOptions({
    cursorStyle: "smooth",
    showPrintMargin: false,
    theme: "ace/theme/pastel_on_dark"
})

var resizeTimer = null
var opacity = 0.7

window.onload = () => {

    editor.resize()

    editorbg = getComputedStyle(editordiv).getPropertyValue('background-color')
    
    if (tinycolor(editorbg).isLight()) {
        rootcss.setProperty('--main-fg', '#202020')
        rootcss.setProperty('--newtab-stroke', '#202020aa')
    } else {
        rootcss.setProperty('--main-fg', '#dfdfdf')
        rootcss.setProperty('--newtab-stroke', '#dfdfdfaa')
    }
    rootcss.setProperty('--editor-bg', editorbg)
    rootcss.setProperty('--bg-darken', tinycolor.mix(editorbg, '#000000', amount = 30).setAlpha(opacity))
    rootcss.setProperty('--bg-lighten', tinycolor.mix(editorbg, '#ffffff', amount = 5).setAlpha(opacity))

}

window.onresize = () => {
    if(resizeTimer != null) window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function() {
        editor.resize()
    }, 200);
}

settingsbtn.onclick = () => {
    console.log("hello");
}

var mainsession = editor.session
var newtab = document.querySelector("#newtab")
var tabbar = document.querySelector("#tabbar")
