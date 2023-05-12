import mongoose from "mongoose";

const RatingModel = new mongoose.Schema({
  tconst: {
    type: mongoose.Schema.Types.String,
    ref: "movies",
  },
  averageRating: {
    type: Number,
    required: true,
  },
  numVotes: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("ratings", RatingModel);
