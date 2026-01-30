import { Outlet } from "react-router-dom";
import { Sidebar } from "../sidebar/Sidebar";

const Layout = () => {
  return (
    <div className='d-flex justify-content-around align-items-center'>
      <div>
        <Sidebar />
      </div>
      <Outlet />
    </div>
  );
};
export { Layout };
