import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./sidebar.css";
const Sidebar = ({ isOpen, setIsOpen }) => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <h5 className='logo'>workasana</h5>

      <Link to='/' onClick={() => setIsOpen(false)}>
        Dashboard
      </Link>
      <Link to='/team' onClick={() => setIsOpen(false)}>
        Teams
      </Link>
      <Link to='/report' onClick={() => setIsOpen(false)}>
        Reports
      </Link>
      <Link to='/tasks' onClick={() => setIsOpen(false)}>
        Tasks
      </Link>

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
