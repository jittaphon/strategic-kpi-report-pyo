// routes/index.tsx
import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import React from 'react'
import MainLayout from '../layouts/MainLayout'
import HomePage from './HomePage'
import FilePage from './43filePage'
import KPIOverview from './KPIOverview' // ← เพิ่ม import
import Other from './Other';

const rootRoute = createRootRoute({
  component: () => (
    <div>
      <MainLayout />
    </div>
  ),
})

// หน้า Home
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <HomePage />,
})

// หน้า 43 Files
const filesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/files-43',
  component: () => <FilePage />,
})

// หน้า KPI แบบ Dynamic Route (รับ parameter :type)
const kpiRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/kpi/$type', // ← ใช้ $type สำหรับ dynamic parameter
  component: () => <KPIOverview />,
})

const Others = createRoute({
  getParentRoute: () => rootRoute,
  path: '/Other', // ← ใช้ $type สำหรับ dynamic parameter
  component: () => <Other />,
})


// รวม routes ทั้งหมด
const routeTree = rootRoute.addChildren([
  indexRoute, 
  filesRoute, 
  kpiRoute, 
  Others,   // ← เพิ่ม KPI dynamic route

])

export const router = createRouter({
  routeTree,
  basepath: '/datahub/strategic-kpi-report-pyo/public/',
})