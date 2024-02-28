const connectDB = require("../config/database");
const handler = {};

handler.createAssessment = (req, res) => {
  const { email, deadline, googleSheet1, googleSheet2 } = req.body;

  // TODO: Handle the google sheets

  // INSERT into DB
  // sql =
  //   "INSERT INTO assessments (email, deadline, status, googleSheet1, googleSheet2) VALUES (?,?,?,?,?)";
  // connectDB.query(
  //   sql,
  //   [email, deadline, "PENDING", googleSheet1, googleSheet2],
  //   (err, result) => {
  //     if (err) res.status(400).send({ message: err.message });
  //     res.status(200).json(result);
  //   }
  // );
};

module.exports = handler;
