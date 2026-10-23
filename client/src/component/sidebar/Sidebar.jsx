import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./sidebar.css";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header d-flex justify-content-between align-items-center mb-4">
        <h5 className='logo m-0'>
          <Link to="/dashboard" onClick={() => setIsOpen(false)}>CollabCore</Link>
        </h5>
        <button
          type="button"
          className="btn d-lg-none p-1 close-sidebar-btn"
          onClick={() => setIsOpen(false)}
          aria-label="Close Sidebar"
        >
          ✕
        </button>
      </div>

      <Link to='/dashboard' onClick={() => setIsOpen(false)}>
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
      <Link to='/landing' onClick={() => setIsOpen(false)}>
        <span>🌐</span> Overview
      </Link>

      <div style={{ flexGrow: 1 }}></div>

      {isAuthenticated ? (
        <Link to='/login' className='logout-link' onClick={() => logout()}>
          <span>🚪</span> Logout
        </Link>
      ) : (
        <Link to='/login'>
          <span>🔑</span> Login
        </Link>
      )}
    </div>
  );
};

export { Sidebar };
