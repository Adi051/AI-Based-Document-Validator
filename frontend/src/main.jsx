import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./Router/Router.jsx";
import "./index.css";
import { Chart } from "chart.js";



ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
