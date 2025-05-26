import NavBar from '../components/NavBar';
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import React from "react";

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-4">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}
