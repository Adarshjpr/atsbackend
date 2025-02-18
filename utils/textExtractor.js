export const calculateATSScore = (resumeText, jobDescription) => {
    console.log("🚀 [ATS SCORE FUNCTION CALLED]");

    if (!resumeText || !jobDescription) {
        console.log("❌ [ERROR] Resume Text or Job Description is missing!");
        return 0;
    }

    console.log("📄 [RESUME TEXT - FIRST 300 CHARS]:", resumeText.substring(0, 300) || "❌ EMPTY");
    console.log("📄 [JOB DESCRIPTION - FIRST 300 CHARS]:", jobDescription.substring(0, 300) || "❌ EMPTY");

    const resumeWords = resumeText.toLowerCase().match(/\b\w+\b/g) || [];
    const jobWords = jobDescription.toLowerCase().match(/\b\w+\b/g) || [];

    console.log("📌 [RESUME WORD COUNT]:", resumeWords.length);
    console.log("📌 [JOB DESCRIPTION WORD COUNT]:", jobWords.length);

    if (resumeWords.length === 0 || jobWords.length === 0) {
        console.log("❌ [ERROR] Resume or Job Description has no words!");
        return 0;
    }

    const matchingWords = jobWords.filter(word => resumeWords.includes(word));

    console.log("✅ [MATCHING WORD COUNT]:", matchingWords.length);
    console.log("✅ [MATCHING WORDS - FIRST 50]:", matchingWords.slice(0, 50));

    const matchPercentage = (matchingWords.length / jobWords.length) * 90;

    console.log("🔥 [FINAL ATS SCORE]:", matchPercentage.toFixed(2));

    return Math.round(matchPercentage);
};
