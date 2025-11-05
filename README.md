## What is Museko?

*(Currently not supported for Windows as Essentia, the audio classification library used in this project, only has Python bindings for macOS)*

Museko is a music analysis and discovery tool.

Some features include:

- Music style classification with Essentia from the Discogs taxonomy ([genre_discogs400](https://essentia.upf.edu/models.html))
- yt-dlp GUI to download mp3s from [supported sites](https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md)
- Real-time audio visualization with [audioMotion-analyzer](https://audiomotion.dev/#/)
- Discogs release roulette drawing from around [18,000,000 entries](https://www.discogs.com/search/?type=release)

Here is the Flask web app view:

![Early website UI](demo/demo_2.png)


## Usage
This tool requires too much memory to be hosted online using free services.
The only way to try out this app would be to run it locally.

![OOMkilled](demo/OOMkilled.png)

## Instructions

1. Download `museko.zip` in [Releases](https://github.com/bmai1/museko/releases) and unzip.
3. Install Python dependencies. `essentia-tensorflow` may require `tensorflow` to be installed. It is recommended to use a virtual environment:
```bash
cd path/to/museko
python3 -m venv env
. env/bin/activate
```
```bash
pip3 install -r requirements.txt
```
3. Run Flask development server, which defaults to http://127.0.0.1:5000 and can be viewed in a web browser.
```
flask run
```

4. Upload mp3 files that you wish to analyze. After a few seconds, it will display the genre prediction graph and audio visualizer.

5. ```Ctrl-C``` in the command line to close the server when you are done.

## Alternatively
There is a tkinter GUI located in `apps/web/` on the GitHub repository. Simply download `apps/web/museko.py`, install the required python dependencies, and run `python3 museko.py`.



<img width="695" height="638" alt="tkinter" src="https://github.com/user-attachments/assets/5f707fcd-57b5-4d07-aa00-289712e75b4b" />

## Currently in development

A desktop app with Tauri + Vite + React with the same features as the web version but better styling.

The goal is to make it work on Windows with manual audio preprocessing to create valid input tensors for Essentia without calling `MonoLoader`, `TensorflowPredictEffnetDiscogs`, and `TensorflowPredict2D` from `essentia.standard` (macOS only). More details can be found in `apps/desktop/src-tauri/src/classify/classifier-windows.py`

