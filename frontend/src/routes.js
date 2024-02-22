import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Dashboard from "./Dashboard";
import NewAssessment from "./NewAssessment";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
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
