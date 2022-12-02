#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use window_vibrancy::*;
use window_shadows::*;
use tauri::Manager;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
     
#[tauri::command]
fn settingscreated(app_handle: tauri::AppHandle) {
    let cfgwindow = app_handle.get_window("settings").unwrap();
    
    if cfg!(target_os = "macos") {

        apply_vibrancy(&cfgwindow, NSVisualEffectMaterial::HudWindow, Some(NSVisualEffectState::Active), Some(10.0)).expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");
        set_shadow(&cfgwindow, true).expect("Unsupported platform!");

    } else if cfg!(target_os = "windows") {
            
        apply_acrylic(&cfgwindow, Some((0,0,0,0))).expect("Unsupported platform! 'apply_acrylic' is only supported on Windows");
        set_shadow(&cfgwindow, true).expect("Unsupported platform!");

    }
}

fn main() {
    tauri::Builder::default().setup(|app| {
        let mainwindow = app.get_window("main").unwrap();

        if cfg!(target_os = "macos") {

            apply_vibrancy(&mainwindow, NSVisualEffectMaterial::HudWindow, Some(NSVisualEffectState::Active), Some(10.0)).expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");
            set_shadow(&mainwindow, true).expect("Unsupported platform!");

        } else if cfg!(target_os = "windows") {

            apply_acrylic(&mainwindow, Some((0,0,0,0))).expect("Unsupported platform! 'apply_acrylic' is only supported on Windows");
            set_shadow(&mainwindow, true).expect("Unsupported platform!");

        } 

        Ok(())
    })
    .invoke_handler(tauri::generate_handler![settingscreated])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
