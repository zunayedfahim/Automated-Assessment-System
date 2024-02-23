import React from "react";
import { useGlobalStore } from "./store";
import { Navigate } from "react-router-dom";

const NewAssessment = () => {
  const user = useGlobalStore((state) => state.user);
  return user ? <div>NewAssessment</div> : <Navigate to="/" />;
};

export default NewAssessment;
