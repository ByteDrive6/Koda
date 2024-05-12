from tkinter import *
from tkinter.filedialog import askopenfile
import numpy as np


top = Tk()

top.geometry("800x800")
def show():
   filename = askopenfile()
   print(filename)
   
B = Button(top, text ="Choose file", command = show)
B.place(x=0,y=0)

top.mainloop()