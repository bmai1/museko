#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![save_file, classify])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn save_file(filename: String, bytes: Vec<u8>) -> Result<(), String> {
    use std::fs;
    use std::path::PathBuf;

    // msko/src/assets/audio
    let mut path = PathBuf::from("../src/assets/audio");
    fs::create_dir_all(&path).map_err(|e| e.to_string())?;

    path.push(filename);
    fs::write(&path, &bytes).map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
fn classify(filename: String) -> Result<(), String> {
    use std::path::PathBuf;

    // Base directory: msko/ (parent of src-tauri/)
    let base = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .parent() // go up from src-tauri/
        .unwrap()
        .join("src/assets");

    // path to msko/src/assets/audio relative to python file
    let audio_path = base.join("audio").join(&filename);
    let plot_path = base.join("plots").join(
        format!("{}.png", filename.trim_end_matches(".mp3"))
    );

    // Python script path (always relative to src-tauri/src/classify/msko.py)
    let script_path = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("src/classify/msko.py");

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

