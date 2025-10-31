import { initAudioVisualizer } from "./audioVisualizer.js";

// Welcome div fadein and fadeout
document.addEventListener("DOMContentLoaded", function () {
    const welcomeDiv        = document.getElementById('welcomeDiv'),
          overlay           = document.getElementById('overlay'),
          startButton       = document.getElementById('startButton'),
          downloadForm      = document.getElementById('mp3-download'),
          downloadStatus    = document.getElementById('download-status'),
          uploadForm        = document.getElementById('mp3-upload'),
          uploadStatus      = document.getElementById('upload-status'),
          fileInput         = document.getElementById('file-input');

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

        downloadStatus.innerText = "Downloading..."

        fetch('/convert', {
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
        const downloadUrl = `/download?file_path=${encodeURIComponent(filePath)}&file_name=${encodeURIComponent(fileName)}`;
    
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
        formData.append('file', fileInput.files[0]);
    
        uploadStatus.innerText = "Uploading...";

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            const fileTitle           = document.getElementById('file-title'),
                  visualizerContainer = document.getElementById('visualizer-container'),
                  figLoader           = document.getElementById('fig-loader'),
                  matplotlibFig       = document.getElementById('matplotlib-fig'),
                  bpm                 = document.getElementById('bpm'),
                  key                 = document.getElementById('key');
            //    scale (major/minor) is implied in key
                
            if (data.error) {
                fileTitle.innerHTML = `<p style="color: red;">${data.error}</p>`;
            } 
            else {
                uploadStatus.innerText = "Upload successful!";
                fileTitle.innerText = `Audio Visualization: ${data.file_name}`;
                visualizerContainer.innerHTML = `
                    <div id="motion-container"></div>
                    <div id="audio-container"></div>
                `;
                // render visualizer
                initAudioVisualizer(data.file_url);
                figLoader.style.display = 'block';
                matplotlibFig.src = data.image_url;
                setTimeout(() => {
                    figLoader.style.display = 'none';
                    matplotlibFig.style.opacity = 1;
                }, 2000);
                bpm.innerText = data.features[0];
                key.innerText = `${data.features[1]} ${data.features[2]}`;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});




