import AudioMotionAnalyzer from 'https://cdn.skypack.dev/audiomotion-analyzer?min';

let audioEl, audioMotion;

export function initAudioVisualizer(file_url) {
    const audioContainer  = document.getElementById('audio-container');
    const motionContainer = document.getElementById('motion-container');

    audioEl = new Audio(file_url);
    audioEl.controls = true; // won't display otherwise
    audioEl.crossOrigin = 'anonymous';
    audioEl.onloadeddata = () => {
        audioEl.play();
    }
    audioContainer.append(audioEl);

    audioMotion = new AudioMotionAnalyzer(motionContainer, {
        source: audioEl,
        // mode: 1, // 1/24th (240) octave bands
        showPeaks: false,
        gradient: 'steelblue',
        showScaleX: true, // frequency or notes
        showScaleY: true,  // decibels
        maxDecibels: -20,
        // overlay: true,
    });
}