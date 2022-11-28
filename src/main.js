// const { invoke } = window.__TAURI__.tauri;
const { appWindow } = window.__TAURI__.window;
const { open, save } = window.__TAURI__.dialog;
const { readTextFile, writeTextFile } = window.__TAURI__.fs;
const path = window.__TAURI__.path;

document
  .getElementById('titlebar-minimize')
  .addEventListener('click', () => appWindow.minimize())
document
  .getElementById('titlebar-maximize')
  .addEventListener('click', () => appWindow.toggleMaximize())
document
  .getElementById('titlebar-close')
  .addEventListener('click', () => appWindow.close())

document.getElementById('openbtn').addEventListener('click', () => openfile())
document.getElementById('savebtn').addEventListener('click', () => savefile())

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