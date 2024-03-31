import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Dashboard from "./Dashboard";
import NewAssessment from "./NewAssessment";
import { Navigate } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Navigate to="/" />,
  },

  {
    path: "/dashboard",
    element: <Dashboard />,
  },

  {
    path: "/newAssessment",
    element: <NewAssessment />,
  },
]);
