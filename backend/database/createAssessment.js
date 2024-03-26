const connectDB = require("../config/database");
const { getGoogleFormLink } = require("./getGoogleFormLink");
const fs = require("fs");
const pdf = require("pdf-parse");
const handler = {};

handler.createAssessment = async (req, res) => {
  const { assessmentName, email, deadline, googleSheet1, googleSheet2 } =
    req.body;

  // Handle the pdf files
  let pdfTexts = [];
  for (let i = 0; i < req.files.length; i++) {
    let dataBuffer = fs.readFileSync(req.files[i].path);

    await pdf(dataBuffer).then(function (data) {
      // PDF text
      pdfTexts.push(data.text);
    });
  }

  // Handle the google sheets, creates the google form, send mail to the students and returns the google form link
  const googleForm = await getGoogleFormLink(
    googleSheet1,
    googleSheet2,
    assessmentName,
    deadline
  );

  // INSERT into DB
  const sql =
    "INSERT INTO assessments (assessmentName, email, deadline, status, googleSheet1, googleSheet2, googleForm, formId, pdfText) VALUES (?,?,?,?,?,?,?,?,?)";
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
      // "",
      // "",
      pdfTexts.join("\n###\n"),
    ],
    (err, result) => {
      if (err) res.status(400).send({ message: err.message });
      res.status(200).send({ message: "Assessment Created!" });
    }
  );
};

module.exports = handler;
