import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Conv2D, Flatten, Dropout, MaxPooling2D
from tensorflow.keras.optimizers import Adam


# preprocesiran data mores dat v training, validation and testing sets
# uci se iz enega seta, generalizira na drurgega in potem evalueta performance na tretjem setu
# https://medium.com/@ratnesh4209211786/unleashing-the-power-of-cnn-on-audio-voice-recognition-use-case-d60bc8bcc665

# Naložite in pripravite svoje podatke
# X_train, X_test, y_train, y_test = vaši_podatki()

# V tem primeru domnevamo, da so MFCC značilnosti oblike (num_samples, height, width, channels)
# Pri MFCC 'channels' običajno bo en, ker MFCC vrača samo eno raven informacij

# Definiranje modela
# model mora imeti: convolutional layers, pooling layers in fully connecter layers
# vec normalization, po poolingu vedno
model = Sequential([
    Conv2D(32, (3, 3), activation='relu', input_shape=(X_train.shape[1], X_train.shape[2], X_train.shape[3])),
    MaxPooling2D((2, 2)),
    Conv2D(64, (3, 3), activation='relu'),
    MaxPooling2D((2, 2)),
    Conv2D(64, (3, 3), activation='relu'),
    Flatten(),
    Dropout(0.5),
    Dense(64, activation='relu'),
    Dense(1, activation='sigmoid')  # ne Binarna klasifikacija ampak vecrazredna -> 4 razredi bodo, softmax, kratka policijska je naj svoja tako da imamo 4 sirene
])

# Kompilacija modela
model.compile(optimizer=Adam(),
              loss='binary_crossentropy',
              metrics=['accuracy'])

# Usposabljanje modela -> tuka ucis model
history = model.fit(X_train, y_train, epochs=10, validation_data=(X_test, y_test))

# Ocena modela
test_loss, test_acc = model.evaluate(X_test, y_test)
print(f"Testna natančnost: {test_acc}")

# Shranjevanje modela
model.save('cnn_siren_detection_model.h5')