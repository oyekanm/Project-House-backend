import mongoose from "mongoose";

const { Schema, model,models } = mongoose;

const languageSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

const Language = models.Language || model("Language", languageSchema);
export default Language;