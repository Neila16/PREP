# PREP MVP — final free prototype

## Run locally
Open this folder in VS Code and run `python -m http.server 8000`, then visit `http://localhost:8000`.

## Publish
Commit all files to your existing GitHub repository; Render Static Site deploys the new version automatically.

## First-use workflow
1. My courses: create course and date. Add topics with the **Manage topics** section, or import syllabus/lectures.
2. Study materials: upload PDF, DOCX, PPTX, TXT. Text is extracted locally.
3. Study notes: choose course/topic and generate structured, source-linked excerpts.
4. Diagnostic quiz: choose Mixed, Multiple choice, or Open-ended. If there are not enough source definitions, add verified questions in the built-in question editor. Multiple choice requires at least 3 distinct incorrect terms/options.
5. Weak topics: displays scores from actual answers, and Not assessed for untouched topics.
6. Study planner: works from course topics even before the first quiz. Mark tasks complete.
7. Mock exam: timed practice, with self-grading for open-ended answers.

## Limitations
- No paid AI and no server. Text extraction uses PDF.js, Mammoth, JSZip from CDN (internet needed on first load).
- Extractive notes are source excerpts, not generative AI summaries.
- Automatically generated questions only come from definitional statements; the editor lets you add and verify questions.
- Open-ended answers are self-graded; scores reflect the student's assessment.
- All data is stored locally in browser IndexedDB. It does not sync across browsers or devices.
- File bytes are not retained, only extracted text; scanned PDFs require OCR.
- Readiness is a weighted study-progress indicator, not a grade prediction.
- If you used an older PREP build, existing browser data is retained by the same IndexedDB database; use My courses to add missing topics.


## Automatic topic selection (updated)

1. Create a course with a name and exam date. Topics are optional.
2. Go to Study materials, choose that course, upload a syllabus and/or lectures.
3. After import, PREP proposes topics found in document headings or slide titles.
4. Review the checkboxes, deselect irrelevant topics and click **Use selected topics**.
5. Weak Topics and Study Planner will now use those confirmed topics.

Topic detection is rule-based, not AI. It may miss headings in unusual layouts. Scanned PDFs require OCR and are not supported.


## Topic review workflow update
Study Planner, Dashboard and Weak Topics now have **Read topic notes** and **Take/Retake topic quiz** buttons. These open the relevant course and topic automatically. Notes lead to a topic quiz via **Practice this topic**. The **Check answers** and **Submit exam** buttons now appear below the questions.

Retakes use the currently available source-derived question pool, which can repeat questions if there are not enough definitions. No paid AI is used.
