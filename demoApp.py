import tkinter as tk
from tkinter.filedialog import askopenfile
import numpy as np
import matplotlib.pyplot as plt
from io import BytesIO
from PIL import Image, ImageTk
import librosa
import librosa.display

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
    if filename:
        img_tk_mfcc, img_tk_spec = show_mfcc_graph(filename.name)

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

top = tk.Tk()
top.geometry("800x800")

B = tk.Button(top, text="Choose file", command=choose_file)
B.place(x=0, y=0)

top.mainloop()