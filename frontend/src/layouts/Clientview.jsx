import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const Clientview = () => {
  return (
    <div className="d-flex">
      
      {/* LEFT SIDEBAR */}
      <Sidebar />

      {/* RIGHT SIDE */}
      <div className="main-content flex-grow-1">
        <Navbar />

        {/* Page Content Rendered Here */}
        <div className="p-2">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Clientview;
