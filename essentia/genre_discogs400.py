import numpy as np
import matplotlib.pyplot as plt
from essentia.standard import MonoLoader, TensorflowPredictEffnetDiscogs, TensorflowPredict2D
from genre_data import genre_names

# Load songs
audio = MonoLoader(filename="audio.wav", sampleRate=16000, resampleQuality=4)()

embedding_model = TensorflowPredictEffnetDiscogs(
    graphFilename="discogs-effnet-bs64-1.pb", 
    output="PartitionedCall:1"
)
embeddings = embedding_model(audio)

# Predict with genre classification model
model = TensorflowPredict2D(
    graphFilename="genre_discogs400-discogs-effnet-1.pb", 
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
plt.figure(figsize=(12, 6))
plt.bar(top_genres, top_scores, color='skyblue')
plt.xlabel('Genres')
plt.ylabel('Average Prediction Scores')
plt.title(f'Top {top_n} Genres by Average Prediction')
plt.xticks(rotation=45, ha='right')
plt.tight_layout()

# Show the plot
plt.show()