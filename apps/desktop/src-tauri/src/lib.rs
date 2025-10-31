use std::path::PathBuf;
use tauri::Manager;
use tauri::State;

struct AppDirs {
    audio_dir: PathBuf,
    plot_dir: PathBuf,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .setup(|app| {
            let app_data_dir = app
                .path()
                .app_data_dir()
                .expect("Failed to resolve app data directory");

            let audio_dir = app_data_dir.join("audio");
            if !audio_dir.exists() {
                std::fs::create_dir_all(&audio_dir).expect("Failed to create audio directory");
            }
            let plot_dir = app_data_dir.join("plots");
            if !plot_dir.exists() {
                std::fs::create_dir_all(&plot_dir).expect("Failed to create plot directory");
            }

            app.manage(AppDirs {
                audio_dir,
                plot_dir,
            });

            // MacOS: App Data Directory: "/Users/username/Library/Application Support/com.mai.msko"
            // println!("App Data Directory: {:?}", app_data_dir);

            Ok(())
        })
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![save_file, classify])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
async fn save_file(
    state: State<'_, AppDirs>,
    filename: String,
    bytes: Vec<u8>,
) -> Result<(), String> {
    use std::fs;

    let mut audio_path = state.audio_dir.clone();
    audio_path.push(filename);

    fs::write(&audio_path, &bytes).map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
fn classify(state: State<'_, AppDirs>, filename: String) -> Result<(), String> {
    let audio_path = state.audio_dir.clone().join(&filename);
    let plot_path = state
        .plot_dir
        .join(format!("{}.png", filename.trim_end_matches(".mp3")));

    // Python script path (always relative to src-tauri/src/classify/msko.py)
    let script_path = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("src/classify/classifier.py");

    // println!("Audio path: {:?}", audio_path);
    // println!("Plot path: {:?}", plot_path);
    // println!("Script path: {:?}", script_path);

    // NOTE THIS BYPASSES SHELL CONFIGURATION AND ALIAS
    let python = "/Library/Frameworks/Python.framework/Versions/3.10/bin/python3.10";
    let status = std::process::Command::new(python)
        .arg(&script_path)
        .arg(&audio_path)
        .arg(&plot_path)
        .status()
        .map_err(|e| e.to_string())?;

    if !status.success() {
        return Err("Python classify script failed".into());
    }
    Ok(())
}
