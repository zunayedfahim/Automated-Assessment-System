const connectDB = require("../config/database");
const { getGoogleFormLink } = require("./getGoogleFormLink");
const fs = require("fs");
const pdf = require("pdf-parse");
const handler = {};
const path = require("path");

handler.createAssessment = async (req, res) => {
  const {
    assessmentName,
    email,
    deadline,
    googleSheet1,
    googleSheet2,
    directory,
  } = req.body;

  // Handle the pdf files
  let pdfTexts = [];
  let files = "";
  for (let i = 0; i < req.files.length; i++) {
    let dataBuffer = fs.readFileSync(req.files[i].path);
    files += req.files[i].filename + ",";

    await pdf(dataBuffer).then(function (data) {
      // PDF text
      pdfTexts.push(data.text);
    });
  }

  let payload = {};

  if (files === "") {
    const allFiles = fs
      .readdirSync(directory)
      .filter((file) => file.endsWith(".pdf"))
      .map((file) => path.join(directory, file));

    files = allFiles.join(",");
    payload = { directory };
  }

  console.log(files);

  payload = { ...payload, files };

  await fetch("http://127.0.0.1:8000/insert", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Handle the google sheets, creates the google form, send mail to the students and returns the google form link
  const { formLink, formId, spreadsheetId, spreadsheetUrl } =
    await getGoogleFormLink(
      email,
      googleSheet1,
      googleSheet2,
      assessmentName,
      deadline
    );

  // INSERT into DB
  const sql =
    "INSERT INTO assessments (assessmentName, email, deadline, status, googleSheet1, googleSheet2, googleForm, formId, pdfText, resultSheet, resultSheetId) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
  connectDB.query(
    sql,
    [
      assessmentName,
      email,
      deadline,
      "PENDING",
      googleSheet1,
      googleSheet2,
      formLink,
      formId,
      // "",
      // "",
      pdfTexts.join("\n###\n"),
      spreadsheetUrl,
      spreadsheetId,
    ],
    (err, result) => {
      if (err) res.status(400).send({ message: err.message });
      res.status(200).send({ resultSheetUrl: spreadsheetUrl });
    }
  );
};

module.exports = handler;
