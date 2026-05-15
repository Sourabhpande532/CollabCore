import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./sidebar.css";
const Sidebar = ({ isOpen, setIsOpen }) => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <h5 className='logo'>workasana</h5>

      <Link to='/' onClick={() => setIsOpen(false)}>
        <span>📊</span> Dashboard
      </Link>
      <Link to='/team' onClick={() => setIsOpen(false)}>
        <span>👥</span> Teams
      </Link>
      <Link to='/report' onClick={() => setIsOpen(false)}>
        <span>📈</span> Reports
      </Link>
      <Link to='/tasks' onClick={() => setIsOpen(false)}>
        <span>✅</span> Tasks
      </Link>

      <div style={{ flexGrow: 1 }}></div>

      {isAuthenticated ? (
        <Link to='/login' className="logout-link" onClick={() => logout()}>
          <span>🚪</span> Logout
        </Link>
      ) : (
        <Link to='/login'><span>🔑</span> Login</Link>
      )}
    </div>
  );
};

export { Sidebar };
