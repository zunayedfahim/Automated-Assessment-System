const connectDB = require("../config/database");
const { getGoogleFormLink } = require("./getGoogleFormLink");
const handler = {};

handler.createAssessment = async (req, res) => {
  const { assessmentName, email, deadline, googleSheet1, googleSheet2 } =
    req.body;

  // TODO: Handle the google sheets, creates the google form, send mail to the students and returns the google form link
  const googleForm = await getGoogleFormLink(
    googleSheet1,
    googleSheet2,
    assessmentName,
    deadline
  );

  // INSERT into DB
  const sql =
    "INSERT INTO assessments (assessmentName, email, deadline, status, googleSheet1, googleSheet2, googleForm, formId) VALUES (?,?,?,?,?,?,?,?)";
  connectDB.query(
    sql,
    [
      assessmentName,
      email,
      deadline,
      "PENDING",
      googleSheet1,
      googleSheet2,
      googleForm.formLink,
      googleForm.formId,
    ],
    (err, result) => {
      if (err) res.status(400).send({ message: err.message });
      res.status(200).send({ message: "Assessment Created!" });
    }
  );
};

module.exports = handler;
