// import mongoose from "mongoose";

// const connectDB = async () => {
//   try {
//     const connect = await mongoose.connect(process.env.MONGO_URL);
//     console.log(
//       "Database Connected",
//       connect.connection.host,
//       connect.connection.name
//     );
//   } catch (error) {
//     console.log(error);
//     process.exit(1);
//   }
// };

// export default connectDB;

import mysql from "mysql";
const connectDB = async (req, res) => {
  const con = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "movietask",
  });
  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
  });
};

export default connectDB;
