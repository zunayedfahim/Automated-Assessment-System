import React, { useState } from "react";
import { useGlobalStore } from "./store";
import { Navigate, useNavigate } from "react-router-dom";

const NewAssessment = () => {
  const user = useGlobalStore((state) => state.user);
  const navigate = useNavigate();
  const [inputFields, setInputFields] = useState({
    assessmentName: "",
    googleSheet1: "",
    googleSheet2: "",
    pdf: null,
    deadline: "",
  });

  const handleChange = (e) => {
    setInputFields({ ...inputFields, [e.target.name]: e.target.value });
  };
  const submitForAssessment = async (e) => {
    e.preventDefault();
    document.getElementById("submitBtn").disabled = true;

    // const payload = { email: user.email, ...inputFields };
    let payload = new FormData();
    payload.append("email", user.email);
    payload.append("assessmentName", inputFields.assessmentName);
    payload.append("googleSheet1", inputFields.googleSheet1);
    payload.append("googleSheet2", inputFields.googleSheet2);
    payload.append("deadline", inputFields.deadline);

    for (let i = 0; i < inputFields.pdf.length; i++) {
      payload.append("pdf", inputFields.pdf[i]);
    }

    // Display the key/value pairs
    // for (var pair of payload.entries()) {
    //   console.log(pair[0] + ", " + pair[1]);
    // }

    // const res = await fetch("http://localhost:5000/uploadPdf", {
    //   method: "POST",
    //   cache: "no-cache",
    //   body: payload,
    //   // headers: {
    //   //   "Content-Type": "multipart/form-data",
    //   // },
    // });

    // const data = await res.json();
    // console.log(data.message);

    const res = await fetch("http://localhost:5000/createAssessment", {
      method: "POST",
      cache: "no-cache",
      body: payload,
      // headers: {
      //   "Content-Type": "application/json",
      // },
    });

    if (res.ok) {
      navigate("/dashboard");
    }
  };
  return user ? (
    <div className="flex items-center justify-center my-10">
      <form
        onSubmit={submitForAssessment}
        className="bg-gray-100 rounded-lg p-8 flex flex-col border border-green-500 ring-1"
        encType="multipart/form-data"
        method="post"
      >
        <div className="mx-auto">
          <span className="text-red-600 font-bold">NOTE:</span> Share your
          google sheets with this email:
        </div>
        <div className="font-bold underline mb-5 text-xs">
          automated-assessments@automated-assessment.iam.gserviceaccount.com
        </div>

        {/* Assessment Name input */}
        <label htmlFor="assessmentName">Assessment Name</label>
        <input
          autoFocus
          name="assessmentName"
          value={inputFields.assessmentName}
          onChange={handleChange}
          type="text"
          placeholder="CSE323 Quiz"
          required
          size="50"
          className="inputBox"
        />

        {/* Email sheet link input */}
        <label htmlFor="googleSheet1">Email Sheet Link</label>
        <input
          name="googleSheet1"
          value={inputFields.googleSheet1}
          onChange={handleChange}
          type="url"
          placeholder="https://docs.google.com/spreadsheets/..."
          pattern="https://docs.google.com/spreadsheets/.*"
          required
          size="50"
          className="inputBox mb-0"
          title="https://docs.google.com/spreadsheets/..."
        />
        <p className="mb-5 text-xs">Format: (Name,ID,Email)</p>

        {/* Rubrics sheet link input */}
        <label htmlFor="googleSheet2">Rubrics Sheet Link</label>
        <input
          name="googleSheet2"
          value={inputFields.googleSheet2}
          onChange={handleChange}
          type="url"
          placeholder="https://docs.google.com/spreadsheets/..."
          pattern="https://docs.google.com/spreadsheets/.*"
          required
          className="inputBox mb-0"
          title="https://docs.google.com/spreadsheets/..."
        />
        <p className="mb-5 text-xs">Format: (Question, Level, Marks)</p>

        {/* PDF files input */}
        <label htmlFor="pdf">PDF Files</label>
        <input
          type="file"
          name="pdf"
          accept=".pdf"
          onChange={(e) => {
            setInputFields({ ...inputFields, pdf: e.target.files });
          }}
          className="inputBox"
          multiple
          required
        />

        {/* Deadline input */}
        <label htmlFor="deadline">Deadline</label>
        <input
          name="deadline"
          value={inputFields.deadline}
          onChange={handleChange}
          type="date"
          className="inputBox"
          min={new Date().toISOString().split("T")[0]}
          required
        />

        {/* Submit button */}
        <button
          id="submitBtn"
          type="submit"
          className="customButton m-5 disabled:bg-green-400 disabled:text-gray-400"
        >
          Submit
        </button>
      </form>
    </div>
  ) : (
    <Navigate to="/" />
  );
};

export default NewAssessment;
