import librosa 

y, sr = librosa.load('filename.mp3', duration=60)
tempo, _ = librosa.beat.beat_track(y=y, sr=sr)

print(tempo)