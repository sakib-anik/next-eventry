import mongoose, { Schema } from "mongoose";

const schema = new Schema({
  name: {
    requred: true,
    type: String,
  },
  details: {
    requred: true,
    type: String,
  },
  loction: {
    requred: true,
    type: String,
  },
  imageUrl: {
    requred: true,
    type: String,
  },
  interested_ids: {
    required: false,
    type: Array,
  },
  going_ids: {
    required: false,
    type: Array,
  },
  swgs: {
    required: false,
    type: Array,
  },
});

export const eventModel =
  mongoose.models.events ?? mongoose.model("events", schema);
