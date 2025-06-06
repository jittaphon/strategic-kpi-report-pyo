// routes.js
import React from "react";
import MainLayout from '../layouts/MainLayout';
import { createHashRouter } from "react-router-dom"; // ✅ เปลี่ยนจาก createBrowserRouter

import KPIOverview from './KPIOverview';
import HomePage from './HomePage';

export const routes = createHashRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'report/:type',
        element: <KPIOverview />,
      },
    ],
  },
]);

// ❌ ไม่ต้องมี basename อีกแล้ว เพราะ HashRouter ไม่สน path จริงบน server
