import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout, BatchNormalization
from tensorflow.keras.optimizers import Adam
from sklearn.model_selection import train_test_split
import librosa
import os

# 1. DATA PREDPROCESSING
# Definicija poti do mape zvočnih posnetkov in oznak
audio_dir = r"C:\\Users\\firerr\\Documents\\Audacity"
label_file = "C:\\Users\\firerr\\Documents\\Audacity\\oznake.txt"

# Seznam za shranjevanje MFCC značilnosti in ciljnih razredov
mfcc_features = []
labels = []
segment_length_sec = 6
sample_rate = 44100
segment_length_samples = segment_length_sec * sample_rate
total_duration_samples = 60 * sample_rate  # skupna dolžina vzorcev za 60s


"""
# Poišči najdaljšo dolžino zvočnega posnetka
max_length = -float('inf')  # Nastavi začetno vrednost na neskončnost
for filename in os.listdir(audio_dir):
    if filename.endswith(".wav"):
        filepath = os.path.join(audio_dir, filename)
        # Preberi zvočni posnetek
        y, sr = librosa.load(filepath, sr=None)
        # Posodobi najkrajšo dolžino, če je potrebno
        max_length = max(max_length, len(y))
"""


# 2. AUDIO REPRESENTATION
# Branje zvočnih posnetkov in pretvorba v MFCC značilnosti
files = os.listdir(audio_dir)
# To sem dala zdej začasno, potem ko bojo vsi podatki pravilno urejeni bo brez tega
files = [f for f in files if f.endswith(".wav") and int(f[8:10].replace("_", "")) <= 37]
files.sort(key=lambda x: int(x[8:10].replace("_", "")))  # Sortiranje po numerični vrednosti v imenu

for filename in files:
    #if filename.endswith(".wav") and int(filename[8:10].replace("_", "")) <= 37:
    print(f"Processing {filename}")
    filepath = os.path.join(audio_dir, filename)
    y, sr = librosa.load(filepath, sr=None)

    # Dopolnitev zvočnega posnetka na 60 sekund, če je krajši
    if len(y) < total_duration_samples:
        y = librosa.util.fix_length(y, size=total_duration_samples)

    # Segmentacija zvočnega posnetka in izračun MFCC
    for start in range(0, total_duration_samples, segment_length_samples):
        end = start + segment_length_samples
        segment = y[start:end]
        mfcc = librosa.feature.mfcc(y=segment, sr=sr)
        mfcc_features.append(mfcc.T)  # Transponiraj, da bo oblika (časovni okvirji, značilnosti)

"""
# Ker so posnetki različnih dolžin, je nekaterim potrebno dodati ničle na koncu
max_length2 = max(len(mfcc) for mfcc in mfcc_features)
print(f"max_length: {max_length2}")
# Povečaj dolžino MFCC značilnosti na max_length z dodajanjem ničel na koncu
mfcc_features_padded = [np.pad(mfcc, ((0, max_length2 - len(mfcc)), (0, 0)), mode='constant') for mfcc in mfcc_features]
"""

# Pretvori seznam v numpy array
X = np.array(mfcc_features)
print(f"Oblika MFCC značilnosti: {X.shape}")
print(f"X: {X}")


dolzina = 60
print(f"dolzina: {dolzina}")
# Branje oznak iz datoteke 
#Vsaka vrstica predstavlja en zvočni posnetek, kjer je vsak stolpec ena sekunda. Če je 0 - ni sirene, če je 1 - je sirena
with open(label_file, "r") as f:
    lines = f.readlines()
    for line in lines:
        line = line.strip()
        if line:
            line_parts = line.split(" : ")
            if len(line_parts) == 2:
                time_range = line_parts[1]
                start, end = time_range.split(" - ")
                start_time = int(start.split("s")[0])
                end_time = int(end.split("s")[0])
                label = [0] * dolzina  # Dolžina posnetka v sekundah
                label[start_time:end_time] = [1] * (end_time - start_time)  # Označimo časovni interval sirene
                labels.append(label)

print(f"labels: {labels}")

# Segmentiramo oznake, da bodo usklajene s 6s zvočnimi posnetki
num_segments = dolzina // segment_length_sec
# Branje oznak in razdelitev na segmente po 6 sekund
labels_segmented = []
for full_label in labels:
    for i in range(num_segments):
        start_index = i * segment_length_sec
        end_index = start_index + segment_length_sec
        # Vzemi del oznak, ki ustreza trenutnemu segmentu
        segment_label = full_label[start_index:end_index]
        # Dodaj segmentne oznake v nov seznam
        labels_segmented.append(segment_label)

print(f"segmented labels: {labels_segmented}")
# Pretvorimo oznake -> preverjamo samo, če je sirena prisotna ali ne (še ne ločujemo na razrede)
novi_labels = []
je_prisotna = False
for label in labels_segmented:
    for i in range(len(label)):
        if label[i] == 1:
            je_prisotna = True
    if je_prisotna:
        novi_labels.append(1)
    else:
        novi_labels.append(0)
    je_prisotna = False

y = np.array(novi_labels)

print(f"oznake y: {y}")
print(f"Oblika oznak y: {y.shape}")

# 3. DATA SPLITTING
# Pripravimo X_test, X_train, y_test, y_train
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Preverjanje oblike deljenih podatkov
print("Oblika X_train:", X_train.shape)
print("Oblika y_train:", y_train.shape)
print("Oblika X_test:", X_test.shape)
print("Oblika y_test:", y_test.shape)

# preprocesiran data mores dat v training, validation and testing sets
# uci se iz enega seta, generalizira na drurgega in potem evalueta performance na tretjem setu
# https://medium.com/@ratnesh4209211786/unleashing-the-power-of-cnn-on-audio-voice-recognition-use-case-d60bc8bcc665


# V tem primeru domnevamo, da so MFCC značilnosti oblike (num_samples, height, width, channels)
# Pri MFCC 'channels' običajno bo en, ker MFCC vrača samo eno raven informacij

# CNN MODEL ARHITECTURE
# Model mora imeti: convolutional layers, pooling layers in fully connected layers + normalizacijo vedno po po
print(f"input_shape=(X_train.shape[1], X_train.shape[2], 1: {X_train.shape[1]}, {X_train.shape[2]}, {1}")
model = Sequential([
    # Prvi konvolucijski sloj
    Conv2D(32, (3, 3), activation='relu', input_shape=(X_train.shape[1], X_train.shape[2], 1), padding='same'),
    MaxPooling2D(pool_size=(2, 2), strides=(2, 2), padding='same'), # Združevanje
    BatchNormalization(), # Normalizacija

    # Drugi konvolucijski sloj
    Conv2D(64, (3, 3), activation='relu'),
    MaxPooling2D(pool_size=(2, 2), strides=(2, 2), padding='same'), # Združevanje
    BatchNormalization(), # Normalizacija

    #Tretji konvolucijski sloj
    #Conv2D(128, (3, 3), activation='relu'),
    #MaxPooling2D((2, 2), padding='same'), # Združevanje
    #BatchNormalization(), # Normalizacija

    Flatten(),

    # Popolnoma povezani sloji
    Dense(64, activation='relu'),
    #Dropout(0.5), # Dropout za preprecevanje prenaucevanja
    Dense(1, activation='sigmoid')  # sem popravila na softmax => da ni binarna klasifikacija ampak vecrazredna -> 4 razredi bodo, softmax, kratka policijska je naj svoja tako da imamo 4 sirene
])

# Kompilacija modela
model.compile(optimizer=Adam(), loss='binary_crossentropy', metrics=['accuracy'])

# Usposabljanje modela -> tukaj ucis model
history = model.fit(X_train, y_train, epochs=30, validation_data=(X_test, y_test))

# Ocena modela
test_loss, test_acc = model.evaluate(X_test, y_test)
print(f"Testna natančnost: {test_acc}")

# Shranjevanje modela
model.save('cnn_siren_detection_model.h5')

