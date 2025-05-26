import KPIOverview from './KPIOverview';
import MainLayout from '../layouts/MainLayout';
import React from "react";

export const routes = [
  {
    path: '/',
    element: <MainLayout />, // Layout หลัก ที่มี Navbar, Sidebar
    children: [
      {
        path: 'report/:type',   // เข้าผ่าน /report/tele_med
        element: <KPIOverview />,  // หรือหน้าอื่นถ้ามี
      },
     
    ],
  },
];