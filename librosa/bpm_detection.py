import os
import librosa

test_mp3 = "test_mp3"
songs = os.listdir(test_mp3)

test_song = os.path.join(test_mp3, songs[0])

y, sr = librosa.load(test_song)
tempo, _ = librosa.beat.beat_track(y=y, sr=sr)

print(f'{songs[1]} BPM: {tempo}')