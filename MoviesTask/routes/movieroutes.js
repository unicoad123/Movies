import Express from "express";
import {
  MovieController,
  AddMovieContoller,
  longestRuntimes,
  genreSubtotalController,
  updateRuntimeMinutesController,
} from "../controllers/moviecontroller.js";
const router = Express.Router();

router.get("/movie", (req, res) => {
  res.json({ message: "Movie fecthed Successfully" });
});
router.get("/longest-duration-movies", longestRuntimes);
router.post("/addmoviecsv", MovieController);
router.post("/addmovie", AddMovieContoller);
router.get("/genre-movies-with-subtotles", genreSubtotalController);
router.put("/update-runtime-minutes", updateRuntimeMinutesController);

// router.get("/top-rating-movies", topRatedMoviesController);
export default router;
