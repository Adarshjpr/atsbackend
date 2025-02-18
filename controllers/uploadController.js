import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";
import Resume from "../models/Resume.js";
import { analyzeResume, fixResumeErrors } from "../utils/analyzeResume.js";
import { calculateATSScore } from "../utils/textExtractor.js";

export const uploadResume = async (req, res) => {
  try {
    console.log("🚀 Received Resume Upload Request");

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = path.resolve(req.file.path);
    const jobDescription = req.body.jobDescription;
    let extractedText = "";

    // ✅ Extract text from PDF
    if (req.file.mimetype === "application/pdf") {
      try {
        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(dataBuffer);
        extractedText = pdfData.text;
      } catch (error) {
        return res.status(500).json({ message: "Error reading PDF file" });
      }
    }

    if (!extractedText) {
      return res.status(400).json({ message: "No text extracted from file" });
    }

    console.log("📜 Extracted Resume Text:", extractedText.substring(0, 200));

    // ✅ Convert Resume into Template Format
    const formattedResume = `
      **Resume Summary:**
      ${extractedText}

      **Job Description Provided:**
      ${jobDescription}
    `;

    // ✅ Send to AI for analysis
    console.log("⚡ Calling AI Resume Analysis (Gemini)...");
    const aiFeedback = await analyzeResume(formattedResume, jobDescription);

    const atsScore = calculateATSScore(extractedText, jobDescription);
    console.log("📊 [FINAL ATS SCORE]:", atsScore);

    const newResume = new Resume({
      fileName: req.file.filename,
      jobDescription,
      formattedResume,
      aiFeedback,
      atsScore, // ✅ Save ATS Score to DB
    });

    await newResume.save();
    console.log("✅ Resume saved to database");

    res.json({
      formattedResume,
      feedback: aiFeedback,
      atsScore, // ✅ Send ATS Score to frontend
      message: "Resume processed successfully!",
    });
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ message: "Server error while processing resume" });
  }
};


// ✅ Fix Errors API
export const fixResume = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;
    console.log("⚡ Fixing Resume Errors...");

    const improvedResume = await fixResumeErrors(resumeText, jobDescription);

    res.json({
      improvedResume,
      message: "Resume errors fixed successfully!",
    });
  } catch (error) {
    console.error("❌ Error fixing resume:", error);
    res.status(500).json({ message: "Error fixing resume" });
  }
};
