import React from "react";
import { Link } from "react-router-dom";
import { useGlobalStore } from "./store";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const user = useGlobalStore((state) => state.user);

  return user ? (
    <div className="">
      <div className="flex justify-between m-5">
        <div className="text-3xl font-bold">Hello, {user.name}</div>
        <Link to="/newAssessment" className="customButton first-letter:text-lg">
          + Create New Assessment
        </Link>
      </div>
      <section class="text-gray-600 body-font">
        <div class="container px-5 py-24 mx-auto">
          <h1 className="font-bold text-3xl mb-2">Your Assessments</h1>
          <div class="flex flex-wrap -m-4">
            {[1, 2, 3].map(() => {
              return (
                <div class="p-4 lg:w-1/3">
                  <div class="h-full bg-gray-100 bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden text-center relative">
                    <h2 class="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
                      PENDING
                    </h2>
                    <h1 class="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3">
                      Assessment 1
                    </h1>
                    <p class="leading-relaxed mb-3">
                      Photo booth fam kinfolk cold-pressed sriracha leggings
                      jianbing microdosing tousled waistcoat.
                    </p>
                    <a class="text-green-500 inline-flex items-center">
                      Send Result
                      <svg
                        class="w-4 h-4 ml-2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M5 12h14"></path>
                        <path d="M12 5l7 7-7 7"></path>
                      </svg>
                    </a>
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
