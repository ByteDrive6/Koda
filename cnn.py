import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Conv2D, Flatten, Dropout, MaxPooling2D
from tensorflow.keras.optimizers import Adam

# Naložite in pripravite svoje podatke
# X_train, X_test, y_train, y_test = vaši_podatki()

# V tem primeru domnevamo, da so MFCC značilnosti oblike (num_samples, height, width, channels)
# Pri MFCC 'channels' običajno bo en, ker MFCC vrača samo eno raven informacij

# Definiranje modela
model = Sequential([
    Conv2D(32, (3, 3), activation='relu', input_shape=(X_train.shape[1], X_train.shape[2], X_train.shape[3])),
    MaxPooling2D((2, 2)),
    Conv2D(64, (3, 3), activation='relu'),
    MaxPooling2D((2, 2)),
    Conv2D(64, (3, 3), activation='relu'),
    Flatten(),
    Dropout(0.5),
    Dense(64, activation='relu'),
    Dense(1, activation='sigmoid')  # Binarna klasifikacija
])

# Kompilacija modela
model.compile(optimizer=Adam(),
              loss='binary_crossentropy',
              metrics=['accuracy'])

# Usposabljanje modela
history = model.fit(X_train, y_train, epochs=10, validation_data=(X_test, y_test))

# Ocena modela
test_loss, test_acc = model.evaluate(X_test, y_test)
print(f"Testna natančnost: {test_acc}")

# Shranjevanje modela
model.save('cnn_siren_detection_model.h5')