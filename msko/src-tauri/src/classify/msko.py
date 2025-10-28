import sys
import os
import numpy as np
import matplotlib.pyplot as plt
import io
from PIL import Image

from essentia.standard import MonoLoader, TensorflowPredictEffnetDiscogs, TensorflowPredict2D
from genre_data import genre_names

def classify(filename):
    # Absolute paths for models
    base_dir = os.path.abspath(os.path.dirname(__file__))
    effnet_model_path = os.path.join(base_dir, "discogs-effnet-bs64-1.pb")
    genre_model_path = os.path.join(base_dir, "genre_discogs400-discogs-effnet-1.pb")

    if not os.path.exists(effnet_model_path):
        raise FileNotFoundError(f"Effnet model file not found at {effnet_model_path}")
    if not os.path.exists(genre_model_path):
        raise FileNotFoundError(f"Genre model file not found at {genre_model_path}")
    
    audio = MonoLoader(filename=filename, sampleRate=16000, resampleQuality=4)()

    # Extract embeddings
    embedding_model = TensorflowPredictEffnetDiscogs(
        graphFilename=effnet_model_path,
        output="PartitionedCall:1"
    )
    embeddings = embedding_model(audio)

    # Predict with genre classification model
    model = TensorflowPredict2D(
        graphFilename=genre_model_path,
        input="serving_default_model_Placeholder", 
        output="PartitionedCall:0"
    )
    predictions = model(embeddings)
    average_predictions = np.mean(predictions, axis=0)

    # Sort genres by average prediction scores
    sorted_indices = np.argsort(average_predictions)[::-1]  # Descending order
    sorted_genres = [genre_names[i] for i in sorted_indices]
    sorted_predictions = average_predictions[sorted_indices]

    # Select top N genres to display
    top_n = 10
    top_genres = sorted_genres[:top_n]
    top_scores = sorted_predictions[:top_n]

    # Plot the results

    # IMPORTANT: switch to Agg to prevent crashing on MacOS, so server doesn't create and destroy GUI windows
    # UserWarning: Starting a Matplotlib GUI outside of the main thread will likely fail.
    # NSInternalInconsistencyException', reason: 'NSWindow drag regions should only be invalidated on the Main Thread!

    plt.switch_backend('Agg') 
    # plt.style.use('dark_background')
    plt.figure(figsize=(7, 5))
    plt.bar(top_genres, top_scores, color='black')
    plt.xlabel('Genres')

    # Average prediction scores = Confidence Level C, if taking many samples the score approaches C
    plt.ylabel('Confidence Level')
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()

    # plt.show()

    # save plot image to serve with flask
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png', transparent=True)
    buffer.seek(0)
    plt.close()

    return buffer

def main():
    audiopath = sys.argv[1]
    plotpath = sys.argv[2]

    buffer = classify(audiopath)
    image = Image.open(buffer)
    image = image.resize((700, 500), Image.LANCZOS)

    image.save(plotpath, format='PNG')

if __name__ == '__main__':
    main()