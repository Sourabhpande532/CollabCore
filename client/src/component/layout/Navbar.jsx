import { useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { getInitials } from "../../utils/uiHelpers";

const getPageHeading = (pathname) => {
  if (pathname.startsWith("/dashboard")) return "Workspace Dashboard";
  if (pathname.startsWith("/project/")) return "Project Management";
  if (pathname.startsWith("/project")) return "Projects Directory";
  if (pathname.startsWith("/tasks/")) return "Task Details";
  if (pathname.startsWith("/tasks")) return "Task Management";
  if (pathname.startsWith("/team/")) return "Team Details";
  if (pathname.startsWith("/team")) return "Teams Management";
  if (pathname.startsWith("/report")) return "Reports & Analytics";
  return "CollabCore Workspace";
};

const Navbar = ({ toggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const location = useLocation();

  const userInitial = getInitials(user?.name || "User");
  const pageTitle = getPageHeading(location.pathname);

  return (
    <nav className='navbar glass-morphism sticky-top px-3 px-md-4 py-2 mb-4'>
      <div className='container-fluid px-0 d-flex justify-content-between align-items-center'>
        <div className='d-flex align-items-center gap-2'>
          <button
            className='btn d-lg-none p-0'
            onClick={toggleSidebar}
            aria-label='Toggle Sidebar'>
            <span className='fs-4 lh-1'>☰</span>
          </button>
          <span
            className='fw-bold'
            style={{ fontSize: "1rem", color: "var(--text-primary)" }}>
            {pageTitle}
          </span>
        </div>

        <div className='d-flex align-items-center gap-2 gap-sm-3 ms-auto'>
          <button
            className='theme-toggle-btn btn border-0 p-2 rounded-circle d-flex align-items-center justify-content-center'
            onClick={toggleTheme}
            aria-label={
              theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"
            }
            title={
              theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"
            }
            style={{ fontSize: "1.05rem" }}>
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          <div
            className='user-profile d-flex align-items-center gap-2'
            title={
              user?.email
                ? `${user.name} (${user.email})`
                : "Authenticated Workspace User"
            }>
            {user?.name && (
              <div className='d-none d-sm-flex flex-column text-end lh-sm'>
                <span
                  className='fw-bold text-truncate'
                  style={{
                    fontSize: "0.84rem",
                    color: "var(--text-primary)",
                    maxWidth: "160px",
                  }}>
                  {user.name}
                </span>
                {user.email && (
                  <span
                    className='text-secondary text-truncate'
                    style={{ fontSize: "0.73rem", maxWidth: "160px" }}>
                    {user.email}
                  </span>
                )}
              </div>
            )}
            <div
              className='avatar rounded-circle text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0'
              style={{ width: "36px", height: "36px", fontSize: "0.82rem" }}>
              {userInitial}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
