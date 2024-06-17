import os
import tempfile
from flask import Flask, redirect, render_template, request, url_for, send_from_directory, send_file
from werkzeug.utils import secure_filename
from essentia_model.genre_discogs400 import classify

app = Flask(__name__)

# Create a temp directory for mp3 uploads
temp_dir = tempfile.TemporaryDirectory()
app.config['UPLOAD_FOLDER'] = temp_dir.name
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100 MB max file size

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        if 'file' not in request.files:
            return 'No file part', 400

        file = request.files['file']
        if file.filename == '':
            return 'No selected file', 400

        if file and file.filename.lower().endswith('.mp3'):
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            return redirect(url_for('process_file', filename=filename))
        else:
            return 'Invalid file format. Only .mp3 files are allowed.', 400

    return render_template('index.html')

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
