import fs from "fs";
import fastcsv from "fast-csv";
import con from "../config/connection.js";

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
      csvDataColl.shift();

      db.connect((error) => {
        if (error) {
          console.error(error);
        } else {
          let query =
            "INSERT INTO users (tconst,titleType,primaryTitle,runtimeMinutes,genres) VALUES ?";
          db.query(query, [csvDataColl], (error, res) => {
            console.log(error || res);
          });
        }
      });
    });
  stream.pipe(csvStream);
};

export const AddMovieContoller = (req, res, next) => {
  const { tconst, titleType, primaryTitle, runtimeMinutes, genres } = req.body;
  const query = `INSERT INTO movies(tconst,titleType,primaryTitle,runtimeMinutes,genres) values ("${tconst}","${titleType}","${primaryTitle}",${runtimeMinutes},"${genres}")`;
  const values = [tconst, titleType, primaryTitle, runtimeMinutes, genres];
  con.query(query, function (err, result) {
    if (err) throw err;
    else {
      res.status(201).json({
        message: "Data Inserted Successfully",
      });
    }
  });
};
//const query = `select tconst primaryTitle,runtimeMinutes,genres from movietask.movies order by runtimeMinutes DESC limit 10`;
export const genreSubtotalController = async (req, res) => {
  const query = `select a.genres,a.primaryTitle,sum(ratings.numVotes) as SubTotal from movies as a,movies as b,ratings
where a.genres=b.genres and a.tconst=ratings.tconst group by a.primaryTitle;
`;
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

export const longestRuntimes = async (req, res) => {
  const query = `select tconst,primaryTitle,runtimeMinutes,genres from movietask.movies order by runtimeMinutes DESC limit 10`;
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

export const updateRuntimeMinutesController = (req, res) => {
  const query = `
    UPDATE movietask.movies set movies.runtimeMinutes=case when movies.genres='Documentary' then movies.runtimeMinutes+15
    when movies.genres='Animation' then movies.runtimeMinutes+30
    when movies.genres!='Animation' AND movies.genres!='Documentary' then movies.runtimeMinutes+45
    else movies.runtimeMinutes
    end;`;
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
