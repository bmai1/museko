
import os
import librosa
import csv
import essentia.standard as es

def main():
    # label target genre as 1
    data = extract_features("dnbjungle", 1) + extract_features("other_genres", 0)
    preprocess(data)

def extract_features(dir_path, label):
    features = []
    songs = os.listdir(dir_path)

    for song in songs:
        song_path = os.path.join(dir_path, song)
        y, sr = librosa.load(song_path, duration=60)
        
        # librosa bpm can easily make mistakes
        # tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
        # if label == 1 and tempo[0] < 100:
        #     tempo[0] = tempo[0] * 2

        chroma_stft = librosa.feature.chroma_stft(y=y, sr=sr).mean()
        spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr).mean()
        zcr = librosa.feature.zero_crossing_rate(y).mean()

        audio = es.MonoLoader(filename=song_path)()
        rhythm_extractor = es.RhythmExtractor2013(method="multifeature")
        bpm, beats, beats_confidence, _, beats_intervals = rhythm_extractor(audio)

        # Account for octave-error where DnB is taken at halftime
        if label == 1 and bpm < 100:
            bpm = bpm * 2

        features.append([bpm, chroma_stft, spectral_centroid, zcr, label])

    # print(features)

    return features

# Create CSV
def preprocess(data):
    header = ['bpm', 'chroma_stft', 'spectral_centroid', 'zcr', 'label']

    with open('../data/feature_data.csv', 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(header)
        for features in data:
            writer.writerow(features)

if __name__ == "__main__":
    main()