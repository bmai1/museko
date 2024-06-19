import librosa
import essentia.standard as es
import numpy as np

from analysis.extract import extract_features
from model import model

def main():
    predictDnB('analysis/other_genres')

def predictDnB(dir_path):
    features = extract_features(dir_path, 0)[0]
    features.pop() # remove label
    feature_length = 4
    features = np.array(features).reshape(1, feature_length, 1)
    
    prediction = model.predict(features)
    probability = prediction[0][0]

    if probability > 0.5:
        print(f"The song is predicted to be of the target genre with a probability of {probability:.2f}")
    else:
        print(f"The song is predicted not to be of the target genre with a probability of {probability:.2f}")

if __name__ == '__main__':
    main()