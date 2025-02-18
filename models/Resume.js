import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema({
  fileName: String,
  jobDescription: String,
  atsScore: Number,
});

export default mongoose.model("Resume", ResumeSchema);
