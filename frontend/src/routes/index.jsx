// routes.jsx
import React from "react";
import MainLayout from "../layouts/MainLayout";
import { createHashRouter } from "react-router-dom";

import HomePage from "./HomePage";
import FilePage from "./43filePage";
import KPIOverview from "./KPIOverview";
import Other from "./Other";
import FormSurvey from "./FromSurvey/FormSurveyMain";
import FormA from "./FromSurvey/FormA";

export const routes = createHashRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },

      { path: "/kpi/:type", element: <KPIOverview /> },
      { path: "/files-43", element: <FilePage /> },
      { path: "/form-survey", element: <FormSurvey /> }, // ✅ หน้าเมนูหลัก
      { path: "/form-survey/hdc2026", element: <FormA /> },
      { path: "/other", element: <Other /> },
    ],
  },
]);

export default routes;
