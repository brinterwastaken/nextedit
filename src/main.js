// const { invoke } = window.__TAURI__.tauri;
const { appWindow } = window.__TAURI__.window;
const { open, save } = window.__TAURI__.dialog;
const { readTextFile, writeTextFile } = window.__TAURI__.fs;
const os = window.__TAURI__.os;
const path = window.__TAURI__.path;

document.getElementById('openbtn').addEventListener('click', () => openfile())
document.getElementById('savebtn').addEventListener('click', () => savefile())
document.getElementById('savebtn').addEventListener('contextmenu', (ev) => {ev.preventDefault(); saveas()})


if (await os.platform() === "win32" || "linux") {
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
    name: 'All Files',
    extensions: [''],
  },
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
  }
]

document.addEventListener("keydown", (e) => keypressed(e));

function keypressed (e){
  const {key, metaKey, ctrlKey} = e; 
  if(key === "s" && (ctrlKey || metaKey)){
    console.log("save pressed")
    console.log(e)
  }
}

var filepath

async function openfile() {
  var selected = await open({filters: filetypes})
  var contents = await readTextFile(selected)
  var currenttab = document.getElementById('currenttab')
  editor.session.setValue(contents)
  currenttab.innerText = await path.basename(selected)
  filepath = selected
}

async function savefile() {
  if (!filepath) {
    filepath = await save({filters: filetypes})
  } 
  await writeTextFile(filepath, editor.session.getValue())
  var currenttab = document.getElementById('currenttab')
  currenttab.innerText = await path.basename(filepath)
  console.log(await path.basename(filepath))
}

async function saveas() {
  filepath = await save({filters: filetypes})
  await writeTextFile(filepath, editor.session.getValue())
  var currenttab = document.getElementById('currenttab')
  currenttab.innerText = await path.basename(filepath)
}