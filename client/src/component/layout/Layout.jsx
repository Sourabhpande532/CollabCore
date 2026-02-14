import { Outlet } from "react-router-dom";
import { Sidebar } from "../sidebar/Sidebar";
import { useState } from "react";
import "./layout.css";

const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="layout">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="content">
        {/* Toggle Button (only mobile) */}
        <button
          className="menu-toggle"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>

        <Outlet />
      </div>
    </div>
  );
};

export { Layout };
