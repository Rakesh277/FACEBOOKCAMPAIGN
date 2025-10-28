import mongoose from "mongoose"; // ✅ Add this line at the top

const AudienceSchema = new mongoose.Schema({
  minAge: String,
  maxAge: String,
  gender: String,
  location: String,
  interests: String,
  language: String,
});

export const AudienceModel = mongoose.model("Audience", AudienceSchema, "audiences");