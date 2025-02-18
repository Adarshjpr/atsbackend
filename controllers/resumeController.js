import { analyzeResume } from "../utils/analyzeResume.js";
import { formatResumeTemplate } from "../utils/resumeTemplate.js";
import Resume from "../models/Resume.js"; // Database Model

let storedResume = {};

export const storeResume = async (req, res) => {
  try {
    console.log("🚀 Received Resume Upload Request");

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const jobDescription = req.body.jobDescription;
    let extractedText = "Extracted resume text here..."; // यहाँ resume text extraction logic जोड़ेगे

    // 🛠 1️⃣ Analyze Resume using AI
    const analysisResult = await analyzeResume(extractedText, jobDescription);

    // ✅ 2️⃣ Apply Fix Template
    const formattedResume = formatResumeTemplate(analysisResult);

    // ✅ 3️⃣ Save to Database
    const newResume = new Resume({
      fileName: req.file.filename,
      jobDescription: jobDescription,
      formattedResume: formattedResume,
      aiFeedback: analysisResult,
    });

    await newResume.save();
    console.log("✅ Resume saved to database");

    storedResume = { resumeText: extractedText, formattedResume, aiFeedback: analysisResult };

    res.json({
      formattedResume,
      feedback: analysisResult,
      message: "Resume processed successfully!",
    });
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ message: "Server error while processing resume" });
  }
};

// ✅ Get Stored Resume
export const getResume = (req, res) => {
  res.json(storedResume);
};
