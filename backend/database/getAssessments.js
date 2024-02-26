const connectDB = require("../config/database");
const handler = {};

handler.getAssessments = (req, res) => {
  const sqlSelect = "SELECT * FROM assessments";
  connectDB.query(sqlSelect, (err, result) => {
    if (err) res.status(400).send({ message: err.message });
    res.status(200).json(result);
  });
};

module.exports = handler;
