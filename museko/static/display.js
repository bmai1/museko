import { initAudioVisualizer } from "./audioVisualizer.js";

// Welcome div fadein and fadeout
document.addEventListener("DOMContentLoaded", function () {
    const welcomeDiv     = document.getElementById('welcomeDiv'),
          overlay        = document.getElementById('overlay'),
          startButton    = document.getElementById('startButton'),
          downloadForm   = document.getElementById('mp3_download'),
          downloadStatus = document.getElementById('download_status'),
          uploadForm     = document.getElementById('mp3_upload');

    setTimeout(() => {
        welcomeDiv.style.opacity = 1;
    }, 100);

    startButton.addEventListener('click', function () {
        welcomeDiv.style.opacity = 0;
        overlay.style.opacity = 0;

        setTimeout(() => {
            welcomeDiv.style.display = 'none';
            overlay.style.display = 'none';
        }, 500);
    });

    // Download mp3 files from YouTube with yt-dl
    downloadForm.addEventListener('submit', function(event) {
        event.preventDefault();

        let formData = new FormData(downloadForm);
        const url = formData.get('url');
        
        if (!url) {
            downloadStatus.innerText = "Please enter a URL.";
            return;
        }

        fetch('/download', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }

            const filePath = data.file_path;
            const fileName = data.file_name;
            downloadFile(filePath, fileName);
            downloadStatus.innerText = `Downloaded "${fileName}" successfully!`;
        })
        .catch(error => {
            downloadStatus.innerText = `Download failed: ${error.message}`;
        });
    });
    
    function downloadFile(filePath, fileName) {
        const downloadUrl = `/get-file?file_path=${encodeURIComponent(filePath)}&file_name=${encodeURIComponent(fileName)}`;
    
        fetch(downloadUrl)
            .then(response => response.blob())
            .then(blob => {
                // create temp url to download
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch(error => console.error('Error:', error));
    }

    // Upload mp3 files and display analysis results with AJAX
    uploadForm.addEventListener('submit', function(event) {
        event.preventDefault();
    
        let formData = new FormData();
        const fileInput = document.getElementById('fileInput');
        formData.append('file', fileInput.files[0]);
    
        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            const fileTitle = document.getElementById('file-title');
            const visualizerContainer = document.getElementById('visualizer-container');
            const matplotlibFig = document.getElementById('matplotlib-fig')
            if (data.error) {
                fileTitle.innerHTML = `<p style="color: red;">${data.error}</p>`;
            } 
            else {
                // console.log(filename);
                fileTitle.innerText = `Analyzed File: ${data.filename}`;
                visualizerContainer.innerHTML = `
                    <div id="motion-container"></div>
                    <div id="audio-container"></div>
                `;
                matplotlibFig.src = data.image_url;

                    
                // render visualizer
                initAudioVisualizer(data.file_url);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});




