import cvstojson from "csvtojson";
import Movie from "../models/moviesmodelmongo.js";
import fs from "fs";
import asyncHandler from "express-async-handler";
import fastcsv from "fast-csv";
import Rating from "../models/ratingmodelmongo.js";

export const MovieController = async (req, res) => {
  const stream = fs.createReadStream("./public/movies.csv");
  let csvData = [];
  let csvStream = fastcsv
    .parse()
    .on("data", function (data) {
      csvData.push({
        tconst: data[0],
        titleType: data[1],
        primaryTitle: data[2],
        runtimeMinutes: data[3],
        genres: data[4],
      });
    })
    .on("end", function () {
      csvData.shift();
      Movie.insertMany(csvData)
        .then(function () {
          console.log("Data Inserted");
          res.json({ success: "success" });
        })
        .catch(function (error) {
          console.log("Failed");
          console.log(error);
        });
    });
  stream.pipe(csvStream);
};

export const AddMovieContoller = asyncHandler(async (req, res) => {
  const { tconst, titleType, primaryTitle, runtimeMinutes, genres } = req.body;
  if (!tconst || !titleType || !primaryTitle || !runtimeMinutes || !genres) {
    res.status(400);
    throw new Error("All Fields are Required");
  }
  const existingtconst = await Movie.findOne({ tconst });
  if (existingtconst) {
    res.status(400);
    throw new Error("Movie already inserted");
  }
  const movie = await new Movie({
    tconst,
    titleType,
    primaryTitle,
    runtimeMinutes,
    genres,
  }).save();
  res.status(200).json(Movie);
});
export const MovieDurationController = async (req, res) => {
  try {
    const movie = await Movie.find({}).sort({ runtimeMinutes: -1 }).limit(10);
    res.status(200).send(movie);
  } catch (error) {
    res.json({ error });
  }
};
export const topRatedMoviesController = asyncHandler(async (req, res) => {
  const movierating = await Movie.aggregate([
    // {
    //   $lookup: {
    //     from: "ratings",
    //     let: { id: { $toString: "$_id" } },
    //     pipeline: [
    //       {
    //         $match: {
    //           averageRating: { $gt: 6.0 },
    //         },
    //       },
    //     ],
    //     as: "Ratings",
    //   },
    // },
    // // {
    // //   $sort: {
    // //     "Ratings.averageRating": -1,
    // //   },
    // // },
    {
      $lookup: {
        from: "ratings",
        localField: "tconst",
        foreignField: "tconst",
        pipeline: [
          {
            $match: {
              averageRating: { $gt: 6.0 },
            },
          },
        ],
        as: "Ratings",
      },
    },
    {
      $project: {
        Rating: "$Ratings.averageRating",
      },
    },
  ]).exec();
  if (!movierating) {
    res.status(400);
    throw new Error("No Data Retrieved");
  }
  res.json(movierating);
});
