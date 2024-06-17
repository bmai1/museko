// Welcome div fadein and fadeout
document.addEventListener("DOMContentLoaded", function () {
    const welcomeDiv = document.getElementById('welcomeDiv');
    const overlay = document.getElementById('overlay');
    const startButton = document.getElementById('startButton');

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
});

// Upload mp3 files and display analysis results with AJAX
document.getElementById('mp3_upload').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData();
    const fileInput = document.getElementById('fileInput');
    formData.append('file', fileInput.files[0]);

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        const resultDiv = document.getElementById('result');
        if (data.error) {
            resultDiv.innerHTML = `<p style="color: red;">${data.error}</p>`;
        } else {
            // console.log(filename);
            resultDiv.innerHTML = `
                <h2>Analyzed File: ${data.filename}</h2>
                <audio controls src="${data.file_url}"></audio>
                <img src="${data.image_url}" alt="Genre Classification">
            `;
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});