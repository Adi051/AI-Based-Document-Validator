import cv2
import sys
import pytesseract
from pdf2image import convert_from_path
import os

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

file_path = sys.argv[1]

def ocr_image(path):

    img = cv2.imread(path)

    gray = cv2.cvtColor(
        img,
        cv2.COLOR_BGR2GRAY
    )

    thresh = cv2.threshold(
        gray,
        0,
        255,
        cv2.THRESH_BINARY + cv2.THRESH_OTSU
    )[1]

    text = pytesseract.image_to_string(thresh)

    return text

def pdf_ocr(pdf_path):

    final = ""

    pages = convert_from_path(
        pdf_path,
        dpi=300,
        poppler_path=r"C:\poppler\poppler-25.12.0\Library\bin"
    )

    for i, page in enumerate(pages[:5]):

        temp = f"temp-page-{i}.png"

        page.save(temp, "PNG")

        final += ocr_image(temp)

        os.remove(temp)

    return final

try:

    if file_path.lower().endswith(".pdf"):

        text = pdf_ocr(file_path)

    else:

        text = ocr_image(file_path)

    print(text)

except Exception as e:

    print("OCR ERROR:", str(e))