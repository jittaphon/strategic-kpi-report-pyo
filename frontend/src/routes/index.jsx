import React from "react";
import MainLayout from '../layouts/MainLayout';
import { createHashRouter } from "react-router-dom";
import HomePage from './HomePage';
import FilePage from './43filePage';
import KPIOverview from './KPIOverview';
import Other from './Other';

export const routes = createHashRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // หน้าแรก
      { 
        index: true, 
        element: <HomePage /> 
      },
      
      // KPI Routes - แก้ไขจาก report/:type เป็น kpi/:type
      {
        path: 'kpi/:type',
        element: <KPIOverview />,
      },
      
      // หน้า 43 Files
      {
        path: 'files-43',
        element: <FilePage />,
      },
      
      // หน้า Other - แก้ไขเป็นตัวพิมพ์เล็ก
      {
        path: 'other',
        element: <Other />,
      },
    ],
  },
]);

export default routes;