require("dotenv").config();
const express = require("express");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "pdfFiles");
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now();
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

const app = express();
const cors = require("cors");

const { getAssessments } = require("./database/getAssessments");
const { createAssessment } = require("./database/createAssessment");
const { markResponses } = require("./database/markResponses");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// Get all the Asssessments from the DB
app.get("/getAssessments/:email", getAssessments);

// Create the Assessment form
app.post("/createAssessment", upload.array("pdf"), createAssessment);

// Marks the Form Responses
app.post("/markResponses", markResponses);

// Test the API
app.get("/test", async (req, res) => {
  const question =
    "Briefly define capacitors and inductors, and mention their essential functions in circuits.";
  const answer =
    "Capacitors store energy in an electric field, like a spring, and oppose changes in voltage. Inductors store energy in a magnetic field and resist changes in current.";
  const payload = { question, answer };

  const score = await fetch("http://127.0.0.1:8000/", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await score.json();

  console.log(data);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
