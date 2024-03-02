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
    deadline: "",
  });

  const handleChange = (e) => {
    setInputFields({ ...inputFields, [e.target.name]: e.target.value });
  };
  const submitForAssessment = async (e) => {
    e.preventDefault();
    document.getElementById("submitBtn").disabled = true;

    const payload = { email: user.email, ...inputFields };

    const res = await fetch("http://localhost:5000/createAssessment", {
      method: "POST",
      cache: "no-cache",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      navigate("/dashboard");
    }
  };
  return user ? (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={submitForAssessment}
        className="bg-gray-100 rounded-lg p-8 flex flex-col border border-green-500 ring-1"
      >
        <div className="mx-auto">
          <span className="text-red-600 font-bold">NOTE:</span> Share your
          google sheets with this email:
        </div>
        <div className="font-bold underline mb-5 text-xs">
          automated-assessments@automated-assessment.iam.gserviceaccount.com
        </div>
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
          className="inputBox"
          title="Format: (Name,ID,Email)"
        />
        <label htmlFor="googleSheet2">Rubrics Sheet Link</label>
        <input
          name="googleSheet2"
          value={inputFields.googleSheet2}
          onChange={handleChange}
          type="url"
          placeholder="https://docs.google.com/spreadsheets/..."
          pattern="https://docs.google.com/spreadsheets/.*"
          required
          className="inputBox"
          title="Format: (Question, Level, Marks)"
        />
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
