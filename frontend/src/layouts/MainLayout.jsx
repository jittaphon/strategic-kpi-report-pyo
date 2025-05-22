import NavBar from '../components/NavBar';
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import {Outlet} from "react-router-dom";
import React from "react";
export default function MainLayout() {
  return (
    <>
    <NavBar/>
    <Sidebar/>
    <main>
        <Outlet />{}
        </main>  
    <Footer/>
    </>

  );
}