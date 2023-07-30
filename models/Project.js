import mongoose from "mongoose";

const { Schema, model,models } = mongoose;

const projectSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  category: {
    type:[String],
    required:true
  },
  language: {
    type: [String],
    required:true
  },
  image:{
    type:String,
    required:true
  },
  github: String,

});

const Project = models.Project || model("Project", projectSchema);
export default Project;
