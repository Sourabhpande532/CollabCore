import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./sidebar.css";
const Sidebar = () => {
  const { isAuthenticated, logout } = useAuth();
  return (
    <div className='sidebar'>
      <h5 className='logo'>workasana</h5>
      <Link to='/'>Dashboard</Link>
      <Link
        to={
          localStorage.getItem("activeProject")
            ? `/project/${localStorage.getItem("activeProject")}`
            : "/project"
        }>
        Projects
      </Link>
      <Link to='/team'>Teams</Link>
      <Link to='/report'>Reports</Link>
      <Link to='/tasks'>Tasks</Link>
      {isAuthenticated ? (
        <Link to='/login' onClick={() => logout()}>
          Logout
        </Link>
      ) : (
        <Link to='/login'>Login</Link>
      )}
    </div>
  );
};
export { Sidebar };
