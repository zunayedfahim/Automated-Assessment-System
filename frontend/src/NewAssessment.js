import React from "react";
import { useGlobalStore } from "./store";
import { Navigate, useNavigate } from "react-router-dom";

const NewAssessment = () => {
  const user = useGlobalStore((state) => state.user);
  const navigate = useNavigate();
  const submitForAssessment = () => {
    navigate("/dashboard");
  };
  return user ? (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={submitForAssessment}
        className="bg-gray-100 rounded-lg p-8 flex flex-col border border-green-500 ring-1"
      >
        <div>
          Share your sheets with this email -
          automated-assessments@automated-assessment.iam.gserviceaccount.com
        </div>
        <label htmlFor="google-sheet-1">Google Sheet 1:</label>
        <input
          name="google-sheet-1"
          type="url"
          placeholder="https://docs.google.com/spreadsheets/..."
          pattern="https://docs.google.com/spreadsheets/.*"
          required
          size="50"
          className="inputBox"
        />
        <label htmlFor="google-sheet-2">Google Sheet 2:</label>
        <input
          name="google-sheet-2"
          type="url"
          placeholder="https://docs.google.com/spreadsheets/..."
          pattern="https://docs.google.com/spreadsheets/.*"
          required
          className="inputBox"
        />
        <label htmlFor="deadline">Deadline:</label>
        <input
          name="deadline"
          type="datetime-local"
          className="inputBox"
          min={new Date().toISOString().split(":").slice(0, -1).join(":")}
          required
        />

        <button type="submit" className="customButton m-5">
          Submit
        </button>
      </form>
    </div>
  ) : (
    <Navigate to="/" />
  );
};

export default NewAssessment;
