require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const { getAssessments } = require("./database/getAssessments");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// Get all the Asssessments from the DB
app.get("/getAssessments", getAssessments);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
