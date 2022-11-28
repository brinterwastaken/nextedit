// const { invoke } = window.__TAURI__.tauri;
const { appWindow } = window.__TAURI__.window;
const { open, save } = window.__TAURI__.dialog;
const { readTextFile, writeTextFile } = window.__TAURI__.fs;
const os = window.__TAURI__.os;
const path = window.__TAURI__.path;

document.getElementById('openbtn').addEventListener('click', () => openfile())
document.getElementById('savebtn').addEventListener('click', () => savefile())

if (await os.platform() == "win32" || await os.platform() == "linux") {
  document.getElementById('win-buttons').style.display = "flex"
  document.getElementById('win-minimize').addEventListener('click', () => appWindow.minimize())
  document.getElementById('win-maximize').addEventListener('click', () => appWindow.toggleMaximize())
  document.getElementById('win-close').addEventListener('click', () => appWindow.close())
} else if (await os.platform() == "darwin") {
  document.getElementById("title").style.opacity = 0
  document.getElementById('mac-buttons').style.display = "flex"
  document.getElementById('mac-minimize').addEventListener('click', () => appWindow.minimize())
  document.getElementById('mac-maximize').addEventListener('click', () => appWindow.toggleMaximize())
  document.getElementById('mac-close').addEventListener('click', () => appWindow.close())
}

const filetypes = [
  {
    name: 'JavaScript',
    extensions: ['js'],
  },
  {
    name: 'Hyper Text Markup Language',
    extensions: ['html'],
  },
  {
    name: 'Cascading Style Sheet',
    extensions: ['css'],
  },
  {
    name: 'C Source File',
    extensions: ['c'],
  },
  {
    name: 'C++ Source File',
    extensions: ['cpp'],
  },
  {
    name: 'Java Source File',
    extensions: ['java'],
  },
  {
    name: 'All Files',
    extensions: ['*'],
  }
]

async function openfile() {
  var selected = await open({
    filters: filetypes
  })
  var contents = await readTextFile(selected)
  var currenttab = document.getElementById('currenttab')
  editor.session.setValue(contents)
  currenttab.innerText = await path.basename(selected)
}

async function savefile() {
  var filepath = await save({
    filters: filetypes
  })
  await writeTextFile(filepath, editor.session.getValue())
}