import axios from "axios";

// 🛠 1️⃣ Resume Analysis Function
export const analyzeResume = async (resumeText, jobDescription) => {
  try {
    const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${process.env.GOOGLE_API_KEY}`;

    const prompt = `
      Analyze the following resume and compare it to the job description. Identify missing skills, strengths, areas for improvement, and provide a summary. 
      
      **Important:** Only return pure JSON. Do NOT include markdown (\`\`\`json) formatting. Example output:
      {
        "missingSkills": ["skill1", "skill2"],
        "strengths": ["strength1", "strength2"],
        "areasForImprovement": ["improvement1", "improvement2"],
        "feedbackSummary": "Brief summary of resume comparison."
      }
      
      **Resume:**
      ${resumeText}
      
      **Job Description:**
      ${jobDescription}
      
      **Output JSON:**
    `;

    const response = await axios.post(API_URL, {
      contents: [{ parts: [{ text: prompt }] }]
    });

    const aiResponse = response.data;

    if (!aiResponse || !aiResponse.candidates || !aiResponse.candidates[0].content.parts[0].text) {
      throw new Error("Invalid AI response format");
    }

    // ✅ Fix: Remove markdown (` ```json `) before parsing
    let rawText = aiResponse.candidates[0].content.parts[0].text.trim();
    if (rawText.startsWith("```json")) rawText = rawText.replace(/```json/, "").trim();
    if (rawText.endsWith("```")) rawText = rawText.replace(/```/, "").trim();

    return JSON.parse(rawText);
  } catch (error) {
    console.error("❌ Error in AI analysis:", error.response?.data || error.message);
    return { error: "AI processing failed" };
  }
};

// 🔄 2️⃣ Fix Resume Function
export const fixResumeErrors = async (resumeText, jobDescription) => {
  try {
    const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${process.env.GOOGLE_API_KEY}`;

    const prompt = `
      Identify and correct mistakes in this resume based on the job description. Ensure it is ATS-friendly.
      
      **Resume:**
      ${resumeText}

      **Job Description:**
      ${jobDescription}

      **Corrected Resume (Pure Text Output, No Formatting):**
    `;

    const response = await axios.post(API_URL, {
      contents: [{ parts: [{ text: prompt }] }]
    });

    const aiResponse = response.data;

    if (!aiResponse || !aiResponse.candidates || !aiResponse.candidates[0].content.parts[0].text) {
      throw new Error("Invalid AI response format");
    }

    return aiResponse.candidates[0].content.parts[0].text.trim();
  } catch (error) {
    console.error("❌ Error in Resume Fix:", error.response?.data || error.message);
    return "Error fixing resume.";
  }
};
