// ✅ routes.js (หรือ index.jsx) – ใช้ createBrowserRouter แบบถูกต้อง
import React from "react";
import KPIOverview from './KPIOverview';
import MainLayout from '../layouts/MainLayout';
import { createBrowserRouter } from "react-router-dom";

export const routes = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />, // ✅ Layout หลัก ที่ไม่ re-mount ซ้ำ
    children: [
      {
        path: 'report/:type',
        element: <KPIOverview />,
      },
    ],
  },
]);
