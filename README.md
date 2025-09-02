Museko is a music analysis tool. 

- Genre classification with Essentia (discogs EffNet CNN, genre_discogs400)
- yt-dlp GUI to download YouTube mp3s
- Real-time audio visualization with audioMotion-analyzer 
- Additional song details with librosa and essentia

![Early website UI](demo/demo_2.png)


## Usage
Unfortunately, this tool requires too much memory to be hosted online using free services.
The only way to try out this app would be running it locally. There is a basic tkinter window that is quick and easy to use (museko.py), or the app can be run on a browser with flask.

![OOMkilled](demo/OOMkilled.png)

## Instructions

Note: essentia-tensorflow is not supported for Windows.

1. Clone and navigate to the repository:
```bash
git clone https://github.com/bmai1/Museko.git
cd Museko
```
2. Install Python dependencies. It is recommended to use a virtual environment:
```bash
python -m venv env
. env/bin/activate
```
```bash
pip install -r requirements.txt
```
3. Navigate to the inner museko folder and run:
```
cd museko
flask run
```
4. Flask development server defaults to http://127.0.0.1:5000, which you can open in a web browser

5. Upload your mp3 files and wait for the genre classification model to analyze it, after which it will display the genre graph and audio visualizer

5. ```Ctrl-C``` to close the server when you are done

## Alternatively
You can also just use the tkinter app located in the inner museko folder, which is very simple and relatively faster.

``cd Museko/museko && python3 museko.py``

<img width="695" height="638" alt="tkinter" src="https://github.com/user-attachments/assets/5f707fcd-57b5-4d07-aa00-289712e75b4b" />

