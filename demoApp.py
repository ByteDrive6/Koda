import tkinter as tk
from tkinter.filedialog import askopenfile
from tkinter import messagebox
import numpy as np
import matplotlib.pyplot as plt
from io import BytesIO
from PIL import Image, ImageTk
import librosa
import librosa.display
import tensorflow as tf

def show_mfcc_graph(filename):
    print("Ustvarjam graf - počakaj malo")
    try:
        y, sr = librosa.load(filename, duration=60)
    except Exception as e:
        print(f"Error loading audio file: {e}")
        return None, None

    # Izračunaj MFCC
    try:
        mfccs = librosa.feature.mfcc(y=y, sr=sr)
    except Exception as e:
        print(f"Error extracting MFCC: {e}")
        return None, None

    # Ustvari graf MFCC
    plt.figure(figsize=(6, 4))
    librosa.display.specshow(mfccs, x_axis='time', y_axis='mel')
    plt.colorbar()
    plt.title('MFCC')
    plt.tight_layout()

    # Pretvori graf v sliko
    buf_mfcc = BytesIO()
    plt.savefig(buf_mfcc, format='png')
    buf_mfcc.seek(0)
    img_mfcc = Image.open(buf_mfcc)
    img_tk_mfcc = ImageTk.PhotoImage(img_mfcc)

    # Izračunaj spektrogram
    D = np.abs(librosa.stft(y))

    # Ustvari graf spektrograma
    plt.figure(figsize=(6, 4))
    librosa.display.specshow(librosa.amplitude_to_db(D, ref=np.max), y_axis='log', x_axis='time')
    plt.colorbar(format='%+2.0f dB')
    plt.title('Spektrogram')
    plt.tight_layout()

    # Pretvori graf v sliko
    buf_spec = BytesIO()
    plt.savefig(buf_spec, format='png')
    buf_spec.seek(0)
    img_spec = Image.open(buf_spec)
    img_tk_spec = ImageTk.PhotoImage(img_spec)

    return img_tk_mfcc, img_tk_spec

def choose_file():
    filename = askopenfile()
    # Primer uporabe funkcije
    model_path = 'cnn_siren_detection_model.h5'
    model = tf.keras.models.load_model(model_path)
    audio_file_path = 'C:\\Users\\firerr\\Documents\\Audacity\\posnetek1_2024_4_4_19_13_45.wav'

    if filename:
        img_tk_mfcc, img_tk_spec = show_mfcc_graph(filename.name)

        is_siren, confidence = predict_siren_presence(model, filename.name)
        print(f"Sirena prisotna: {'Da' if is_siren else 'Ne'} z zaupanjem {confidence:.2f}")
        if is_siren:
            message = f"Sirena je prisotna! (Prediction: {confidence:.2f})"
        else:
            message = f"Sirena ni prisotna! (Prediction: {confidence:.2f})"

        if img_tk_mfcc and img_tk_spec:
            mfcc_features = extract_mfcc_features([filename.name])
            if mfcc_features.size == 0:
                print("No MFCC features extracted.")
                return

            print(f"mfcc features: {mfcc_features}")

            mfcc_features = normalize_features(mfcc_features)

            # Določi max_length glede na najdaljšo matriko v naboru
            max_length = max(mfcc.shape[1] for mfcc in mfcc_features)

            # Prikaz slike v Tkinter oknu
            label_mfcc = tk.Label(top, image=img_tk_mfcc)
            label_mfcc.image = img_tk_mfcc
            label_mfcc.pack()

            label_spec = tk.Label(top, image=img_tk_spec)
            label_spec.image = img_tk_spec
            label_spec.pack()
        
        messagebox.showinfo("Rezultat Napovedi", message)


def extract_mfcc_features(audio_files):
    mfcc_features = []
    for file in audio_files:
        try:
            signal, sr = librosa.load(file, sr=None)
            mfcc = librosa.feature.mfcc(y=signal, sr=sr, n_mfcc=13)
            mfcc_features.append(mfcc)
        except Exception as e:
            print(f"Error extracting MFCC from {file}: {e}")
    return np.array(mfcc_features)

def normalize_features(features):
    if features.size == 0:
        return features
    mean = np.mean(features, axis=0)
    std = np.std(features, axis=0)
    std[std == 0] = 1  # Replace zero standard deviations with 1 to avoid division by zero
    std[np.isnan(std)] = 1  # Replace NaN standard deviations with 1 to avoid NaN in division
    return (features - mean) / std

def pad_features(features, max_length):
    padded_features = []
    for feature in features:
        if feature.shape[1] < max_length:
            pad_width = max_length - feature.shape[1]
            padded_feature = np.pad(feature, pad_width=((0, 0), (0, pad_width)), mode='constant')
        else:
            padded_feature = feature[:, :max_length]
        padded_features.append(padded_feature)
    return np.array(padded_features)


# Dodana implementacija za uporabo CNN

def predict_siren_presence(model, audio_path, sr=44100):
    print(f"fileath: {audio_path}")
    mfcc_features = []
    segment_length_sec = 6
    sample_rate = 44100
    segment_length_samples = segment_length_sec * sample_rate
    total_duration_samples = 60 * sample_rate  # skupna dolžina vzorcev za 60s

    # Naloži zvočni posnetek
    y, sr = librosa.load(audio_path, sr=sr)
    # Dopolnitev zvočnega posnetka na 60 sekund, če je krajši
    if len(y) < total_duration_samples:
        y = librosa.util.fix_length(y, size=total_duration_samples)

    # Pretvori zvočni posnetek v MFCC značilnosti   
    # Segmentacija zvočnega posnetka in izračun MFCC
    for start in range(0, total_duration_samples, segment_length_samples):
        end = start + segment_length_samples
        segment = y[start:end]
        mfcc = librosa.feature.mfcc(y=segment, sr=sr)
        mfcc_features.append(mfcc.T)  # Transponiraj, da bo oblika (časovni okvirji, značilnosti)

    mfcc_features = np.array(mfcc_features)
    # Preverimo, če je oblika mfcc_features ustrezna, sicer dodamo potrebne dimenzije
    if mfcc_features.ndim == 3:
        mfcc_features = np.expand_dims(mfcc_features, axis=-1)  # Dodajemo dodatno dimenzijo za kanale

    print(f"Oblika vhodnih MFCC značilnosti: {mfcc_features.shape}")

    # Napoved s modelom
    prediction = model.predict(mfcc_features)
    
    # Sirena je prisotna, če je napoved večja od 0.5
    siren_present = prediction[0, 0] > 0.5
    
    return siren_present, prediction[0, 0]


top = tk.Tk()
top.geometry("800x800")

B = tk.Button(top, text="Choose file", command=choose_file)
B.place(x=0, y=0)

top.mainloop()