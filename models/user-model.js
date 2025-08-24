import mongoose, { Schema } from "mongoose";

const schema = new Schema({
  name: {
    requred: true,
    type: String,
  },
  email: {
    requred: true,
    type: String,
  },
  password: {
    requred: true,
    type: String,
  },
  phone: {
    requred: true,
    type: String,
  },
  bio: {
    requred: true,
    type: String,
  },
});

export const userModel =
  mongoose.models.users ?? mongoose.model("users", schema);
