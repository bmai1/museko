import os
import librosa
import numpy as np
import pandas as pd

# Analyze audio file using librosa
def extract_features(file_name):
    y, sr = librosa.load(file_name, duration=30)
    
    # Extract BPM
    tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
    
    # Extract chroma feature
    chroma_stft = librosa.feature.chroma_stft(y=y, sr=sr).mean()
    
    # Extract spectral centroid
    spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr).mean()
    
    # Extract zero-crossing rate
    zcr = librosa.feature.zero_crossing_rate(y).mean()
    
    return [tempo, chroma_stft, spectral_centroid, zcr]
