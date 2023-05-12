import Express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import MovieRoutes from "./routes/movieroutes.js";
import RatingRoutes from "./routes/ratingroutes.js";
import bodyParser from "body-parser";
import express from "express";

const PORT = process.env.port || 8000;
const app = Express();
dotenv.config();
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
connectDB();
app.use("/api/v1/", MovieRoutes);
app.use("/api/v1/", RatingRoutes);
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
