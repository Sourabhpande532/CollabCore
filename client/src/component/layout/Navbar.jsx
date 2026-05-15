import { useTheme } from '../../context/ThemeContext';

const Navbar = ({ toggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar glass-morphism sticky-top px-4 py-2 mb-4">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <button 
            className="btn d-lg-none me-3 p-0" 
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
          >
            <span className="fs-3">☰</span>
          </button>
          <h4 className="m-0 fw-bold d-lg-none">workasana</h4>
        </div>

        <div className="d-flex align-items-center gap-3">
          <button 
            className="theme-toggle-btn btn border-0 p-2 rounded-circle d-flex align-items-center justify-content-center"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            style={{ fontSize: '1.2rem', transition: 'transform 0.3s ease' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'rotate(30deg)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'rotate(0deg)'}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          
          <div className="user-profile d-flex align-items-center gap-2">
            <div className="avatar rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px', fontSize: '0.9rem' }}>
              U
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
