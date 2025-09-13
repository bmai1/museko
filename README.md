Museko is a music analysis tool that I'm making multiple versions of for some reason (I suck at developing stuff).
Some features include:

- Genre classification with Essentia (discogs EffNet CNN, genre_discogs400)
- yt-dlp GUI to download YouTube mp3s
- Real-time audio visualization with audioMotion-analyzer 
- Additional song details with librosa and essentia

Here is the Flask web app view:

![Early website UI](demo/demo_2.png)


## Usage
Unfortunately, this tool requires too much memory to be hosted online using free services.
The only way to try out this app would be running it locally. There is a basic tkinter window that is quick and easy to use (museko.py), or the app can be run on a browser with flask.

![OOMkilled](demo/OOMkilled.png)

## Instructions

Note: essentia-tensorflow is not supported for Windows.

1. Install the Flask app (museko.zip) in Releases.
2. Install Python dependencies. It is recommended to use a virtual environment:
```bash
cd path/to/museko
python -m venv env
. env/bin/activate
```
```bash
pip install -r requirements.txt
```
3. Run Flask development server, which defaults to http://127.0.0.1:5000 and can be viewed in a web browser.
```
flask run
```

4. Upload mp3 files for the genre classification models to analyze. It will then display the genre prediction graph and audio visualizer.

5. ```Ctrl-C``` to close the server when you are done

## Alternatively
There is a tkinter GUI (museko.py) located in the inner museko folder on the GitHub repository. It is simpler and faster to use.

``python3 museko.py``

<img width="695" height="638" alt="tkinter" src="https://github.com/user-attachments/assets/5f707fcd-57b5-4d07-aa00-289712e75b4b" />

