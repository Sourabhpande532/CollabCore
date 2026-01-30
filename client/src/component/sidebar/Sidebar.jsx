import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
const Sidebar = () => {
  const { isAuthenticated, logout } = useAuth();
  return (
    <div style={{ height: "400px" }} className='shadow-lg bg-info'>
      <h2 className='fw-bold'>Workasana</h2>
      <ul className=''>
        <div className='nav-item'>
          <Link to='/' className='nav-link'>
            Dashboard
          </Link>
        </div>
        <div className='nav-item'>
          <Link to='/project' className='nav-link'>
            Project
          </Link>
        </div>
        <div className='nav-item'>
          <Link to='/team' className='nav-link'>
            Team
          </Link>
        </div>
        <div className='nav-item'>
          <Link to='/report' className='nav-link'>
            Reports
          </Link>
        </div>
        <div className='nav-item'>
          <Link to='/setting' className='nav-link'>
            Setting
          </Link>
        </div>
        {isAuthenticated ? (
          <div className='nav-item'>
            <button
              onClick={() => {
                logout();
                <Navigate to='/login' replace />;
              }}
              to='/login'
              className='nav-link'>
              logout
            </button>
          </div>
        ) : (
          <div className='nav-item'>
            <Link to='/login' className='nav-link'>
              login
            </Link>
          </div>
        )}
      </ul>
    </div>
  );
};
export { Sidebar };
