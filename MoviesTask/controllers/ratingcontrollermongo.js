import cvstojson from "csvtojson";
import ratings from "../models/ratingmodelmongo.js";
import fs from "fs";
import asyncHandler from "express-async-handler";
import fastcsv from "fast-csv";

export const RatingController = async (req, res) => {
  const stream = fs.createReadStream("./public/ratings.csv");
  let csvData = [];
  let csvStream = fastcsv
    .parse()
    .on("data", function (data) {
      csvData.push({
        tconst: data[0],
        averageRating: data[1],
        numVotes: data[2],
      });
    })
    .on("end", function () {
      csvData.shift();
      ratings
        .insertMany(csvData)
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
