import mongoose from "mongoose";

const { Schema, model,models } = mongoose;

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

const Category = models.Category || model("Category", categorySchema);
export default Category;