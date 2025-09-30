import { Outlet, useRouterState } from "@tanstack/react-router";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import React from "react";

export default function MainLayout() {
  const router = useRouterState();
  const location = router.location; // เทียบกับ react-router-dom's useLocation
  const isHome = location.pathname === "/"; 

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      <div className="flex flex-1 overflow-hidden">
        <main className={isHome ? "flex-1 overflow-auto" : "flex-1 overflow-auto"}>
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}
