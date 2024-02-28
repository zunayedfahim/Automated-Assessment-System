const connectDB = require("../config/database");
const handler = {};

handler.getAssessments = (req, res) => {
  const email = req.params.email;
  const sqlSelect = "SELECT * FROM assessments WHERE email=?";
  connectDB.query(sqlSelect, [email], (err, result) => {
    if (err) res.status(400).send({ message: err.message });
    res.status(200).json(result);
  });
};

module.exports = handler;
