Museko is a music analysis tool. 

- Genre classification with Essentia TensorFlow models (discogs EffNet CNN, genre_discogs400)
- YouTube mp3 downloader (Python: yt-dlp, Flask)
- Real-time audio visualizer (JavaScript: audioMotion-analyzer)
- BPM and additional song details (Python: librosa, essentia)

![Early website UI](demo/demo_2.png)


## Usage
Unfortunately, this tool requires too much memory to be hosted online using free services such as Render.
The only way to try out this app would be running it locally.

![OOMkilled](demo/OOMkilled.png)

## Instructions

1. Clone the repository: ```git clone https://github.com/bmai1/Museko.git```

2. Navigate to the folder and install Python dependencies: ```cd path/to/Museko && pip3 install -r requirements.txt```

3. Navigate to the inner museko folder: ```cd museko``` and either ```flask run``` or run ```python3 app.py```

4. Flask development server (flask run) defaults to: http://127.0.0.1:5000, waitress runs port 8080: http://localhost:8080/

5. Ctrl-C to close server when you are done
  

