import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import toast from "react-hot-toast";
import "./landing.css";

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Strict activity redirect handler: forces login if not authenticated
  const handleActivity = (targetPath = "/dashboard", featureName = "") => {
    setMobileMenuOpen(false);
    if (!isAuthenticated) {
      toast.error(
        featureName
          ? `Please sign in to access ${featureName}.`
          : "Please sign in to access workspace features.",
      );
      navigate("/login");
    } else {
      navigate(targetPath);
    }
  };

  return (
    <div className='landing-container'>
      {/* Landing Navigation Header */}
      <nav className='landing-nav'>
        <Link to='/' className='landing-brand'>
          <span style={{ whiteSpace: "nowrap" }}>❖ CollabCore</span>
          <span className='landing-brand-badge'>Workspace</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className='landing-nav-links'>
          <button
            className='landing-nav-link border-0 bg-transparent'
            onClick={() => handleActivity("/project", "Projects Hub")}>
            📁 Projects
          </button>
          <button
            className='landing-nav-link border-0 bg-transparent'
            onClick={() => handleActivity("/tasks", "Task Board")}>
            ✅ Tasks
          </button>
          <button
            className='landing-nav-link border-0 bg-transparent'
            onClick={() => handleActivity("/team", "Team Roster")}>
            👥 Teams
          </button>
          <button
            className='landing-nav-link border-0 bg-transparent'
            onClick={() => handleActivity("/report", "Analytics Reports")}>
            📈 Reports
          </button>
        </div>

        {/* Nav Actions */}
        <div className='landing-nav-actions'>
          <button
            className='btn border-0 p-2 rounded-circle d-flex align-items-center justify-content-center'
            onClick={toggleTheme}
            title={
              theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"
            }
            style={{
              fontSize: "1.2rem",
              cursor: "pointer",
              background: "var(--input-bg)",
              color: "var(--text-primary)",
            }}>
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          {isAuthenticated ? (
            <button
              onClick={() => navigate("/dashboard")}
              className='btn-primary-teal'>
              Go to Workspace →
            </button>
          ) : (
            <Link to='/login' className='btn-primary-teal'>
              Sign In
            </Link>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            className='mobile-menu-toggle'
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label='Toggle mobile menu'>
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      <div className={`landing-mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
        <div
          className='mobile-nav-link'
          onClick={() => handleActivity("/project", "Projects Hub")}>
          <span>📁 Projects Hub</span>
          <span>→</span>
        </div>
        <div
          className='mobile-nav-link'
          onClick={() => handleActivity("/tasks", "Task Board")}>
          <span>✅ Tasks & Kanban</span>
          <span>→</span>
        </div>
        <div
          className='mobile-nav-link'
          onClick={() => handleActivity("/team", "Team Management")}>
          <span>👥 Teams & Members</span>
          <span>→</span>
        </div>
        <div
          className='mobile-nav-link'
          onClick={() => handleActivity("/report", "Reports & Analytics")}>
          <span>📈 Reports & Velocity</span>
          <span>→</span>
        </div>
        <div className='pt-2 d-flex gap-2'>
          {isAuthenticated ? (
            <button
              onClick={() => handleActivity("/dashboard")}
              className='btn-primary-teal w-100 justify-content-center'>
              Go to Workspace →
            </button>
          ) : (
            <>
              <Link to='/login' className='btn-outline-slate w-50 text-center'>
                Sign In
              </Link>
              <Link to='/signup' className='btn-primary-teal w-50 text-center'>
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <header className='landing-hero'>
        <div className='landing-hero-content'>
          <div className='landing-tag'>
            <span>❖</span> CollabCore Project & Team Workspace
          </div>
          <h1 className='landing-hero-title'>
            Organize Projects. <br />
            Track Tasks & Teams in <span className='highlight'>Real Time</span>
          </h1>
          <p className='landing-hero-description'>
            CollabCore is an all-in-one project management system. Manage
            projects, assign team leads, track tasks across To Do/In
            Progress/Completed/Blocked states, resolve task subtasks, and
            analyze weekly performance.
          </p>

          <div className='landing-hero-ctas'>
            {isAuthenticated ? (
              <button
                onClick={() => navigate("/dashboard")}
                className='btn-primary-teal'>
                Open Workspace Dashboard
              </button>
            ) : (
              <>
                <Link to='/login' className='btn-primary-teal'>
                  🚀 Sign In to Workspace
                </Link>
                <button
                  onClick={() => handleActivity("/dashboard", "Demo Workspace")}
                  className='btn-outline-slate'>
                  Explore Features
                </button>
              </>
            )}
          </div>
        </div>

        {/* Hero Interactive CSS Mockup */}
        <div className='hero-mockup-container'>
          <div className='mockup-header'>
            <div className='mockup-dots'>
              <span className='mockup-dot red'></span>
              <span className='mockup-dot yellow'></span>
              <span className='mockup-dot green'></span>
            </div>
            <span className='mockup-title'>CollabCore Active Overview</span>
          </div>

          <div className='mockup-stats-grid'>
            <div
              className='mockup-stat-card'
              onClick={() => handleActivity("/project", "Projects")}>
              <div className='val'>Projects</div>
              <div className='lbl'>Owner & Dates</div>
            </div>
            <div
              className='mockup-stat-card'
              onClick={() => handleActivity("/tasks", "Task Board")}>
              <div className='val'>Tasks</div>
              <div className='lbl'>Status & Priority</div>
            </div>
            <div
              className='mockup-stat-card'
              onClick={() => handleActivity("/team", "Teams")}>
              <div className='val'>Teams</div>
              <div className='lbl'>Members & Leads</div>
            </div>
            <div
              className='mockup-stat-card'
              onClick={() => handleActivity("/report", "Analytics")}>
              <div className='val'>Reports</div>
              <div className='lbl'>Velocity Charts</div>
            </div>
          </div>

          <div className='mockup-task-list'>
            <div
              className='mockup-task-item'
              onClick={() => handleActivity("/tasks", "Task Details")}>
              <div>
                <strong>Q4 Product Launch & Landing Redesign</strong>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-secondary)",
                  }}>
                  Project: Core Platform • Status: In Progress
                </div>
              </div>
              <span className='mockup-badge badge-high'>High</span>
            </div>
            <div
              className='mockup-task-item'
              onClick={() => handleActivity("/tasks", "Task Details")}>
              <div>
                <strong>Team Role Assignment & Permission Audit</strong>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-secondary)",
                  }}>
                  Project: Workspace Security • Status: Completed
                </div>
              </div>
              <span className='mockup-badge badge-low'>Done</span>
            </div>
          </div>
        </div>
      </header>

      {/* Modules Grid Section - 4 Core Project Pillars */}
      <section id='features' className='landing-section'>
        <div className='section-header'>
          <div className='section-subtitle'>Core Architecture</div>
          <h2 className='section-title'>Designed for High-Performing Teams</h2>
          <p className='section-description'>
            CollabCore connects project planning, task execution, team lead
            allocation, and visual reporting into one unified workspace.
          </p>
        </div>

        <div className='modules-grid'>
          {/* Card 1: Projects */}
          <div className='module-card'>
            <div>
              <div className='module-header'>
                <div className='module-icon'>📁</div>
                <h3>Project & Milestones</h3>
              </div>
              <p>
                Create structured projects, set start and target due dates,
                assign team leads and project owners, and track milestone progress.
              </p>
              <div className='module-tags'>
                <span className='module-tag'>Project Creation</span>
                <span className='module-tag'>Owner Scoping</span>
                <span className='module-tag'>Timeline Dates</span>
              </div>
            </div>
            <button
              className='module-action-btn'
              onClick={() => handleActivity("/project", "Projects Hub")}>
              Explore Projects →
            </button>
          </div>

          {/* Card 2: Tasks */}
          <div className='module-card'>
            <div>
              <div className='module-header'>
                <div className='module-icon'>✅</div>
                <h3>Multi-Status Task Board</h3>
              </div>
              <p>
                Organize tasks across To Do, In Progress, Completed, and Blocked
                columns with priority tags (High, Medium, Low) and subtasks.
              </p>
              <div className='module-tags'>
                <span className='module-tag'>Multi-Status Workflow</span>
                <span className='module-tag'>Priority Tags</span>
                <span className='module-tag'>Subtasks</span>
              </div>
            </div>
            <button
              className='module-action-btn'
              onClick={() => handleActivity("/tasks", "Task Board")}>
              View Task Board →
            </button>
          </div>

          {/* Card 3: Teams */}
          <div className='module-card'>
            <div>
              <div className='module-header'>
                <div className='module-icon'>👥</div>
                <h3>Team & Owner Scoping</h3>
              </div>
              <p>
                Form dedicated teams, invite team members by email, assign team
                leads, and manage team workloads in scrollable modal views.
              </p>
              <div className='module-tags'>
                <span className='module-tag'>Team Creation</span>
                <span className='module-tag'>Member Rosters</span>
                <span className='module-tag'>Scrollable Modals</span>
              </div>
            </div>
            <button
              className='module-action-btn'
              onClick={() => handleActivity("/team", "Team Roster")}>
              Manage Teams →
            </button>
          </div>

          {/* Card 4: Analytics */}
          <div className='module-card'>
            <div>
              <div className='module-header'>
                <div className='module-icon'>📈</div>
                <h3>Visual Analytics & Reports</h3>
              </div>
              <p>
                Track team velocity with 7-day task completion throughput charts,
                pending workload distribution, and closed task archives.
              </p>
              <div className='module-tags'>
                <span className='module-tag'>7-Day Velocity Chart</span>
                <span className='module-tag'>Pending Breakdown</span>
                <span className='module-tag'>Closed Log</span>
              </div>
            </div>
            <button
              className='module-action-btn'
              onClick={() => handleActivity("/report", "Performance Reports")}>
              View Reports →
            </button>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className='cta-banner'>
        <h2>Ready to Access Your Workspace?</h2>
        <p>
          Sign in to CollabCore now to manage your projects, track tasks, and
          collaborate with your team.
        </p>
        <div className='d-flex justify-content-center gap-3 flex-wrap'>
          <Link to='/login' className='btn-primary-teal'>
            Sign In Now →
          </Link>
          <Link to='/signup' className='btn-outline-slate'>
            Create Account
          </Link>
        </div>
      </section>

      {/* Landing Footer */}
      <footer className='landing-footer'>
        <div className='footer-inner'>
          <div>
            <div className='footer-brand'>❖ CollabCore</div>
            <p
              className='m-0 mt-1 text-secondary'
              style={{ fontSize: "0.85rem" }}>
              Complete project, task, team, and analytics workspace.
            </p>
          </div>

          <div className='footer-links'>
            <button onClick={() => handleActivity("/project", "Projects")}>
              Projects
            </button>
            <button onClick={() => handleActivity("/tasks", "Tasks")}>
              Tasks
            </button>
            <button onClick={() => handleActivity("/team", "Teams")}>
              Teams
            </button>
            <button onClick={() => handleActivity("/report", "Reports")}>
              Reports
            </button>
            <Link to='/login'>Sign In</Link>
            <Link to='/signup'>Register</Link>
          </div>

          <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            © {new Date().getFullYear()} CollabCore. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export { LandingPage };
