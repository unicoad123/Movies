import mongoose from "mongoose";

const MovieModel = new mongoose.Schema({
  tconst: {
    type: String,
    required: true,
  },
  titleType: {
    type: String,
    required: true,
  },
  primaryTitle: {
    type: String,
    required: true,
  },
  runtimeMinutes: {
    type: Number,
    required: true,
  },
  genres: {
    type: String,
    required: true,
  },
});

export default mongoose.model("movies", MovieModel);
