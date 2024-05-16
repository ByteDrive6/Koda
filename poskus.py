import tkinter as tk
from matplotlib.figure import Figure
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
import librosa
import numpy as np
from scipy.signal import find_peaks
from scipy.spatial import ConvexHull

audio_file = "C:\\Users\\tjasi\\Desktop\\Faks\\4.semester\\Geometrija\\DrugaProjektna\\24guzvaCestaSirena.wav"
#24guzvaCestaSirena.wav dela vredu, jebe pri 21cestaSirena.wav
y, sr = librosa.load(audio_file)

t = np.linspace(0, len(y) / sr, len(y))

peaks, _ = find_peaks(y, distance=5000) # izracuna peaks


num_intervals = int(np.ceil(t[-1])) // 3 # casovni intervali
interval_peak_amplitudes = np.zeros(num_intervals)


for i in range(num_intervals): # racunanje amplitud glede na vsak posamezni interval
    interval_start = i * 3
    interval_end = (i + 1) * 3
    interval_peaks = peaks[(t[peaks] >= interval_start) & (t[peaks] < interval_end)]
    if len(interval_peaks) > 0:
        interval_peak_amplitudes[i] = np.max(y[interval_peaks])

max_peak_intervals = np.argsort(interval_peak_amplitudes)[-4:]  # tu noter bo podano kaj uporabnik vpise noter
print(max_peak_intervals)

root = tk.Tk()
root.title("Audio Waveform Viewer")

fig_main = Figure(figsize=(12, 4))
ax_main = fig_main.add_subplot(111)
ax_main.plot(t, y, linewidth=0.5)
ax_main.set_xlabel('Time (s)')
ax_main.set_ylabel('Amplitude')

peak_times = t[peaks]
peak_amplitudes = y[peaks]
ax_main.plot(peak_times, peak_amplitudes, 'ko', markersize=3, label='Peaks')


for interval_index in max_peak_intervals: # highlightas tisto 
    interval_start = interval_index * 3
    interval_end = (interval_index + 1) * 3
    ax_main.axvspan(interval_start, interval_end, color='r', alpha=0.3) 

# convex hull ustvari
for interval_index in max_peak_intervals:
    interval_start = interval_index * 3
    interval_end = (interval_index + 1) * 3
    highlighted_interval_indices = (t >= interval_start) & (t < interval_end)
    points = np.column_stack((t[highlighted_interval_indices], y[highlighted_interval_indices]))
    hull = ConvexHull(points)
    for simplex in hull.simplices:
        ax_main.plot(points[simplex, 0], points[simplex, 1], 'r-')


canvas_main = FigureCanvasTkAgg(fig_main, master=root)
canvas_main.draw()
canvas_main.get_tk_widget().pack(side=tk.TOP, fill=tk.BOTH, expand=1)

root.mainloop()
