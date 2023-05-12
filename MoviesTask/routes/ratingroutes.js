import Express from "express";
import {
  RatingController,
  topRatedMoviesController,
} from "../controllers/ratingcontroller.js";

const router = Express.Router();

router.post("/addratings", RatingController);
router.get("/top-rated-movies", topRatedMoviesController);

export default router;
