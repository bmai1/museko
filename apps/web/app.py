import discogs_client
import os
import random
import tempfile
import yt_dlp

from flask import (
    Flask, redirect, render_template, request,
    send_from_directory, send_file,
    url_for, jsonify
)

from essentia_model.genre_discogs400 import classify
from essentia_model.extract import extract_features

app = Flask(__name__)

temp_dir = tempfile.TemporaryDirectory()
app.config['UPLOAD_FOLDER'] = temp_dir.name
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.config['JSON_AS_ASCII'] = False
d = discogs_client.Client('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/convert', methods=['POST'])
def convert_mp3():
    """
    Route for getting an mp3 file from a URL with yt-dlp.
    Saves file to UPLOAD_FOLDER and sends an attachment to Downloads.
    """

    url = request.form.get('url')
    if not url:
        return jsonify({'error': 'No URL provided'}), 400

    if '&list=' in url:
        url = url.split('&list=')[0]

    try:
        ydl_opts = {
            'format': 'bestaudio/best',
            'outtmpl': os.path.join(app.config['UPLOAD_FOLDER'], '%(title)s.%(ext)s'),
            'quiet': True,
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            result = ydl.extract_info(url, download=True)
            base = ydl.prepare_filename(result)
            file_path = os.path.splitext(base)[0] + '.mp3'

        return jsonify({
            'file_name': os.path.basename(file_path),
            'file_path': file_path
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/download', methods=['GET'])
def download_file():
    """
    Route to download a file.
    The file is sent as an attachment to Downloads.
    This method is separately called from convert and does not affect UPLOAD_FOLDER.
    """
    file_path = request.args.get('file_path')
    file_name = request.args.get('file_name')

    if not file_path or not os.path.exists(file_path):
        return 'File not found', 404

    return send_file(file_path, as_attachment=True, download_name=file_name)


@app.route('/upload', methods=['POST'])
def upload_file():
    """
    Route to upload an mp3 file for classification with the genre model.
    Saves local mp3 files to UPLOAD_FOLDER.
    Returns the predicted genre plot and extracted audio features.
    """
    if 'file' not in request.files:
        return jsonify({'error': 'No file selected'}), 400

    file = request.files['file']
    file_name = file.filename

    if not file_name:
        return jsonify({'error': 'Empty filename'}), 400

    if not file_name.lower().endswith('.mp3'):
        return jsonify({'error': 'Only .mp3 files allowed'}), 400

    file_path = os.path.join(app.config['UPLOAD_FOLDER'], file_name)
    file.save(file_path)

    return jsonify({
        'file_name': file_name,
        'file_url': url_for('serve_file', file_name=file_name),
        'image_url': url_for('process_file', file_name=file_name),
        'features': extract_features(file_path)
    })


@app.route('/uploads/<file_name>', methods=['GET'])
def serve_file(file_name):
    """
    Route to serve a file from UPLOAD_FOLDER given its file name.
    """
    return send_from_directory(app.config['UPLOAD_FOLDER'], file_name)

def generate_track_id(query=""):
    """
    Generates valid Discogs release IDs.
    """
    for _ in range(1000):
        track_id = random.randint(1, 36000000)
        try:
            release = d.release(track_id) # A lazy reference won't raise a 404 error here, so fields from this release must be accessed.
            if query and query.lower() not in [g.lower() for g in release.genres]:
                continue
            if len(release.tracklist) < 15:
                return track_id
        except discogs_client.exceptions.HTTPError as e:
            print(f"Track ID {track_id} failed with HTTPError: {e}")
            continue
        
@app.route('/roll', methods=['POST'])
def roll():
    query = request.form.get("query", "")
    release_id = generate_track_id(query)
    return redirect(url_for('show_release', release_id=release_id))

@app.route('/<int:release_id>')
def show_release(release_id):
    release = d.release(release_id)
    artist_names = ", ".join(artist.name for artist in release.artists)

    if release.images:
        image_url = release.images[0]["uri"]
    else:
        image_url = "static/unavailable.png"

    return render_template(
        'index.html',
        release=release,
        release_id=release_id,
        artist_names=artist_names,
        image_url=image_url
    )

@app.route('/prediction/<file_name>', methods=['GET'])
def process_file(file_name):
    """
    Route for genre prediction plots.
    Classifies the audio file with genre_discogs400.py. 
    """
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], file_name)

    if not os.path.exists(file_path):
        return 'File not found', 404

    try:
        buffer = classify(file_path)
        return send_file(buffer, mimetype='image/png')
    except Exception as e:
        return f'Error processing file: {str(e)}', 500