Museko is a music analysis tool. 

- Genre classification with Essentia TensorFlow models (discogs EffNet CNN, genre_discogs400)
- YouTube mp3 downloader (Python: yt-dlp, Flask)
- Real-time audio visualizer (JavaScript: audioMotion-analyzer)
- BPM and additional song details (Python: librosa, essentia)

![Early website UI](demo/demo_2.png)


## Usage
Unfortunately, this tool requires too much memory to be hosted online using free services.
The only way to try out this app would be running it locally.

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
