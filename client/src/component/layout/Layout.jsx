import { Outlet } from "react-router-dom";
import { Sidebar } from "../sidebar/Sidebar";
import "./layout.css";
const Layout = () => {
  return (
    <div className='layout'>
      <Sidebar />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};
export { Layout };
