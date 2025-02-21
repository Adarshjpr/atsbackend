// import express from "express";
// import multer from "multer";
// import dotenv from "dotenv";
// import pdfParse from "pdf-parse"; // ✅ PDF Parsing
// import fetch from "node-fetch"; // ✅ Ensure fetch works

// dotenv.config();

// const router = express.Router();
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// // Function to analyze the resume using Gemini API
// const analyzeResume = async (text) => {
//   try {
//     const apiKey = process.env.GOOGLE_API_KEYS;
//     const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

//     const response = await fetch(url, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         contents: [
//           {
//             parts: [
//               {
//                 text: `
//                   Analyze this resume and provide the following details in the specific format, ensuring the titles are clearly marked in the appropriate box style:

// **[ATS Score]**
// **ATS Score (out of 100):**
// Provide the ATS score estimation based on the resume content. Mention any specific issues causing the score.

// **[Resume Strengths]**
// **Resume Strengths:**
// Provide an evaluation of the strengths of the resume. These could include key skills, relevant experience, or any other notable positive points.

// **[Resume Weaknesses]**
// **Resume Weaknesses:**
// Provide an evaluation of the weaknesses or gaps in the resume. Identify areas where improvements could be made, such as missing information or underdeveloped sections.

// **[Improvement Areas]**
// **Areas for Improvement:**
// Provide specific suggestions for improvement. These could include rewriting sections, adding or removing content, or other ways to optimize the resume for better results.

// Resume Text:
// ${text}
//                 `
//               }
//             ]
//           }
//         ]
//       })
//     });

//     const data = await response.json();
//     console.log("Complete API Response:", JSON.stringify(data, null, 2));

//     // Extract content from the response
//     const contentText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No content available";
//     console.log("Full Gemini Response Text:", contentText);

//     // Helper function to limit words to a certain number
//     const limitWords = (text, wordLimit) => {
//       const words = text.split(" ");
//       if (words.length > wordLimit) {
//         return words.slice(0, wordLimit).join(" ") + "...";
//       }
//       return text;
//     };

//     // Extracting ATS Score, Objective Evaluation, and Improvement Suggestions with updated regex
//     const atsScoreMatch = contentText.match(/ATS Score \(out of 100\):[\s\S]*?(\d{1,3}-\d{1,3}|\d{1,3})/);
//     const atsScore = atsScoreMatch ? atsScoreMatch[1].trim() : "Not available";

//    // Extracting Strengths
//    const strengthsMatch = contentText.match(/Resume Strengths:\s*([\s\S]*?)(?=\*\*|$)/);
//    const strengths = strengthsMatch ? strengthsMatch[1].trim() : "No strengths identified";
//    console.log("Extracted Strengths:", strengths);


//    // Extracting Weaknesses
//    const weaknessesMatch = contentText.match(/Resume Weaknesses:\s*([\s\S]*?)(?=\*\*|$)/);
//    const weaknesses = weaknessesMatch ? weaknessesMatch[1].trim() : "No weaknesses identified";

//    // Extracting Improvement Areas
//    const improvementSuggestionsMatch = contentText.match(/Areas for Improvement:\s*([\s\S]*?)(?=\*\*|$)/);
//    const improvementSuggestions = improvementSuggestionsMatch ? improvementSuggestionsMatch[1].trim() : "No suggestions available";

//    // Extracting Objective Evaluation if available
//    const objectiveEvaluationMatch = contentText.match(/Evaluation of the Resume's Objective Section:([\s\S]*?)(?=\*\*|$)/);
//    const objectiveEvaluation = objectiveEvaluationMatch ? objectiveEvaluationMatch[1].trim() : "No evaluation available";

//    // Formatting the content into a structured output
//    const formattedResponse = {
//      ATS_Score: limitWords(atsScore, 50),
//      Resume_Strengths: strengths,
//      Resume_Weaknesses: weaknesses,
//      Improvement_Areas: limitWords(improvementSuggestions, 50),
//      Objective_Evaluation: objectiveEvaluation
//    };

//    console.log("Formatted Response:", formattedResponse);

//    // Return structured response
//    return formattedResponse;
//   } catch (error) {
//     console.error("Error analyzing resume:", error);
//     return { Error: "Error analyzing resume." };
//   }
// };

// // Main route to handle resume upload and analysis
// router.post("/", upload.single("resume"), async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ status: "No file uploaded." });
//   }

//   let resumeText = "";

//   try {
//     // Extract text from PDF if uploaded file is a PDF
//     if (req.file.mimetype === "application/pdf") {
//       const pdfData = await pdfParse(req.file.buffer);
//       resumeText = pdfData.text;
//     } else {
//       // For non-PDF files, assume it's a plain text file
//       resumeText = req.file.buffer.toString("utf-8");
//     }

//     // Send the resume text for analysis
//     const analysis = await analyzeResume(resumeText);

//     // Return the structured analysis response
//     res.json({ analysis });

//   } catch (error) {
//     console.error("Error during file processing:", error);
//     res.status(500).json({ status: "Error processing the file." });
//   }
// });

// export default router;
import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import pdfParse from "pdf-parse"; // ✅ PDF Parsing
import fetch from "node-fetch"; // ✅ Ensure fetch works

dotenv.config();

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Function to analyze the resume using Gemini API
const analyzeResume = async (text) => {
  try {
    const apiKey = process.env.GOOGLE_API_KEYS;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `
Analyze this resume and provide the following structured data:
1. **ATS Score (out of 100)**
2. **Strengths** (Provide a list)
3. **Weaknesses** (Provide a list)
4. **Missing Keywords** (Provide a list)
5. **Improvement Areas** (Provide bullet points)

Resume Text:
${text}
                `
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();
    console.log("API Response:", JSON.stringify(data, null, 2));

    const contentText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI";

    // 🔥 Function to clean and extract data
    const cleanText = (text) => text.replace(/\*\*/g, "").trim();
    console.log("AI Response Text content text :", contentText);

    // Extract ATS Score
    const atsScoreMatch = contentText.match(/\*\*1\. ATS Score \(out of 100\):\*\*\s*(\d{1,3})/);
    const atsScore = atsScoreMatch ? atsScoreMatch[1].trim() : "Not available";

    console.log("Extracted ATS Score:", atsScore);

    
    

    // Extract Strengths
    const strengthsMatch = contentText.match(/2\. Strengths:\s*([\s\S]*?)(?=\n\n\*\*3|$)/);
    const strengths = strengthsMatch
      ? strengthsMatch[1]
          .split("\n")
          .map((s) => cleanText(s.replace(/\* /g, "")))
          .filter((s) => s)
      : ["No strengths found"];

    // Extract Weaknesses
    const weaknessesMatch = contentText.match(/3\. Weaknesses:\s*([\s\S]*?)(?=\n\n\*\*4|$)/);
    const weaknesses = weaknessesMatch
      ? weaknessesMatch[1]
          .split("\n")
          .map((w) => cleanText(w.replace(/\* /g, "")))
          .filter((w) => w)
      : ["No weaknesses found"];

    // Extract Missing Keywords
    const missingKeywordsMatch = contentText.match(/4\. Missing Keywords:\s*([\s\S]*?)(?=\n\n\*\*5|$)/);
    const missingKeywords = missingKeywordsMatch
      ? missingKeywordsMatch[1]
          .split("\n")
          .map((k) => cleanText(k.replace(/\* /g, "")))
          .filter((k) => k)
      : ["No missing keywords identified"];

    // Extract Improvement Areas
    const improvementAreasMatch = contentText.match(/5\. Improvement Areas:\s*([\s\S]*?)(?=$)/);
    const improvementAreas = improvementAreasMatch
      ? improvementAreasMatch[1]
          .split("\n")
          .map((imp) => cleanText(imp.replace(/\* /g, "")))
          .filter((imp) => imp)
      : ["No improvement suggestions"];

    return {
      ATS_Score: atsScore,
      Resume_Strengths: strengths,
      Resume_Weaknesses: weaknesses,
      Missing_Keywords: missingKeywords,
      Improvement_Areas: improvementAreas,
    };
  } catch (error) {
    console.error("Error analyzing resume:", error);
    return { Error: "Error analyzing resume." };
  }
};





// Main route to handle resume upload and analysis
router.post("/", upload.single("resume"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ status: "No file uploaded." });
  }

  let resumeText = "";

  try {
    // Extract text from PDF if uploaded file is a PDF
    if (req.file.mimetype === "application/pdf") {
      const pdfData = await pdfParse(req.file.buffer);
      resumeText = pdfData.text;
    } else {
      // For non-PDF files, assume it's a plain text file
      resumeText = req.file.buffer.toString("utf-8");
    }

    // Send the resume text for analysis
    const analysis = await analyzeResume(resumeText);

    // Return the structured analysis response
    res.json({ analysis });

  } catch (error) {
    console.error("Error during file processing:", error);
    res.status(500).json({ status: "Error processing the file." });
  }
});

export default router;

