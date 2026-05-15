import { Outlet } from "react-router-dom";
import { Sidebar } from "../sidebar/Sidebar";
import { useState } from "react";
import Navbar from "./Navbar";
import "./layout.css";

const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="layout d-flex">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      
      <div className="content flex-grow-1 min-vh-100">
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="container-fluid px-4">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="sidebar-overlay d-lg-none" 
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 998
          }}
        />
      )}
    </div>
  );
};

export { Layout };
