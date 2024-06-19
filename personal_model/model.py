import tensorflow as tf
import numpy as np

from sklearn.model_selection import train_test_split
from keras.models import Sequential
from keras.layers import Conv1D, MaxPooling1D, Flatten, Dense, Dropout


# Read the CSV file
data = np.genfromtxt('data/feature_data.csv', delimiter=',', skip_header=1)

# Separate features and labels
X = data[:, :-1]  
y = data[:, -1]   

# Split into training, validation, and testing sets
X_temp, X_test, y_temp, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
X_train, X_val, y_train, y_val = train_test_split(X_temp, y_temp, test_size=0.2, random_state=42)

# Reshape for CNN (CNN expects 3D input: samples, timesteps, channels)
feature_length = X_train.shape[1]
X_train = X_train.reshape(X_train.shape[0], feature_length, 1)
X_val = X_val.reshape(X_val.shape[0], feature_length, 1)
X_test = X_test.reshape(X_test.shape[0], feature_length, 1)

# Create a basic CNN
model = Sequential([
    # 1D Convolutional Layer
    Conv1D(32, kernel_size=3, activation='relu', input_shape=(feature_length, 1)),
    
    # 1D Max-Pooling Layer
    MaxPooling1D(pool_size=2),
    
    # Flatten the output
    Flatten(),
    
    # Fully connected layer with dropout for regularization
    Dense(128, activation='relu'),
    Dropout(0.5),
    
    # Output layer with a single unit for binary classification
    Dense(1, activation='sigmoid')
])
# model.summary()

# Compile the model
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Train the model
model.fit(X_train, y_train, epochs=10, batch_size=32, validation_data=(X_val, y_val))

# Evaluate the model
loss, accuracy = model.evaluate(X_test, y_test)
print(f'Test Accuracy: {accuracy * 100:.2f}%')

# lmao always 50%