import numpy as np
import matplotlib.pyplot as plt
from scipy.signal import correlate

fs = 44100  
duration = 1  
frequency = 1000  
c = 343 


t = np.linspace(0, duration, int(fs * duration), endpoint=False)
signal = np.sin(2 * np.pi * frequency * t)

delay_1 = 0.000  #ms
delay_2 = 0.001  #ms
delay_3 = 0.002  #ms
delay_4 = 0.003  #ms

# delay
def apply_delay(signal, delay, fs):
    delay_samples = int(delay * fs)
    delayed_signal = np.zeros_like(signal)
    if delay_samples > 0:
        delayed_signal[delay_samples:] = signal[:-delay_samples]
    else:
        delayed_signal = signal
    return delayed_signal

# delay za signale
signal_1 = apply_delay(signal, delay_1, fs)
signal_2 = apply_delay(signal, delay_2, fs)
signal_3 = apply_delay(signal, delay_3, fs)
signal_4 = apply_delay(signal, delay_4, fs)

def detect_signal_start(signal, threshold=0.5):
    for i, sample in enumerate(signal):
        if sample >= threshold:
            return i / fs
    return None

# start time za vsak mikrofon
start_time_1 = detect_signal_start(signal_1)
start_time_2 = detect_signal_start(signal_2)
start_time_3 = detect_signal_start(signal_3)
start_time_4 = detect_signal_start(signal_4)

# kateri prvi zazna sireno
first_detection_times = {
    "Mic 1": start_time_1,
    "Mic 2": start_time_2,
    "Mic 3": start_time_3,
    "Mic 4": start_time_4
}

first_detected_mic = min(first_detection_times, key=first_detection_times.get)

#print("Signal detection times (in seconds):")
#print(f"Mic 1: {start_time_1:.6f} seconds")
#print(f"Mic 2: {start_time_2:.6f} seconds")
#print(f"Mic 3: {start_time_3:.6f} seconds")
#print(f"Mic 4: {start_time_4:.6f} seconds")
#print(f"The microphone that first detected the signal is: {first_detected_mic}")

def get_first_detected_mic():
    return first_detected_mic

if __name__ == '__main__':
    print(f"The first detected microphone is: {get_first_detected_mic()}")