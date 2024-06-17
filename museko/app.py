import os
import sys
import tempfile
from flask import Flask, render_template, request, send_from_directory, send_file, url_for, jsonify
from werkzeug.utils import secure_filename
from essentia_model.genre_discogs400 import classify

app = Flask(__name__)

# Create a temp directory for mp3 uploads
temp_dir = tempfile.TemporaryDirectory()
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.config['UPLOAD_FOLDER'] = temp_dir.name
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100 MB max file size
app.config['JSON_AS_ASCII'] = False  # Ensure Flask JSON responses are UTF-8 to display other languages

@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    filename = file.filename
    if filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and filename.lower().endswith('.mp3'):

        # secure_filename removes special characters that could potentially be malicious, but then foreign song titles can't be displayed

        original_fn = filename
        filename = secure_filename(filename) 

        # print(original_fn, file=sys.stderr)
        # print(filename, file=sys.stderr)

        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        file_url = url_for('uploaded_file', filename=filename)
        image_url = url_for('process_file', filename=filename)
        return jsonify({'filename': original_fn, 'file_url': file_url, 'image_url': image_url}), 200
    else:
        return jsonify({'error': 'Invalid file format. Only .mp3 files are allowed.'}), 400

@app.route('/process/<filename>')
def process_file(filename):
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    
    if not os.path.exists(file_path):
        return 'File not found', 404
    
    try:
        buffer = classify(file_path)
        return send_file(buffer, mimetype='image/png')
    except Exception as e:
        return f'Error processing file: {str(e)}', 500

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
