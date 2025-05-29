// ✅ routes.js (หรือ index.jsx) – ใช้ createBrowserRouter แบบถูกต้อง
import React from "react";
import MainLayout from '../layouts/MainLayout';
import { createBrowserRouter } from "react-router-dom";

import KPIOverview from './KPIOverview';
import HomePage from './HomePage';

export const routes = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    // ✅ Layout หลัก ที่ไม่ re-mount ซ้ำ
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'report/:type',
        element: <KPIOverview />,
      },
    ],
  },
], {
  basename: "/", // <<< สำคัญ
  //basename: "/strategic-kpi-report-pyo/public", // <<< สำคัญ
});
