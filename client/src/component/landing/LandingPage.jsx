import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, warmUpGuestSession } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { warmUpDashboardData } from "../../api/axiosHelper";
import toast from "react-hot-toast";
import "./landing.css";

const VIEW_TABS = [
  {
    id: "dashboard",
    icon: "📊",
    label: "Dashboard",
    badge: "Command Center",
    title: "All Projects & Tasks in One View",
    description:
      "Search across your workspace and filter projects or tasks instantly with 1-click status pills.",
    bullets: [
      "Instant search across projects, tasks, and #tags",
      "Status-badged project cards with quick navigation",
      "My Tasks cards with due dates and 1-click completion",
    ],
    route: "/dashboard",
    ctaText: "Open Dashboard →",
  },
  {
    id: "projects",
    icon: "📋",
    label: "Projects & Tables",
    badge: "Project Execution",
    title: "Sortable Project Tables & Discussions",
    description:
      "Sort project tasks by priority or date in one click, filter by owner or tag, and post team updates.",
    bullets: [
      "1-click Sort Pills (Priority High-Low, Low-High, Newest)",
      "Clean task table with Owners, Priority, Due On & Status",
      "Built-in Project Discussion thread for team handoffs",
    ],
    route: "/project",
    ctaText: "Explore Projects →",
  },
  {
    id: "teams",
    icon: "👥",
    label: "Teams",
    badge: "Team Alignment",
    title: "Cross-Functional Teams & Member Queues",
    description:
      "Organize departments into 4-column team cards, onboard members, and filter tasks by owner.",
    bullets: [
      "Multi-color 2-letter member avatars (UT, JL, AS, +N)",
      "Dedicated Team Workspace with member directory",
      "Filter assigned team tasks by member or status",
    ],
    route: "/team",
    ctaText: "Manage Teams →",
  },
  {
    id: "reports",
    icon: "📈",
    label: "Analytics",
    badge: "Live Reporting",
    title: "2×2 Chart.js Velocity & Workload Reports",
    description:
      "Track weekly completed tasks, pending workload days, and closed tasks by Team, Owner, or Project.",
    bullets: [
      "Total Work Done Last Week (7-Day velocity chart)",
      "Total Days of Work Pending across active projects",
      "Side-by-side Tasks Closed by Team & Owner charts",
    ],
    route: "/report",
    ctaText: "View Reports →",
  },
];

const WORK_MANAGEMENT_PLAYBOOKS = [
  {
    id: "p1",
    category: "Project Planning",
    tag: "WORKFLOW GUIDE",
    title: "Structure multi-phase projects clearly",
    summary:
      "Track project status pills, target due dates, and Project Discussions in one place.",
    metric: "Clear milestones",
    accent: "teal",
    route: "/project",
  },
  {
    id: "p2",
    category: "Task Prioritization",
    tag: "EXECUTION PLAYBOOK",
    title: "Prioritize work with ⚑ High, Medium & Low flags",
    summary:
      "Use 1-click Priority High-Low sort pills and Due On dates to focus on critical deliverables.",
    metric: "Fast triage",
    accent: "indigo",
    route: "/tasks",
  },
  {
    id: "p3",
    category: "Team Velocity",
    tag: "TEAM WORKFLOW",
    title: "Balance workloads across cross-functional teams",
    summary:
      "Assign multiple owners to shared tasks and review member queues inside Team Details.",
    metric: "Owner clarity",
    accent: "amber",
    route: "/team",
  },
  {
    id: "p4",
    category: "Reporting & KPIs",
    tag: "ANALYTICS",
    title: "Compare 7-day velocity vs. pending work days",
    summary:
      "Monitor completed tasks from the past week alongside remaining estimated days of work.",
    metric: "Chart.js KPIs",
    accent: "emerald",
    route: "/report",
  },
  {
    id: "p5",
    category: "Task Prioritization",
    tag: "URL FILTERS",
    title: "Share filtered task views via URL links",
    summary:
      "Filter by Owner, Team, Project, #Tag, and Status and share the exact URL with your team.",
    metric: "6-way URL sync",
    accent: "rose",
    route: "/tasks",
  },
  {
    id: "p6",
    category: "Project Planning",
    tag: "CHECKLIST",
    title: "Spot and resolve blocked tasks early",
    summary:
      "Isolate Blocked tasks on your Dashboard and update task status or owners in one click.",
    metric: "Zero blockers",
    accent: "sky",
    route: "/dashboard",
  },
];

const PLAYBOOK_CATEGORIES = [
  "All Playbooks",
  "Project Planning",
  "Task Prioritization",
  "Team Velocity",
  "Reporting & KPIs",
];

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedCategory, setSelectedCategory] = useState("All Playbooks");

  useEffect(() => {
    warmUpDashboardData();
    if (!isAuthenticated) {
      warmUpGuestSession();
    }
  }, [isAuthenticated]);

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

  const scrollToSection = (sectionId) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const currentTabObj =
    VIEW_TABS.find((t) => t.id === activeTab) || VIEW_TABS[0];

  const filteredPlaybooks =
    selectedCategory === "All Playbooks"
      ? WORK_MANAGEMENT_PLAYBOOKS
      : WORK_MANAGEMENT_PLAYBOOKS.filter(
          (item) => item.category === selectedCategory,
        );

  return (
    <div className='landing-container'>
      {/* Sticky Navigation Header */}
      <nav className='landing-nav'>
        <div className='landing-nav-inner'>
          <Link to='/' className='landing-brand'>
            <span className='brand-logo-mark'>❖</span>
            <span>CollabCore</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className='landing-nav-links'>
            <button
              type='button'
              className='landing-nav-link border-0 bg-transparent'
              onClick={() => scrollToSection("views")}>
              Product Tour
            </button>
            <button
              type='button'
              className='landing-nav-link border-0 bg-transparent'
              onClick={() => scrollToSection("capabilities")}>
              Capabilities
            </button>
            <button
              type='button'
              className='landing-nav-link border-0 bg-transparent'
              onClick={() => scrollToSection("playbooks")}>
              Playbooks
            </button>
            <button
              type='button'
              className='landing-nav-link border-0 bg-transparent'
              onClick={() => handleActivity("/project", "Projects Hub")}>
              Projects
            </button>
            <button
              type='button'
              className='landing-nav-link border-0 bg-transparent'
              onClick={() => handleActivity("/report", "Analytics Reports")}>
              Reports
            </button>
          </div>

          {/* Nav Actions */}
          <div className='landing-nav-actions'>
            <button
              type='button'
              className='theme-toggle-btn'
              onClick={toggleTheme}
              aria-label='Toggle color theme'
              title={
                theme === "light"
                  ? "Switch to Dark Mode"
                  : "Switch to Light Mode"
              }>
              {theme === "light" ? "🌙" : "☀️"}
            </button>

            {isAuthenticated ? (
              <button
                type='button'
                onClick={() => navigate("/dashboard")}
                className='btn-primary-teal landing-nav-cta'>
                Go to Workspace →
              </button>
            ) : (
              <div className='landing-auth-btns'>
                <Link to='/login' className='btn-outline-slate py-2 px-3'>
                  Sign In
                </Link>
                <Link to='/signup' className='btn-primary-teal py-2 px-3'>
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              type='button'
              className='mobile-menu-toggle'
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label='Toggle mobile menu'>
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <div className={`landing-mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
          <button
            type='button'
            className='mobile-nav-link border-0 bg-transparent w-100 text-start'
            onClick={() => scrollToSection("views")}>
            <span>🖥 Product Tour</span>
            <span>↓</span>
          </button>
          <button
            type='button'
            className='mobile-nav-link border-0 bg-transparent w-100 text-start'
            onClick={() => scrollToSection("capabilities")}>
            <span>⚡ Capabilities</span>
            <span>↓</span>
          </button>
          <button
            type='button'
            className='mobile-nav-link border-0 bg-transparent w-100 text-start'
            onClick={() => scrollToSection("playbooks")}>
            <span>📚 Work Playbooks</span>
            <span>↓</span>
          </button>
          <div
            className='mobile-nav-link'
            onClick={() => handleActivity("/dashboard", "Workspace Dashboard")}>
            <span>📊 Dashboard</span>
            <span>→</span>
          </div>
          <div
            className='mobile-nav-link'
            onClick={() => handleActivity("/project", "Projects Hub")}>
            <span>📁 Projects</span>
            <span>→</span>
          </div>
          <div
            className='mobile-nav-link'
            onClick={() => handleActivity("/tasks", "Task Board")}>
            <span>✅ Tasks</span>
            <span>→</span>
          </div>
          <div
            className='mobile-nav-link'
            onClick={() => handleActivity("/team", "Team Rosters")}>
            <span>👥 Teams</span>
            <span>→</span>
          </div>
          <div
            className='mobile-nav-link'
            onClick={() => handleActivity("/report", "Reports & Analytics")}>
            <span>📈 Reports</span>
            <span>→</span>
          </div>

          <div className='pt-2 d-flex gap-2'>
            {isAuthenticated ? (
              <button
                type='button'
                onClick={() => handleActivity("/dashboard")}
                className='btn-primary-teal w-100 justify-content-center'>
                Go to Workspace →
              </button>
            ) : (
              <>
                <Link
                  to='/login'
                  onClick={() => setMobileMenuOpen(false)}
                  className='btn-outline-slate w-50 text-center justify-content-center'>
                  Sign In
                </Link>
                <Link
                  to='/signup'
                  onClick={() => setMobileMenuOpen(false)}
                  className='btn-primary-teal w-50 text-center justify-content-center'>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* SPACIOUS HERO SECTION */}
      <header className='landing-hero'>
        <div className='landing-hero-content'>
          <button
            type='button'
            className='landing-tag border-0'
            onClick={() => scrollToSection("views")}>
            <span className='tag-dot'></span>
            <span>CollabCore Work Management</span>
          </button>

          <h1 className='landing-hero-title'>
            Organize projects, tasks, and teams with{" "}
            <span className='highlight'>complete clarity.</span>
          </h1>

          <p className='landing-hero-description'>
            Plan initiatives, assign multi-owner tasks with priority flags,
            share URL-filtered views, and track weekly velocity in one fast
            workspace.
          </p>

          <div className='landing-hero-ctas'>
            {isAuthenticated ? (
              <button
                type='button'
                onClick={() => navigate("/dashboard")}
                className='btn-primary-teal'>
                Open Dashboard →
              </button>
            ) : (
              <>
                <Link to='/signup' className='btn-primary-teal'>
                  Get Started Free →
                </Link>
                <Link to='/login' className='btn-outline-slate'>
                  Sign In
                </Link>
              </>
            )}
          </div>

          <div className='hero-feature-pills'>
            <span className='hero-pill'>✓ URL Task Filters</span>
            <span className='hero-pill'>✓ Multi-Owner Teams</span>
            <span className='hero-pill'>✓ Live Chart.js Reports</span>
          </div>
        </div>

        {/* Clean, Uncluttered Hero Workspace Card */}
        <div className='hero-mockup-container'>
          <div className='mockup-header'>
            <div className='mockup-dots'>
              <span className='mockup-dot red'></span>
              <span className='mockup-dot yellow'></span>
              <span className='mockup-dot green'></span>
            </div>
            <span className='mockup-title'>CollabCore Active Sprint</span>
          </div>

          <div className='mockup-summary-row'>
            <div
              className='mockup-summary-card'
              onClick={() => handleActivity("/project", "Projects")}>
              <span className='mockup-status-pill in-progress'>
                In Progress
              </span>
              <div className='mockup-project-title mt-2'>Website Redesign</div>
              <div className='mockup-small-meta'>6 Active Tasks • 3 Owners</div>
            </div>

            <div
              className='mockup-summary-card'
              onClick={() => handleActivity("/report", "Reports")}>
              <span className='mockup-status-pill completed'>Velocity</span>
              <div className='mockup-project-title mt-2'>18 Tasks Closed</div>
              <div className='mockup-small-meta'>+24% vs. Last Week</div>
            </div>
          </div>

          <div className='mockup-task-list'>
            <div
              className='mockup-task-item'
              onClick={() => handleActivity("/tasks", "Task Details")}>
              <div className='min-w-0'>
                <div className='fw-bold text-truncate'>
                  API Cache &amp; Parallel Login Prefetch
                </div>
                <div className='mockup-task-meta'>Due on: 18 Nov 2026</div>
              </div>
              <div className='d-flex align-items-center gap-2 flex-shrink-0'>
                <div className='mockup-avatar-stack'>
                  <span
                    className='mockup-avatar'
                    style={{ background: "#4f46e5" }}>
                    UT
                  </span>
                  <span
                    className='mockup-avatar'
                    style={{ background: "#0ea5e9" }}>
                    JL
                  </span>
                </div>
                <span className='mockup-badge badge-high'>⚑ High</span>
              </div>
            </div>

            <div
              className='mockup-task-item'
              onClick={() => handleActivity("/tasks", "Task Details")}>
              <div className='min-w-0'>
                <div className='fw-bold text-truncate'>
                  Responsive 4-Column Team Directory
                </div>
                <div className='mockup-task-meta'>Due on: 21 Nov 2026</div>
              </div>
              <div className='d-flex align-items-center gap-2 flex-shrink-0'>
                <div className='mockup-avatar-stack'>
                  <span
                    className='mockup-avatar'
                    style={{ background: "#10b981" }}>
                    AS
                  </span>
                  <span
                    className='mockup-avatar'
                    style={{ background: "#f59e0b" }}>
                    RK
                  </span>
                </div>
                <span className='mockup-badge badge-medium'>⚑ Medium</span>
              </div>
            </div>

            <div
              className='mockup-task-item'
              onClick={() => handleActivity("/report", "Reports")}>
              <div className='min-w-0'>
                <div className='fw-bold text-truncate'>
                  Executive 2×2 Velocity &amp; Owner Charts
                </div>
                <div className='mockup-task-meta'>Due on: 24 Nov 2026</div>
              </div>
              <div className='d-flex align-items-center gap-2 flex-shrink-0'>
                <div className='mockup-avatar-stack'>
                  <span
                    className='mockup-avatar'
                    style={{ background: "#ec4899" }}>
                    SM
                  </span>
                </div>
                <span className='mockup-badge badge-low'>⚑ Low</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* CONCISE METRICS STRIP */}
      <section className='landing-metrics-strip'>
        <div className='metrics-grid'>
          <div className='metric-item'>
            <div className='metric-value'>4 Task States</div>
            <div className='metric-label'>
              To Do, In Progress, Completed &amp; Blocked
            </div>
          </div>
          <div className='metric-item'>
            <div className='metric-value'>6-Way URL Sync</div>
            <div className='metric-label'>
              Share filtered views by Owner, Team, Tag &amp; Status
            </div>
          </div>
          <div className='metric-item'>
            <div className='metric-value'>4 Live Charts</div>
            <div className='metric-label'>
              Weekly velocity, pending days &amp; closed breakdowns
            </div>
          </div>
          <div className='metric-item'>
            <div className='metric-value'>Dual Theme</div>
            <div className='metric-label'>
              WCAG AA contrast-verified Light &amp; Dark modes
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE PRODUCT VIEW SWITCHER */}
      <section id='views' className='landing-section'>
        <div className='section-header'>
          <div className='section-subtitle'>Interactive Product Tour</div>
          <h2 className='section-title'>
            Explore Every View of Your Workspace
          </h2>
          <p className='section-description'>
            Switch tabs below to preview how CollabCore connects projects, tasks,
            teams, and analytics.
          </p>
        </div>

        <div className='view-tabs-bar' role='tablist'>
          {VIEW_TABS.map((tab) => (
            <button
              key={tab.id}
              type='button'
              role='tab'
              aria-selected={activeTab === tab.id}
              className={`view-tab-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}>
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className='view-showcase-panel'>
          <div className='view-showcase-copy'>
            <span className='showcase-badge'>{currentTabObj.badge}</span>
            <h3>{currentTabObj.title}</h3>
            <p>{currentTabObj.description}</p>
            <ul className='showcase-Single-list'>
              {currentTabObj.bullets.map((b, i) => (
                <li key={i}>
                  <span className='check-icon'>✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <button
              type='button'
              className='btn-primary-teal'
              onClick={() =>
                handleActivity(currentTabObj.route, currentTabObj.label)
              }>
              {currentTabObj.ctaText}
            </button>
          </div>

          <div className='view-showcase-visual'>
            {activeTab === "dashboard" && (
              <div className='visual-card-frame'>
                <div className='visual-search-bar'>
                  <span>🔍 Search projects or tasks...</span>
                  <span className='visual-pill-group'>
                    <span className='v-pill active'>All</span>
                    <span className='v-pill'>In Progress</span>
                    <span className='v-pill'>Completed</span>
                  </span>
                </div>
                <div className='visual-grid-2'>
                  <div className='visual-mini-card'>
                    <div className='d-flex justify-content-between mb-2'>
                      <span className='mockup-status-pill in-progress'>
                        In Progress
                      </span>
                      <span className='mockup-badge badge-high'>⚑ High</span>
                    </div>
                    <div className='fw-bold mb-1'>Design System Audit</div>
                    <div className='mockup-task-meta mb-2'>
                      Due on: 19 Nov 2026
                    </div>
                    <div className='d-flex justify-content-between align-items-center pt-2 border-top'>
                      <span className='small text-secondary fw-semibold'>
                        UT • Ujwal T.
                      </span>
                      <span className='v-done-btn'>✔ Done</span>
                    </div>
                  </div>
                  <div className='visual-mini-card'>
                    <div className='d-flex justify-content-between mb-2'>
                      <span className='mockup-status-pill completed'>
                        Completed
                      </span>
                      <span className='mockup-badge badge-medium'>
                        ⚑ Medium
                      </span>
                    </div>
                    <div className='fw-bold mb-1'>Lean Query Indexing</div>
                    <div className='mockup-task-meta mb-2'>
                      Due on: 15 Nov 2026
                    </div>
                    <div className='d-flex justify-content-between align-items-center pt-2 border-top'>
                      <span className='small text-secondary fw-semibold'>
                        JL, AS (+1)
                      </span>
                      <span className='mockup-small-meta'>Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "projects" && (
              <div className='visual-card-frame'>
                <div className='d-flex flex-wrap gap-2 align-items-center mb-3'>
                  <span className='mockup-sort-label'>Sort by:</span>
                  <span className='mockup-sort-pill active'>
                    Priority High-Low
                  </span>
                  <span className='mockup-sort-pill'>Priority Low-High</span>
                  <span className='mockup-sort-pill'>Newest First</span>
                </div>
                <div className='visual-table-mock'>
                  <div className='visual-table-row head'>
                    <span>TASK</span>
                    <span>OWNER</span>
                    <span>PRIORITY</span>
                    <span>STATUS</span>
                  </div>
                  <div className='visual-table-row'>
                    <span className='fw-bold text-truncate'>
                      JWT Auth &amp; Cache
                    </span>
                    <span className='mockup-avatar-stack'>
                      <span
                        className='mockup-avatar'
                        style={{ background: "#4f46e5" }}>
                        UT
                      </span>
                      <span
                        className='mockup-avatar'
                        style={{ background: "#10b981" }}>
                        AS
                      </span>
                    </span>
                    <span className='mockup-badge badge-high'>⚑ High</span>
                    <span className='mockup-status-pill in-progress'>
                      In Progress
                    </span>
                  </div>
                  <div className='visual-table-row'>
                    <span className='fw-bold text-truncate'>
                      Discussion Thread API
                    </span>
                    <span className='mockup-avatar-stack'>
                      <span
                        className='mockup-avatar'
                        style={{ background: "#0ea5e9" }}>
                        JL
                      </span>
                    </span>
                    <span className='mockup-badge badge-medium'>⚑ Medium</span>
                    <span className='mockup-status-pill completed'>
                      Completed
                    </span>
                  </div>
                </div>
                <div className='visual-comment-box mt-3'>
                  <div className='small fw-bold mb-1'>
                    💬 Project Discussion
                  </div>
                  <div className='small text-secondary'>
                    &ldquo;All endpoints verified with 15s GET cache.&rdquo; —{" "}
                    <strong>Ujwal T.</strong>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "teams" && (
              <div className='visual-card-frame'>
                <div className='visual-grid-2'>
                  <div className='visual-mini-card'>
                    <div className='d-flex justify-content-between align-items-start gap-2 mb-2'>
                      <span className='fw-bold'>Engineering</span>
                      <span className='team-member-count-badge'>5 members</span>
                    </div>
                    <div className='mockup-project-sub mb-3'>
                      API architecture, security &amp; performance.
                    </div>
                    <div className='mockup-avatar-stack'>
                      <span
                        className='mockup-avatar'
                        style={{ background: "#4f46e5" }}>
                        UT
                      </span>
                      <span
                        className='mockup-avatar'
                        style={{ background: "#0ea5e9" }}>
                        JL
                      </span>
                      <span
                        className='mockup-avatar'
                        style={{ background: "#10b981" }}>
                        AS
                      </span>
                      <span
                        className='mockup-avatar'
                        style={{ background: "#fde68a", color: "#92400e" }}>
                        +2
                      </span>
                    </div>
                  </div>
                  <div className='visual-mini-card'>
                    <div className='d-flex justify-content-between align-items-start gap-2 mb-2'>
                      <span className='fw-bold'>Product Design</span>
                      <span className='team-member-count-badge'>4 members</span>
                    </div>
                    <div className='mockup-project-sub mb-3'>
                      UI systems, responsive layout &amp; contrast.
                    </div>
                    <div className='mockup-avatar-stack'>
                      <span
                        className='mockup-avatar'
                        style={{ background: "#ec4899" }}>
                        SM
                      </span>
                      <span
                        className='mockup-avatar'
                        style={{ background: "#f59e0b" }}>
                        RK
                      </span>
                      <span
                        className='mockup-avatar'
                        style={{ background: "#8b5cf6" }}>
                        DN
                      </span>
                      <span
                        className='mockup-avatar'
                        style={{ background: "#fde68a", color: "#92400e" }}>
                        +1
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reports" && (
              <div className='visual-card-frame'>
                <div className='visual-kpi-row mb-3'>
                  <div className='visual-kpi-box'>
                    <div className='kpi-lbl'>LAST 7 DAYS</div>
                    <div
                      className='kpi-num'
                      style={{ color: "var(--primary-color)" }}>
                      18
                    </div>
                  </div>
                  <div className='visual-kpi-box'>
                    <div className='kpi-lbl'>PENDING DAYS</div>
                    <div className='kpi-num' style={{ color: "#f59e0b" }}>
                      24d
                    </div>
                  </div>
                  <div className='visual-kpi-box'>
                    <div className='kpi-lbl'>CLOSED</div>
                    <div className='kpi-num' style={{ color: "#10b981" }}>
                      46
                    </div>
                  </div>
                </div>
                <div className='visual-bars-container'>
                  <div className='small fw-bold mb-2'>
                    Tasks Closed by Team (Chart.js)
                  </div>
                  <div className='visual-bar-row'>
                    <span>Engineering</span>
                    <div className='visual-bar-track'>
                      <div
                        className='visual-bar-fill'
                        style={{ width: "84%", background: "#10b981" }}></div>
                    </div>
                    <strong>19</strong>
                  </div>
                  <div className='visual-bar-row'>
                    <span>Design</span>
                    <div className='visual-bar-track'>
                      <div
                        className='visual-bar-fill'
                        style={{ width: "68%", background: "#3b82f6" }}></div>
                    </div>
                    <strong>15</strong>
                  </div>
                  <div className='visual-bar-row'>
                    <span>QA &amp; Ops</span>
                    <div className='visual-bar-track'>
                      <div
                        className='visual-bar-fill'
                        style={{ width: "52%", background: "#f59e0b" }}></div>
                    </div>
                    <strong>12</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* BALANCED 2x2 CAPABILITIES GRID */}
      <section id='capabilities' className='landing-section'>
        <div className='section-header'>
          <div className='section-subtitle'>Core Capabilities</div>
          <h2 className='section-title'>Built for Fast, Accountable Teams</h2>
          <p className='section-description'>
            Everything you need to plan projects, filter tasks, manage teams,
            and measure weekly output.
          </p>
        </div>

        <div className='bento-grid'>
          <div className='bento-card'>
            <div>
              <div className='bento-eyebrow'>SHAREABLE FILTER ENGINE</div>
              <h3>6-Way URL-Synced Task Filtering</h3>
              <p>
                Filter tasks by Owner, Team, Project, #Tag, and Status, or sort
                by Priority. Every filter state syncs with the URL for instant
                sharing.
              </p>
              <div className='bento-url-demo'>
                <code>/tasks?owner=Ujwal&amp;status=In+Progress&amp;sort=priority_desc</code>
              </div>
            </div>
            <button
              type='button'
              className='bento-link-btn'
              onClick={() => handleActivity("/tasks", "URL Filter Board")}>
              Open Task Filter Board →
            </button>
          </div>

          <div className='bento-card'>
            <div>
              <div className='bento-eyebrow'>CLEAR ACCOUNTABILITY</div>
              <h3>Multi-Owner Avatars &amp; Priority Flags</h3>
              <p>
                Assign single or multiple owners with 2-letter colored avatars
                and prioritize work across High, Medium, and Low urgency levels.
              </p>
              <div className='d-flex flex-wrap gap-2 my-3'>
                <span className='mockup-badge badge-high'>⚑ High Priority</span>
                <span className='mockup-badge badge-medium'>
                  ⚑ Medium Priority
                </span>
                <span className='mockup-badge badge-low'>⚑ Low Priority</span>
              </div>
            </div>
            <button
              type='button'
              className='bento-link-btn'
              onClick={() => handleActivity("/dashboard", "My Tasks")}>
              Explore Task Cards →
            </button>
          </div>

          <div className='bento-card'>
            <div>
              <div className='bento-eyebrow'>WORKLOAD TRACKING</div>
              <h3>Due Dates &amp; Time Remaining</h3>
              <p>
                Track estimated days to complete on every task, view formatted
                due dates, and monitor total pending days across all projects.
              </p>
              <div className='d-flex flex-wrap gap-2 my-3'>
                <span className='mockup-status-pill todo'>To Do</span>
                <span className='mockup-status-pill in-progress'>
                  In Progress
                </span>
                <span className='mockup-status-pill completed'>Completed</span>
              </div>
            </div>
            <button
              type='button'
              className='bento-link-btn'
              onClick={() => handleActivity("/report", "Pending Workload")}>
              View Workload Reports →
            </button>
          </div>

          <div className='bento-card'>
            <div>
              <div className='bento-eyebrow'>COLLABORATIVE CONTEXT</div>
              <h3>Project Discussions &amp; Fast Caching</h3>
              <p>
                Post updates directly inside Project Discussions and navigate
                instantly with 15-second GET caching and parallel login
                prefetching.
              </p>
              <div className='module-tags my-3'>
                <span className='module-tag'>Project Comments</span>
                <span className='module-tag'>15s Smart Cache</span>
                <span className='module-tag'>4-Col Team Grid</span>
              </div>
            </div>
            <button
              type='button'
              className='bento-link-btn'
              onClick={() => handleActivity("/project", "Project Discussions")}>
              Open Projects Hub →
            </button>
          </div>
        </div>
      </section>

      {/* WORK MANAGEMENT PLAYBOOKS HUB */}
      <section id='playbooks' className='landing-section'>
        <div className='section-header'>
          <div className='section-subtitle'>Work Management Hub</div>
          <h2 className='section-title'>Workflows for High-Performing Teams</h2>
          <p className='section-description'>
            Filter practical workflows by category and launch them inside your
            CollabCore workspace.
          </p>
        </div>

        <div
          className='playbook-filter-bar'
          role='group'
          aria-label='Filter work management playbooks'>
          {PLAYBOOK_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type='button'
              className={`playbook-filter-pill ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>

        <div className='playbooks-grid'>
          {filteredPlaybooks.map((item) => (
            <article key={item.id} className='playbook-card'>
              <div className={`playbook-card-banner accent-${item.accent}`}>
                <span className='playbook-banner-tag'>{item.tag}</span>
                <span className='playbook-banner-metric'>{item.metric}</span>
              </div>
              <div className='playbook-card-body'>
                <div className='playbook-category-label'>{item.category}</div>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <button
                  type='button'
                  className='playbook-action-link'
                  onClick={() => handleActivity(item.route, item.category)}>
                  <span>Try in CollabCore</span>
                  <span>→</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CONVERSION CTA BANNER */}
      <section className='cta-banner'>
        <div className='cta-banner-inner'>
          <span className='landing-tag mb-3'>
            <span className='tag-dot'></span>
            <span>Ready to Get Started?</span>
          </span>
          <h2>Manage your projects, tasks, and teams in one place.</h2>
          <p>
            Sign in to your CollabCore workspace or create a free account to
            start tracking deliverables today.
          </p>
          <div className='d-flex justify-content-center gap-3 flex-wrap'>
            {isAuthenticated ? (
              <button
                type='button'
                onClick={() => navigate("/dashboard")}
                className='btn-primary-teal'>
                Open Workspace Dashboard →
              </button>
            ) : (
              <>
                <Link to='/signup' className='btn-primary-teal'>
                  Get Started Free →
                </Link>
                <Link to='/login' className='btn-outline-slate'>
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* PRODUCTION MULTI-COLUMN FOOTER */}
      <footer className='landing-footer'>
        <div className='footer-grid'>
          <div className='footer-brand-col'>
            <div className='footer-brand'>❖ CollabCore</div>
            <p className='footer-brand-desc'>
              Unified work management platform for structured projects,
              URL-filtered task queues, cross-functional teams, and live
              Chart.js analytics.
            </p>
          </div>

          <div className='footer-col'>
            <h4>Workspace</h4>
            <button
              type='button'
              onClick={() => handleActivity("/dashboard", "Dashboard")}>
              Dashboard
            </button>
            <button
              type='button'
              onClick={() => handleActivity("/project", "Projects")}>
              Projects Hub
            </button>
            <button
              type='button'
              onClick={() => handleActivity("/tasks", "Tasks")}>
              Task Board
            </button>
            <button
              type='button'
              onClick={() => handleActivity("/team", "Teams")}>
              Team Rosters
            </button>
          </div>

          <div className='footer-col'>
            <h4>Explore</h4>
            <button type='button' onClick={() => scrollToSection("views")}>
              Product Tour
            </button>
            <button
              type='button'
              onClick={() => scrollToSection("capabilities")}>
              Capabilities
            </button>
            <button type='button' onClick={() => scrollToSection("playbooks")}>
              Work Playbooks
            </button>
            <button
              type='button'
              onClick={() => handleActivity("/report", "Reports")}>
              Analytics Reports
            </button>
          </div>

          <div className='footer-col'>
            <h4>Account</h4>
            {isAuthenticated ? (
              <button type='button' onClick={() => navigate("/dashboard")}>
                Open Workspace →
              </button>
            ) : (
              <>
                <Link to='/login'>Sign In</Link>
                <Link to='/signup'>Create Account</Link>
              </>
            )}
            <button type='button' onClick={toggleTheme}>
              Theme: {theme === "light" ? "Light Mode ☀️" : "Dark Mode 🌙"}
            </button>
          </div>
        </div>

        <div className='footer-bottom'>
          <div>
            © {new Date().getFullYear()} CollabCore Workspace. All rights
            reserved.
          </div>
          <div className='d-flex gap-3 flex-wrap'>
            <span>WCAG AA Contrast Verified</span>
            <span>•</span>
            <span>Real-Time REST &amp; Chart.js</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export { LandingPage };
