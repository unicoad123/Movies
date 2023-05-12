import fs from "fs";
import fastcsv from "fast-csv";
import con from "../config/connection.js";

export const RatingController = async (req, res) => {
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
      csvDataColl.shift();

      db.connect((error) => {
        if (error) {
          console.error(error);
        } else {
          let query =
            "INSERT INTO ratings (tconst,averageRating,numVotes) VALUES ?";
          db.query(query, [csvDataColl], (error, res) => {
            console.log(error || res);
          });
        }
      });
    });
  stream.pipe(csvStream);
};

export const topRatedMoviesController = async (req, res) => {
  const query = `select ratings.tconst,movies.primaryTitle,movies.genres,ratings.movieRatings from 
    movies,ratings where movies.tconst=ratings.tconst and
    ratings.movieRatings>6.0 order by ratings.movieRatings`;
  con.connect(function (err) {
    if (err) throw err;
    con.query(query, function (err, result) {
      if (err) throw err;
      else {
        res.status(200).json({
          result,
        });
      }
    });
  });
};
