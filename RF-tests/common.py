#encoding=utf-8

import subprocess
import csv
from datetime import datetime
from PIL import Image
from pynput.mouse import Button, Controller
from pynput.keyboard import Key
from pynput.keyboard import Controller as KBController

# returns true if prosess is running otherwise false
def running(etsitty_prosessi):
    p_tasklist = subprocess.Popen('tasklist.exe /fo csv',
                                  stdout=subprocess.PIPE,
                                  universal_newlines=True)

    for p in csv.DictReader(p_tasklist.stdout):

        if (p["Vedoksen nimi"] == etsitty_prosessi):
            return True

    return False


def draw_signature():
    mouse = Controller()
    mouse.position = (70, 225)
    mouse.press(Button.left)
    mouse.move(640, 225)
    mouse.release(Button.left)
    mouse.position = (640, 225)
    mouse.press(Button.left)
    mouse.move(70, 225)
    mouse.release(Button.left)

def type_emailaddress(txt1, txt2):
    keyboard = KBController()
    keyboard.type(txt1)
    keyboard.press(Key.alt_gr)
    keyboard.press("2")
    keyboard.release("2")
    keyboard.release(Key.alt_gr)
    keyboard.type(txt2)