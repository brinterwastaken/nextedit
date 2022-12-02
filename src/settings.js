document.getElementById('title').innerText = document.title

const { appWindow } = window.__TAURI__.window;
const { open, save } = window.__TAURI__.dialog;
const { readTextFile, writeTextFile } = window.__TAURI__.fs;
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