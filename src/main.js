document.getElementById('title').innerText = document.title

const { invoke } = window.__TAURI__.tauri;
const { appWindow, WebviewWindow } = window.__TAURI__.window;
const { open, save } = window.__TAURI__.dialog;
const { readTextFile, writeTextFile, exists, BaseDirectory, createDir, readDir } = window.__TAURI__.fs;
const { emit, listen } = window.__TAURI__.event;
const os = window.__TAURI__.os;
const path = window.__TAURI__.path;
const settingsbtn = document.getElementById('settingsbtn')
var configDir, config, configjson

const defaultconfig = {
  appearance: {
    theme: "dracula",
    opacity: 0.85
  }
}

async function getConfig() {
  configDir = await path.appConfigDir()
  console.log("Reading config file: " + configDir + "config.json")
  if (await exists(configDir) && await exists(configDir + "config.json")) {
    config = JSON.parse(await readTextFile(configDir + "config.json"))
  } else {
    config = defaultconfig
    if (!(await exists(configDir))) {
      await createDir(configDir)
    }
    await writeTextFile(configDir + "config.json", JSON.stringify(config,null,2))
  }
  return config
}

async function updateConfig() {
  configDir = await path.appConfigDir()
  console.log("Writing config file: " + configDir + "config.json")
  await writeTextFile(configDir + "config.json", JSON.stringify(config,null,2))
}

getConfig().then((conf) => {
  console.log(conf.appearance.opacity)
  editor.setTheme("ace/theme/"+conf.appearance.theme)
  setTimeout(() => {updateTheme(conf.appearance.opacity)}, 100)
})

listen("settheme", ({ event, payload }) => { 
  editor.setTheme("ace/theme/"+payload.theme)
  setTimeout(() => {updateTheme(config.appearance.opacity)}, 100)
  config.appearance.theme = payload.theme
  updateConfig()
});

listen("setopacity", ({ event, payload }) => { 
  config.appearance.opacity = payload.opacity
  setTimeout(() => {updateTheme(config.appearance.opacity)}, 100)
  updateConfig()
});

var platform = await os.platform()
var allext
if (platform == "win32" || platform == "linux") {
  document.getElementById('win-buttons').style.display = "flex"
  document.getElementById('win-minimize').onclick = () => appWindow.minimize()
  document.getElementById('win-maximize').onclick = () => appWindow.toggleMaximize()
  document.getElementById('win-close').onclick = () => appWindow.close()
  allext = '*'
} else if (platform == "darwin") {
  document.getElementById("title").style.opacity = 0
  document.getElementById('mac-buttons').style.display = "flex"
  document.getElementById('mac-minimize').onclick = () => appWindow.minimize()
  document.getElementById('mac-maximize').onclick = () => appWindow.toggleMaximize()
  document.getElementById('mac-close').onclick = () => appWindow.close()
  allext = ''
}

const filetypes = [
  {
    name: 'All Files',
    extensions: [allext],
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

document.addEventListener("keyup", (e) => {
  const {key, metaKey, ctrlKey, shiftKey} = e; 
  var modKey;
  if (platform == "win32" || platform == "linux") {
    modKey = ctrlKey
  } else if (platform == "darwin") {
    modKey = metaKey
  }
  if(key === "s"  && !shiftKey && modKey) {
    savefile()
  }
  if(key === "s" && shiftKey && modKey) {
    saveas()
  }
  if(key === "o" && !shiftKey && modKey) {
    openfile()
  }
  if(key === "o" && shiftKey && modKey) {
    opendir()
  }
  if(key === ","  && !shiftKey && modKey) {
    opensettings()
  }
});

var filepath

function toggledropdown(dropdownID = "") {
  var dropdown = document.getElementById(dropdownID)
  if (getComputedStyle(dropdown).display.toString() === "none") {
    document.querySelectorAll(".dropdown").forEach((elmt) => { elmt.style.display = "none"})
    dropdown.style.display = "flex"
    document.onkeydown = (key) => {
      if (key.key == "Escape") { dropdown.style.display = "none"; document.onkeydown = null }
    }
  } else if (getComputedStyle(dropdown).display == "flex") {
    dropdown.style.display = "none"
    document.onkeydown = null
  }
}

async function openfile() {
  var selected = await open({filters: filetypes})
  var contents = await readTextFile(selected)
  var currenttab = document.getElementById('currenttab')
  editor.session.setValue(contents)
  var fileExt 
  try {
    fileExt = await path.extname(selected)
  } catch(err){
    fileExt = "txt"
    console.warn(err)
  }
  editor.session.setMode("ace/mode/" + (modemap[fileExt] ? modemap[fileExt] : "text"))
  currenttab.innerText = await path.basename(selected)
  currenttab.title = currenttab.innerText
  filepath = selected
  currenttab.classList.remove("unsaved")
}

async function opendir() {
  console.log("WORK IN PROGRESS")
  var selected = await open({directory: true, defaultPath: await path.homeDir()})
  var entries = await readDir(selected)
  entries.forEach((entry) => {
    console.log(entry.name)
  })
}

async function savefile() {
  if (!filepath) {
    filepath = await save({filters: filetypes})
  } 
  await writeTextFile(filepath, editor.session.getValue())
  var currenttab = document.getElementById('currenttab')
  currenttab.innerText = await path.basename(filepath)
  currenttab.title = currenttab.innerText
  currenttab.classList.remove("unsaved")
}

async function saveas() {
  filepath = await save({filters: filetypes})
  await writeTextFile(filepath, editor.session.getValue())
  var currenttab = document.getElementById('currenttab')
  currenttab.innerText = await path.basename(filepath)
  currenttab.title = currenttab.innerText
  currenttab.classList.remove("unsaved")
}

const opensettings = () => {
  const settingswindow = new WebviewWindow('settings', {
    fullscreen: false,
    height: 600,
    resizable: true,
    title: "NextEdit - Settings",
    width: 800,
    transparent: true,
    decorations: false,
    minWidth: 600,
    minHeight: 400,
    url: "settings.html"
  })

  settingswindow.once('tauri://created', () => {
    invoke('settingscreated')
  })
  setTimeout(() => {
    getConfig().then(async (conf) => { await emit("gotConfig", conf) })
  }, 1000);
}

settingsbtn.onclick = opensettings

document.getElementById('filebtn').onclick = () => toggledropdown("filemenu")
document.getElementById('editbtn').onclick = () => toggledropdown("editmenu")

document.getElementById('savebtn').onclick = () => { savefile(); toggledropdown("filemenu"); }
document.getElementById('saveasbtn').onclick = () => { saveas(); toggledropdown("filemenu"); }
document.getElementById('openbtn').onclick = () => { openfile(); toggledropdown("filemenu"); }
document.getElementById('opendir').onclick = () => { opendir(); toggledropdown("filemenu"); }

document.getElementById('undobtn').onclick = () => { editor.undo(); toggledropdown("editmenu"); }
document.getElementById('redobtn').onclick = () => { editor.redo(); toggledropdown("editmenu"); }
document.getElementById('settingsmenubtn').onclick = () => { opensettings(); toggledropdown("editmenu"); }