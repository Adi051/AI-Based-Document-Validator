import cv2
import sys
import os
import pytesseract
from pdf2image import convert_from_path

# ================= TESSERACT PATH =================
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# ================= POPPLER PATH =================
POPPLER_PATH = r"C:\poppler\poppler-25.12.0\Library\bin"

# ================= FILE PATH =================
file_path = sys.argv[1]


# ================= CLEAN TEXT =================
def clean_text(text):

    text = text.replace("\n", " ")
    text = text.replace("\r", " ")

    # remove extra spaces
    text = " ".join(text.split())

    return text


# ================= IMAGE OCR =================
def ocr_image(image_path):

    img = cv2.imread(image_path)

    if img is None:
        return ""

    try:

        # grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # denoise
        gray = cv2.fastNlMeansDenoising(gray)

        # threshold
        thresh = cv2.threshold(
            gray,
            0,
            255,
            cv2.THRESH_BINARY + cv2.THRESH_OTSU
        )[1]

        # OCR
        text = pytesseract.image_to_string(
            thresh,
            lang="eng",
            config="--oem 3 --psm 6"
        )

        return clean_text(text)

    except:
        return ""


# ================= PDF OCR =================
def pdf_ocr(pdf_path):

    final_text = ""

    try:

        pages = convert_from_path(
            pdf_path,
            dpi=300,
            poppler_path=POPPLER_PATH
        )

        for i, page in enumerate(pages[:3]):

            img_path = f"temp_page_{i}.png"

            # save page
            page.save(img_path, "PNG")

            # OCR
            text = ocr_image(img_path)

            final_text += text + " "

            # delete temp image
            try:
                os.remove(img_path)
            except:
                pass

    except:
        return ""

    return clean_text(final_text)


# ================= MAIN =================
try:

    extracted_text = ""

    # PDF
    if file_path.lower().endswith(".pdf"):

        extracted_text = pdf_ocr(file_path)

    # IMAGE
    else:

        extracted_text = ocr_image(file_path)

    extracted_text = clean_text(extracted_text)

    # remove duplicate words
    extracted_text = " ".join(dict.fromkeys(extracted_text.split()))

    # FINAL OUTPUT
    if len(extracted_text) < 10:

        sys.stdout.write("OCR_FAILED")

    else:

        sys.stdout.write(extracted_text)

except:

    sys.stdout.write("OCR_FAILED")