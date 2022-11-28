#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

use window_vibrancy::*;
use window_shadows::*;
use tauri::Manager;

fn main() {
    tauri::Builder::default().setup(|app| {
        let window = app.get_window("main").unwrap();

        set_shadow(&window, true).expect("Unsupported platform!");

        #[cfg(target_os = "macos")]
        apply_vibrancy(&window, NSVisualEffectMaterial::FullScreenUI, None, None).expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");
  
        #[cfg(target_os = "windows")]
        apply_acrylic(&window, Some((0,0,0,0))).expect("Unsupported platform! 'apply_blur' is only supported on Windows");

        Ok(())
    })
    .invoke_handler(tauri::generate_handler![greet])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
