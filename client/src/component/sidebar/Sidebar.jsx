import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./sidebar.css";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <aside
      className={`sidebar ${isOpen ? "open" : ""}`}
      aria-label='Workspace navigation'>
      <div className='sidebar-header d-flex justify-content-between align-items-center mb-4'>
        <h5 className='logo m-0'>
          <Link to='/' onClick={() => setIsOpen(false)}>
            ❖ CollabCore
          </Link>
        </h5>
        <button
          type='button'
          className='btn d-lg-none p-1 close-sidebar-btn'
          onClick={() => setIsOpen(false)}
          aria-label='Close Sidebar'>
          ✕
        </button>
      </div>

      <nav className='sidebar-nav d-flex flex-column gap-1'>
        <NavLink to='/dashboard' onClick={() => setIsOpen(false)}>
          <span className='sidebar-icon'>⊞</span> Dashboard
        </NavLink>
        <NavLink to='/project' onClick={() => setIsOpen(false)}>
          <span className='sidebar-icon'>▦</span> Project
        </NavLink>
        <NavLink to='/team' onClick={() => setIsOpen(false)}>
          <span className='sidebar-icon'>👥</span> Team
        </NavLink>
        <NavLink to='/report' onClick={() => setIsOpen(false)}>
          <span className='sidebar-icon'>📊</span> Reports
        </NavLink>
        <NavLink to='/tasks' onClick={() => setIsOpen(false)}>
          <span className='sidebar-icon'>✓</span> Tasks
        </NavLink>
      </nav>

      <div className='sidebar-footer mt-auto pt-3 border-top'>
        {isAuthenticated ? (
          <Link
            to='/login'
            className='logout-link'
            onClick={() => {
              setIsOpen(false);
              logout();
            }}>
            <span className='sidebar-icon'>↪</span> Logout
          </Link>
        ) : (
          <Link to='/login' onClick={() => setIsOpen(false)}>
            <span className='sidebar-icon'>🔑</span> Login
          </Link>
        )}
      </div>
    </aside>
  );
};

export { Sidebar };
