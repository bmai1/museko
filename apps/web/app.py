import os
import tempfile
import yt_dlp

from flask import (
    Flask, render_template, request,
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