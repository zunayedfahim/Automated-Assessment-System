import React from "react";
import { Link } from "react-router-dom";
import { useGlobalStore } from "./store";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const user = useGlobalStore((state) => state.user);

  return user ? (
    <div>
      <div>Hello, {user.name}</div>
      <Link to="/newAssessment" className="border">
        Create New Assessment
      </Link>
    </div>
  ) : (
    <Navigate to="/" />
  );
};

export default Dashboard;
