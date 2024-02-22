import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div>
      <div>Dashboard</div>
      <Link to="/newAssessment" className="border">
        Create New Assessment
      </Link>
    </div>
  );
};

export default Dashboard;
