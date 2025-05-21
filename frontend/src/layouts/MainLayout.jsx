import NavBar from '../components/NavBar';
import {Outlet} from "react-router-dom";
import React from "react";
export default function MainLayout() {
  return (
    <>
    <NavBar/>
    <main>
        <Outlet />{}
        </main>  
    </>
  );
}