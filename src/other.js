const rootcss = document.documentElement.style
const editordiv = document.getElementById('editor')

var editor = ace.edit("editor")
var langTools = ace.require("ace/ext/language_tools")

editor.setOptions({
    cursorStyle: "smooth",
    showPrintMargin: false,
})

var resizeTimer = null

window.onload = () => {

    editor.resize()
    setTimeout(() => {updateTheme()}, 100)

}

async function updateTheme(opacity) {

    editorbg = getComputedStyle(editordiv).getPropertyValue('background-color')
    highlight = getComputedStyle(document.querySelector(".ace_active-line")).getPropertyValue('background-color')

    if (tinycolor(editorbg).isLight()) {
        await rootcss.setProperty('--main-fg', '#202020')
        await rootcss.setProperty('--newtab-stroke', '#202020aa')
    } else {
        await rootcss.setProperty('--main-fg', '#dfdfdf')
        await rootcss.setProperty('--newtab-stroke', '#dfdfdfaa')
    }

    await rootcss.setProperty('--editor-bg', editorbg)
    await rootcss.setProperty('--bg-darken', tinycolor.mix(editorbg, '#000000', amount = 30).setAlpha(opacity))
    await rootcss.setProperty('--bg-lighten', tinycolor.mix(editorbg, '#ffffff', amount = 5).setAlpha(opacity))
    await rootcss.setProperty('--sidebar-bg', tinycolor(editorbg, '#ffffff', amount = 5).setAlpha(opacity))
    await rootcss.setProperty('--highlight', highlight)

}

window.onresize = () => {
    if(resizeTimer != null) window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function() {
        editor.resize()
    }, 200);
}

var mainsession = editor.session
var newtab = document.querySelector("#newtab")
var tabbar = document.querySelector("#tabbar")
