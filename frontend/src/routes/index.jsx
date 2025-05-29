import KPIOverview from './KPIOverview';
import MainLayout from '../layouts/MainLayout';
import React from "react";

export const routes = [
  {
    path: '/',
    element: <MainLayout />,
      children: [
      {
        path: 'report/:type',
        element: <KPIOverview />,
      },
    ],
  },
];
