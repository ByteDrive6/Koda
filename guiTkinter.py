import tkinter as tk
from tkinter import Canvas
from PIL import Image, ImageTk
import simulacijaSmeri

class ClickableRect:
    def __init__(self, canvas, x, y, width, height, mag_image, map_image):
        self.canvas = canvas
        self.map_image = map_image
        self.mag_image = mag_image

        self.map_image_id = canvas.create_image(x, y, anchor="nw", image=map_image)
        self.mag_image_id = canvas.create_image(x + 5, y + 5, anchor="nw", image=mag_image)
        
        self.original_coords = (x, y, x + width, y + height)
        self.enlarged = False
        canvas.tag_bind(self.mag_image_id, "<Button-1>", self.toggle_size)

    def toggle_size(self, event):
        if not self.enlarged:
            center_x = (self.canvas.winfo_width() - (self.original_coords[2] - self.original_coords[0]) * 2) / 2
            center_y = (self.canvas.winfo_height() - (self.original_coords[3] - self.original_coords[1]) * 2) / 2
            new_coords = (center_x, center_y,
                          center_x + (self.original_coords[2] - self.original_coords[0]) * 2,
                          center_y + (self.original_coords[3] - self.original_coords[1]) * 2)
            
            resized_map_image = self.map_image._PhotoImage__photo.zoom(2, 2)
            self.canvas.itemconfig(self.map_image_id, image=resized_map_image)
            self.canvas.coords(self.map_image_id, center_x, center_y)
            
            resized_mag_image = self.mag_image._PhotoImage__photo.zoom(2, 2)
            self.canvas.itemconfig(self.mag_image_id, image=resized_mag_image)
            self.canvas.coords(self.mag_image_id, center_x + 5, center_y + 5)
            
            self.resized_map_image = resized_map_image  # to avoid garbage collection
            self.resized_mag_image = resized_mag_image  # to avoid garbage collection
        else:
            self.canvas.itemconfig(self.map_image_id, image=self.map_image)
            self.canvas.coords(self.map_image_id, self.original_coords[0], self.original_coords[1])
            
            self.canvas.itemconfig(self.mag_image_id, image=self.mag_image)
            self.canvas.coords(self.mag_image_id, self.original_coords[0] + 5, self.original_coords[1] + 5)
            
        self.enlarged = not self.enlarged

def blink_dot():
    global dot_visible
    if dot_visible:
        canvas.itemconfig(dot, state='hidden')
    else:
        canvas.itemconfig(dot, state='normal')
    dot_visible = not dot_visible
    root.after(500, blink_dot)  # blinkne 

def set_dot_position():
    mic_position = {
        "Mic 1": (center_x, circle_y),  # Top
        "Mic 2": (circle_x + circle_diameter, center_y),  # Right
        "Mic 3": (center_x, circle_y + circle_diameter),  # Bottom
        "Mic 4": (circle_x , center_y)  # Left
    }
    position = mic_position.get(first_detected_mic, (center_x, center_y))
    canvas.coords(dot, position[0] - dot_radius, position[1] - dot_radius, position[0] + dot_radius, position[1] + dot_radius)

root = tk.Tk()
root.title("Tkinter Example")
root.geometry("1200x600")

canvas = Canvas(root, width=1200, height=600, bg="#1b1b1b")
canvas.pack()

# Load images (if available)
try:
    image = Image.open("redCar.png")
    image = ImageTk.PhotoImage(image)
    canvas.create_image(280, 280, image=image)
except Exception as e:
    print(f"Failed to load image: {e}")
    
try:
    mag_glass_image = Image.open("magnifyingGlass.png")
    mag_glass_image = mag_glass_image.resize((40, 40), Image.LANCZOS)  # Resize the image
    mag_glass_image = ImageTk.PhotoImage(mag_glass_image)
except Exception as e:
    print(f"Failed to load magnifying glass image: {e}")
    mag_glass_image = None
    
try:
    map_image = Image.open("map.png")
    map_image = map_image.resize((550, 260), Image.LANCZOS)  # Resize the map image to fit the rectangle area
    map_image = ImageTk.PhotoImage(map_image)
except Exception as e:
    print(f"Failed to load map image: {e}")
    map_image = None

# bel krog
circle_x = 280 - 150
circle_y = 280 - 150
circle_diameter = 300
circle = canvas.create_oval(circle_x, circle_y, circle_x + circle_diameter, circle_y + circle_diameter, outline="white", width=40)

# rdeca pikca
dot_radius = 10
dot = canvas.create_oval(-dot_radius, -dot_radius, dot_radius, dot_radius, fill="red")

# slika mape umesto belog pravougaonika
rect_width = 550
rect_height = 260
rect_x = 1200 - rect_width - 30
rect_y = 600 - rect_height - 30
if mag_glass_image and map_image:
    white_rectangle = ClickableRect(canvas, rect_x, rect_y, rect_width, rect_height, mag_glass_image, map_image)

# pridobi smer oz mic
first_detected_mic = simulacijaSmeri.get_first_detected_mic()

# display prvi mic
mic_label = tk.Label(root, text=f"The first detected microphone is: {first_detected_mic}", bg="#1b1b1b", fg="white", font=("Helvetica", 16))
mic_label.pack(pady=20)

# pozicija red dot
center_x = circle_x + circle_diameter / 2
center_y = circle_y + circle_diameter / 2
set_dot_position()

# blinkne red dot
dot_visible = True
blink_dot()

# izpis, to se morem vkljucit s hanino
canvas.create_text(900, 150, text="Prepoznal sem gasilsko sireno", fill="white", font=("Helvetica", 16))

root.mainloop()
