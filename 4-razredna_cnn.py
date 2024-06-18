import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, BatchNormalization, Flatten, Dense, Dropout, Activation, Add, GlobalAveragePooling2D, InputLayer
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping
from sklearn.model_selection import train_test_split
import librosa
import os
from keras import optimizers

# 1. DATA PREDPROCESSING
# Definicija poti do mape zvočnih posnetkov in oznak
audio_dirs = {"resevalne": r"E:\\Hana - projekt\\Zvočni posnetki - simulacija siren REŠEVALCI", 
              "gasilske": r"E:\\Hana - projekt\\Zvočni posnetki - simulacija siren GASILCI",
              "brez": r"E:\\Hana - projekt\\Zvočni posnetki - simulacija siren BREZ SIREN",
              "policijske": r"E:\\Hana - projekt\\Zvočni posnetki - simulacija siren POLICIJA"}

label_files = {"resevalne": "E:\\Hana - projekt\\Oznake\\oznake-rešilci.txt",
               "gasilske": "E:\\Hana - projekt\\Oznake\\oznake-gasilci.txt",
               "brez": "E:\\Hana - projekt\\Oznake\\oznake-brez_siren.txt",
               "policijske": "E:\\Hana - projekt\\Oznake\\oznake-policaji.txt"}

# Seznam za shranjevanje MFCC značilnosti in ciljnih razredov
mfcc_features = []
labels = []
sample_rate = 44100
total_duration_samples = 60 * sample_rate  # skupna dolžina vzorcev za 60s

segment_length_sec = 6
segment_length_samples = segment_length_sec * sample_rate


# 2. AUDIO REPRESENTATION
# Branje zvočnih posnetkov in pretvorba v MFCC značilnosti

def load_audio_files(audio_dir, total_duration_samples, segmenth_length_samples):
    mfcc_features = []
    files = os.listdir(audio_dir)
    files = [f for f in files if f.endswith(".wav")]

    if (audio_dir == audio_dirs["resevalne"] or audio_dir == audio_dirs["gasilske"] or audio_dir == audio_dirs["policijske"]):
        files.sort(key=lambda x: int(x[8:10].replace("_", "")))  # Sortiranje po numerični vrednosti v imenu

    for filename in files:
        #if filename.endswith(".wav") and int(filename[8:10].replace("_", "")) <= 37:
        print(f"Processing {filename}")
        filepath = os.path.join(audio_dir, filename)
        y, sr = librosa.load(filepath, sr=None)

        # Dopolnitev zvočnega posnetka na 60 sekund, če je krajši
        if len(y) < total_duration_samples:
            y = librosa.util.fix_length(y, size=total_duration_samples)

        # Obreži zvočni posnetek, če je daljši od 60 sekund
        if len(y) > total_duration_samples:
            y = y[:total_duration_samples]

        try:
            mfcc = librosa.feature.mfcc(y=y, sr=sr)
            mfcc_features.append(mfcc.T)
        except Exception as e:
            print(f"Error processing MFCC for {filename}: {e}")
            continue

        """Ne bomo segmentirali
        # Segmentacija zvočnega posnetka in izračun MFCC
        for start in range(0, total_duration_samples, segment_length_samples):
            end = start + segment_length_samples
            segment = y[start:end]
            mfcc = librosa.feature.mfcc(y=segment, sr=sr)
            mfcc_features.append(mfcc.T)  # Transponiraj, da bo oblika (časovni okvirji, značilnosti)
        """
    return np.array(mfcc_features)

mfcc_features_r = load_audio_files(audio_dirs["resevalne"], total_duration_samples, segment_length_samples)
print(f"{mfcc_features_r.shape}")
mfcc_features_g = load_audio_files(audio_dirs["gasilske"], total_duration_samples, segment_length_samples)
print(f"{mfcc_features_g.shape}")
mfcc_features_p = load_audio_files(audio_dirs["policijske"], total_duration_samples, segment_length_samples)
print(f"{mfcc_features_p.shape}")
mfcc_features_b = load_audio_files(audio_dirs['brez'], total_duration_samples, segment_length_samples)
print(f"{mfcc_features_b.shape}")

#mfcc_features_p = load_audio_files(audio_dirs["policijske"], total_duration_samples, segment_length_samples)

# Združi vse v en X
X = np.concatenate([mfcc_features_r, mfcc_features_g, mfcc_features_p, mfcc_features_b])
print(f"Oblika MFCC značilnosti: {X.shape}")


# Tega ne uporabljamo zdaj
# Segmentiramo oznake, da bodo usklajene s 6s zvočnimi posnetki
def segment_labels(labels, segment_length_sec, dolzina):
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
            #labels_segmented.append(segment_label)
            labels_segmented.append(max(set(segment_label), key=segment_label.count))

    return np.array(labels_segmented)


# Preberi oznake iz datotek
def load_labels(label_file, dolzina, label_value):
    labels = []
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
                    if start_time == 0 and end_time == 0:
                        label = [0] * dolzina  # Dolžina posnetka v sekundah
                    else:
                        start_time = start_time - 1
                        label = [0] * dolzina  # Dolžina posnetka v sekundah
                        label[start_time:end_time] = [label_value] * (end_time - start_time)  # Označimo časovni interval sirene
                    labels.append(label)

    return labels

# Branje oznak
all_labels = []
dolzina = 60
for key, value in label_files.items():
    #print(f"Processing key: {key}")
    if key == 'resevalne':
        #print(f"so resevalne")
        labels_value = 1
    elif key == 'gasilske':
        #print(f"so gasilske")
        labels_value = 2
    elif key == 'policijske':
        labels_value = 3
    elif key == 'brez':
        labels_value = 0
    labels = load_labels(value, dolzina, labels_value)
    #print(f"Loaded labels for {key}: {labels}")
    #segmented_labels = segment_labels(labels, segment_length_sec, dolzina)
    all_labels.append(labels)

#print(f"All labels: {all_labels}")


# Pretvorimo oznake -> preverjamo, če je sirena prisotna ali ne in katera sirena je
novi_labels = []
je_prisotna_res = False
je_prisotna_gas = False
je_prisotna_pol = False
#je_prisotna_pol = False
for labels in all_labels:
    for label in labels:
        for i in range(len(label)):
            if label[i] == 1:
                je_prisotna_res = True
            elif label[i] == 2:
                je_prisotna_gas = True
            elif label[i] == 3:
                je_prisotna_pol = True

        if je_prisotna_res:
            novi_labels.append(1)
        elif je_prisotna_gas:
            novi_labels.append(2)
        elif je_prisotna_pol:
            novi_labels.append(3)
        else:
            novi_labels.append(0)
        je_prisotna_res = False
        je_prisotna_gas = False
        je_prisotna_pol = False

y = np.array(novi_labels)

print(f"oznaka y: {y}")
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
# uci se iz enega seta, generalizira na drugega in potem evalueta performance na tretjem setu
# https://medium.com/@ratnesh4209211786/unleashing-the-power-of-cnn-on-audio-voice-recognition-use-case-d60bc8bcc665

# V tem primeru domnevamo, da so MFCC značilnosti oblike (num_samples, height, width, channels)
# Pri MFCC 'channels' običajno bo en, ker MFCC vrača samo eno raven informacij

# CNN MODEL ARHITECTURE
# Model mora imeti: convolutional layers, pooling layers in fully connected layers + normalizacijo vedno po po
print(f"input_shape=(X_train.shape[1], X_train.shape[2], 1: {X_train.shape[1]}, {X_train.shape[2]}, {1}")
# Ustvarimo Sequential model
model = Sequential([
    # Prvi konvolucijski sloj
    Conv2D(32, (1, 8), strides=(3, 3), padding='same', input_shape=(X_train.shape[1], X_train.shape[2], 1)),
    BatchNormalization(),
    Activation('relu'),
    #Dropout(0.3),

    # Drugi konvolucijski sloj
    Conv2D(64, (1, 8), strides=(3, 3), padding='same'),
    BatchNormalization(),
    Activation('relu'),
    #Dropout(0.3),

    # Tretji konvolucijski sloj
    Conv2D(128, (1, 16), strides=(3, 3), padding='same'),
    BatchNormalization(),
    Activation('relu'),
    #Dropout(0.3),

    # Konvolucijski sloj
    #Conv2D(128, (16, 1), strides=(3, 3), padding='same'),
    #BatchNormalization(),
    #Activation('relu'),
    #Dropout(0.3),

    # Globalno povprečno združevanje
    GlobalAveragePooling2D(),
    
    # Popolnoma povezani sloj
    Dense(4, activation='softmax')
])

lr = 0.0001
wd = 1e-6

model.summary()
opt = optimizers.Adam(learning_rate=lr, weight_decay=wd, amsgrad=True)

# Kompilacija modela
# Ne vem še a je boljše sparse_categorical_crossentropy ali categorical_crossentropy
model.compile(optimizer=opt, loss='sparse_categorical_crossentropy', metrics=['accuracy'])

early_stopper = EarlyStopping(
    monitor='val_loss',    # spremljaj validacijsko izgubo
    patience=5,            # število epoch brez izboljšanja po katerem se učenje ustavi
    verbose=1,             # izpiši informacije o ustavitvi
    mode='min',            # ustavi, ko 'monitor' neha padati (minimizacija izgube)
    restore_best_weights=True  # vrne model v stanje z najboljšimi utežmi
)

# Usposabljanje modela -> tukaj ucis model (steps_per_epoch=19??)
history = model.fit(X_train, y_train, epochs=60, validation_data=(X_test, y_test), callbacks=[early_stopper], verbose=1)

"""
x_batch, y_batch = next(training_generator)
print(f"Batch shape: {x_batch.shape}, Labels shape: {y_batch.shape}")

history = model.fit(X_train, y_train,
                    steps_per_epoch=min(X_train.shape[0] // 25, 100),  # Omejite na največ 100 korakov na epoch
                    epochs=epochs, 
                    validation_data=(X_test, y_test),
                    verbose=1)
"""

# Ocena modela
test_loss, test_acc = model.evaluate(X_test, y_test)
print(f"Testna natančnost: {test_acc}, testna izguba: {test_loss}")

# Shranjevanje modela
model.save('4_class_cnn_siren_recognition_model8.h5')

