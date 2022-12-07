document.getElementById('title').innerText = document.title

const { appWindow } = window.__TAURI__.window;
const { open, save } = window.__TAURI__.dialog;
const { readTextFile, writeTextFile } = window.__TAURI__.fs;
const { emit, listen } = window.__TAURI__.event;
const shell = window.__TAURI__.shell;

const os = window.__TAURI__.os;
const path = window.__TAURI__.path;
var platform = await os.platform()

if (platform == "win32" || platform == "linux") {
  document.getElementById('win-buttons').style.display = "flex"
  document.getElementById('win-minimize').onclick = () => appWindow.minimize()
  document.getElementById('win-maximize').onclick = () => appWindow.toggleMaximize()
  document.getElementById('win-close').onclick = () => appWindow.close()
} else if (platform == "darwin") {
  document.getElementById("title").style.opacity = 0
  document.getElementById('mac-buttons').style.display = "flex"
  document.getElementById('mac-minimize').onclick = () => appWindow.minimize()
  document.getElementById('mac-maximize').onclick = () => appWindow.toggleMaximize()
  document.getElementById('mac-close').onclick = () => appWindow.close()
}

document.getElementById('exitbtn').onclick = () => appWindow.close()
document.getElementById('cfgopen').onclick = async () => shell.open(await path.appConfigDir())

const themeselector = document.getElementById('themeselector')
themeselector.onchange = async () => {
  await emit('settheme', {theme: themeselector.value.toString()})
}
const opacityslider = document.getElementById('opacityslider')
opacityslider.onchange = async () => {
  var opacity = opacityslider.value * 5/100
  await emit('setopacity', {opacity: opacity})
}

document.getElementById('visuals-category').onclick = () => document.getElementById('appearance').scrollIntoView({behavior:"smooth"});
document.getElementById('editor-category').onclick = () => document.getElementById('editor').scrollIntoView({behavior:"smooth"});
