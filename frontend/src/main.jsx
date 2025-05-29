// ✅ main.jsx (ใหม่): ใช้ RouterProvider แทน BrowserRouter
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx'

import './index.css';
ReactDOM.createRoot(document.getElementById('root')).render(

<BrowserRouter basename="/strategic-kpi-report-pyo/public">
    <App />
</BrowserRouter>
)