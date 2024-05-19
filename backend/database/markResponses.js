const connectDB = require("../config/database");
const { getFormResponses } = require("./getFormResponses");

const handler = {};

handler.markResponses = async (req, res) => {
  const { formId, email, assessmentName, resultSheetId } = req.body;

  const { spreadsheetId } = await getFormResponses(
    formId,
    assessmentName,
    email,
    resultSheetId
  );

  // Update assessment table
  // sql =
  //   "UPDATE assessments SET resultSheet=?, status=? WHERE email=? AND formId=?";
  // connectDB.query(
  //   sql,
  //   [spreadsheetUrl, "FINISHED", email, formId],
  //   function (err, result) {
  //     if (err) res.status(400).send({ message: err.message });
  //     res.status(200).send({ spreadsheetUrl });
  //   }
  // );

  res.status(200).send({ message: "Form Responses Marked" });
};

module.exports = handler;
