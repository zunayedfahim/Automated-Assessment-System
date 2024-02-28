import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGlobalStore } from "./store";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const user = useGlobalStore((state) => state.user);
  const [assessments, setAssessments] = useState([]);

  const fetchAssessments = async () => {
    const res = await fetch(
      `http://localhost:5000/getAssessments/${user.email}`
    );
    const data = await res.json();
    setAssessments(data);
  };
  useEffect(() => {
    fetchAssessments();
  }, [assessments]);

  return user ? (
    <div className="">
      <div className="flex justify-between m-5">
        <div className="text-3xl font-bold">Hello, {user.name}</div>
        <Link to="/newAssessment" className="customButton first-letter:text-lg">
          + Create New Assessment
        </Link>
      </div>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <h1 className="font-bold text-3xl mb-4">Your Assessments</h1>
          <div className="flex flex-wrap -m-4">
            {assessments.map((item, index) => {
              return (
                <div key={index} className="p-4 lg:w-1/3">
                  <div className="h-full bg-gray-100 shadow-lg bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden text-center relative">
                    <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
                      {item.status}
                    </h2>
                    <h1 className="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3">
                      Assessment {index + 1}
                    </h1>
                    <p className="leading-relaxed mb-3">
                      Deadlie - {new Date(item.deadline).toLocaleString()}
                    </p>
                    <Link
                      to="/dashboard"
                      className="text-green-500 inline-flex items-center"
                    >
                      Send Result
                      <svg
                        className="w-4 h-4 ml-2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14"></path>
                        <path d="M12 5l7 7-7 7"></path>
                      </svg>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  ) : (
    <Navigate to="/" />
  );
};

export default Dashboard;
