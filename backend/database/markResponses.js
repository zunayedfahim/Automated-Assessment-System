const connectDB = require("../config/database");
const { getFormResponses } = require("./getFormResponses");

const handler = {};

handler.markResponses = async (req, res) => {
  const { formId, email, assessmentName } = req.body;

  const { spreadsheetId, spreadsheetUrl } = await getFormResponses(
    formId,
    assessmentName,
    email
  );

  // Update assessment table
  sql =
    "UPDATE assessments SET resultSheet=?, status=? WHERE email=? AND formId=?";
  connectDB.query(
    sql,
    [spreadsheetUrl, "FINISHED", email, formId],
    function (err, result) {
      if (err) res.status(400).send({ message: err.message });
      res.status(200).send({ message: "Finished Assessment." });
    }
  );
};

module.exports = handler;
