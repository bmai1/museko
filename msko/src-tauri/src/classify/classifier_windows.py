import sys
import os
import numpy as np
import matplotlib.pyplot as plt
import io
from PIL import Image
import librosa
import tensorflow as tf

from genre_data import genre_names

def classify(audio_path):
    base_dir = os.path.abspath(os.path.dirname(__file__))
    effnet_model_path = os.path.join(base_dir, "discogs-effnet-bs64-1.pb")
    genre_model_path = os.path.join(base_dir, "genre_discogs400-discogs-effnet-1.pb")

    if not os.path.exists(effnet_model_path):
        raise FileNotFoundError(f"Effnet model file not found at {effnet_model_path}")
    if not os.path.exists(genre_model_path):
        raise FileNotFoundError(f"Genre model file not found at {genre_model_path}")
    
    '''
        audio = MonoLoader(filename=audio_path, sampleRate=16000, resampleQuality=4)()

        # Extract embeddings
        embedding_model = TensorflowPredictEffnetDiscogs(
            graphFilename=effnet_model_path,
            output="PartitionedCall:1"
        )
        embeddings = embedding_model(audio)

        # Predict with genre classification model using embeddings
        genre_model = TensorflowPredict2D(
            graphFilename=genre_model_path,
            input="serving_default_model_Placeholder", 
            output="PartitionedCall:0"
        )
        predictions = genre_model(embeddings)
    '''

    # Preprocess for essentia (https://github.com/LES4975/Album_Art_Generator_Project/blob/d890d84a74bcceae9b3907f94aa15cf6e25e7c0a/Legacy/audio_preprocessing.py)
    audio, _ = librosa.load(audio_path, sr=16000, mono=True)

    sr=16000
    frame_size = 512
    hop_length = 256
    n_mels = 96
    patch_size = 128

    mel_spec = librosa.feature.melspectrogram(
        y=audio,
        sr=sr,
        n_mels=n_mels,
        n_fft=frame_size,
        hop_length=hop_length,
        fmin=0.0,
        fmax=8000.0,
        power=2.0,
        norm='slaney',
        htk=False
    )

    mel_bands_shifted = (mel_spec + 1) * 10000
    mel_bands_log = np.log10(mel_bands_shifted)

    n_frames = mel_bands_log.shape[1]
    patches = []
    patch_hop_size = 64

    for start in range(0, n_frames - patch_size + 1, patch_hop_size):
        end = start + patch_size
        patch = mel_bands_log[:, start:end]  # [96, 128]
        patches.append(patch)

    if len(patches) == 0 or n_frames >= patch_size:
        if n_frames >= patch_size:
            last_patch = mel_bands_log[:, -patch_size:]
            if len(patches) == 0 or not np.array_equal(patches[-1], last_patch):
                patches.append(last_patch)

    if len(patches) > 64:
        indices = np.linspace(0, len(patches) - 1, 64, dtype=int)
        patches = [patches[i] for i in indices]
    elif len(patches) < 64:
        original_count = len(patches)
        while len(patches) < 64:
            patches.append(patches[-1].copy())

    mel_batch = np.array(patches, dtype=np.float32)
    mel_batch = np.transpose(mel_batch, (0, 2, 1))  # [64, 128, 96]

    # Extract embeddings for genre model with effnet model

    effnet_graph = tf.compat.v1.Graph()
    with effnet_graph.as_default():
        effnet_sess = tf.compat.v1.Session()
        graph_def = tf.compat.v1.GraphDef()
        with tf.io.gfile.GFile(effnet_model_path, "rb") as f:
            graph_def.ParseFromString(f.read())
            tf.import_graph_def(graph_def, name="")

        effnet_in = effnet_graph.get_tensor_by_name("serving_default_melspectrogram:0")
        effnet_out = effnet_graph.get_tensor_by_name("PartitionedCall:1")

        embeddings = effnet_sess.run(effnet_out, feed_dict={effnet_in: mel_batch})
        effnet_sess.close()

    # Classify genre using embeddings

    embeddings_mean = np.mean(embeddings, axis=0, keepdims=True)  # (1, 1280)
    # embeddings_mean = (embeddings_mean - np.mean(embeddings_mean)) / (np.std(embeddings_mean) + 1e-8)

    genre_graph = tf.compat.v1.Graph()
    with genre_graph.as_default():
        genre_sess = tf.compat.v1.Session()
        graph_def = tf.compat.v1.GraphDef()
        with tf.io.gfile.GFile(genre_model_path, "rb") as f:
            graph_def.ParseFromString(f.read())
            tf.import_graph_def(graph_def, name="")

        genre_in = genre_graph.get_tensor_by_name("serving_default_model_Placeholder:0")
        genre_out = genre_graph.get_tensor_by_name("PartitionedCall:0")

        predictions = genre_sess.run(genre_out, feed_dict={genre_in: embeddings})
        genre_sess.close()

    average_predictions = np.mean(predictions, axis=0)
    sorted_indices = np.argsort(average_predictions)[::-1]
    sorted_genres = [genre_names[i] for i in sorted_indices]
    sorted_predictions = average_predictions[sorted_indices]

    top_n = 10
    top_genres = sorted_genres[:top_n]
    top_scores = sorted_predictions[:top_n]

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

    buffer = io.BytesIO()
    plt.savefig(buffer, format='png', transparent=True)
    buffer.seek(0)
    plt.close()

    return buffer

def main():
    audio_path = sys.argv[1]
    plot_path = sys.argv[2]

    buffer = classify(audio_path)
    image = Image.open(buffer)
    image = image.resize((700, 500), Image.LANCZOS)

    image.save(plot_path, format='PNG')

if __name__ == '__main__':
    main()