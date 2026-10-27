# PREP MVP — branded version

Working HTML/CSS/JavaScript prototype with PREP black/cyan branding and the supplied logo.

## Run in VS Code (Windows)

1. Unzip the archive and open the `PREP-MVP` folder in VS Code.
2. Open Terminal → New Terminal.
3. Run `python -m http.server 8000` (or `py -m http.server 8000`).
4. Open `http://localhost:8000` in a browser.
5. Press Ctrl+C to stop the server.

Alternatively open `index.html` with the Live Server extension.

## Edit the look

- `css/style.css` — brand colors, layout, buttons and responsive styles.
- `assets/prep-logo.png` — original supplied PREP logo.
- `index.html` — page markup.
- `js/app.js` — quiz, mock exam, topic scores, and navigation.

## Scope

This is a frontend demo: sample questions and local calculations, not real AI/PDF analysis or a grade prediction.


## Upload syllabus (PDF)

In **Exam setup**, select a text-based PDF syllabus (up to 10 MB / 80 pages).
The app extracts text locally using PDF.js, suggests topic headings, and lets you choose
which topics to copy into the editable topics field. Then click **Create study space**.

PDF.js loads from a CDN, so internet access is needed when starting the page.
Scanned/image-only PDFs need OCR, which is not included.
No PDF is uploaded to a server. No AI generation is connected: the quiz and mock exam
still contain the original sample cybersecurity questions, regardless of syllabus.
