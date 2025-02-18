import express from "express";
import { fixResumeErrors } from "../utils/analyzeResume.js";
import { storeResume, getResume } from  "../controllers/resumeController.js"
const router = express.Router();

router.post("/upload", storeResume);
router.get("/get", getResume);
// 🛠 API to Fix Resume
router.post("/fixResume", async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;
    if (!resumeText || !jobDescription) {
      return res.status(400).json({ message: "Missing resume or job description" });
    }

    const fixedResume = await fixResumeErrors(resumeText, jobDescription);
    res.json({ fixedResume });
  } catch (error) {
    console.error("❌ Error in Fix Resume API:", error);
    res.status(500).json({ message: "Server error while fixing resume" });
  }
});

export default router;
