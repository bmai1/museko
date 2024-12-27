import os
import sys
import tempfile
import yt_dlp

from flask import Flask, render_template, request, send_from_directory, send_file, url_for, jsonify
from essentia_model.genre_discogs400 import classify
from essentia_model.extract import extract_features

app = Flask(__name__)

temp_dir = tempfile.TemporaryDirectory()
app.config['UPLOAD_FOLDER'] = temp_dir.name
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.config['JSON_AS_ASCII'] = False  # UTF-8 JSON responses to display other languages

@app.route('/')
def index():
    """
    Route for home page.
    """
    return render_template('index.html')

@app.route('/convert', methods=['POST'])
def convert_mp3():
    """
    Route for converting an mp3 with yt-dlp.
    Supports YouTube, SoundCloud, and more: https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md
    Saves a file to UPLOAD_FOLDER and also sends an attachment to Downloads.
    """
    url = request.form['url']

    # Prevent downloading a whole playlist
    if '&list=' in url:
        url = url.split('&list=')[0]

    try:
        ydl_opts = {
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
            'outtmpl': os.path.join(temp_dir.name, '%(title)s.%(ext)s'), # Store a copy in UPLOAD_FOLDER
            'quiet': True, 
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            result = ydl.extract_info(url, download=True)
            file_name = ydl.prepare_filename(result)
            file_path = file_name.rsplit('.', 1)[0] + '.mp3'
        
        return jsonify({
            'file_path': file_path,
            'file_name': os.path.basename(file_path)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/download')
def download_file():
    """
    Route to download a file.
    The file is sent as an attachment to Downloads.
    This method is separately called from convert and does not affect UPLOAD_FOLDER.
    """
    file_path = request.args.get('file_path')
    file_name = request.args.get('file_name')
    
    if not os.path.exists(file_path):
        return 'File not found', 404
    
    return send_file(file_path, as_attachment=True, download_name=file_name)

@app.route('/upload', methods=['POST'])
def upload_file():
    """
    Route to upload an mp3 file for analysis.
    Saves local mp3 files to UPLOAD_FOLDER.
    Returns the predicted genre plot and extracted audio features.
    """
    if 'file' not in request.files:
        return jsonify({'error': 'No file selected'}), 400

    file = request.files['file']
    file_name = file.filename # The attribute of the request is 'filename', not 'file_name'

    if file and file_name.lower().endswith('.mp3'):
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file_name)
        file.save(file_path)
        file_url = url_for('serve_file', file_name=file_name)
        image_url = url_for('process_file', file_name=file_name)

        return jsonify({'file_name': file_name, 'file_url': file_url, 'image_url': image_url, 'features': extract_features(file_path)}), 200
    else:
        return jsonify({'error': 'Invalid file format. Only .mp3 files are allowed.'}), 400

@app.route('/uploads/<file_name>')
def serve_file(file_name):
    """
    Route to serve a file from UPLOAD_FOLDER given its file name.
    """
    try: 
        return send_from_directory(app.config['UPLOAD_FOLDER'], file_name)
    except Exception as e:
        return f'Error processing file: {str(e)}', 500

@app.route('/prediction/<file_name>')
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