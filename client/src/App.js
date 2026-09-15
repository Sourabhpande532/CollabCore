import { lazy, Suspense } from "react";
import "../src/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Layout } from "./component/layout/Layout";

import { PrivateRoute } from "./component/ProtectedRoute/PrivateRoute";

// Code splitting with React.lazy for optimized bundle loading
const LandingPage = lazy(() =>
  import("./component/landing/LandingPage").then((m) => ({
    default: m.LandingPage,
  })),
);
const Signin = lazy(() =>
  import("./pages/Signin").then((m) => ({ default: m.Signin })),
);
const Signup = lazy(() =>
  import("./pages/Signup").then((m) => ({ default: m.Signup })),
);
const Dashboard = lazy(() =>
  import("./pages/Dashboard").then((m) => ({ default: m.Dashboard })),
);
const Project = lazy(() =>
  import("./pages/Project").then((m) => ({ default: m.Project })),
);
const ProjectDetails = lazy(() =>
  import("./pages/ProjectDetails").then((m) => ({ default: m.ProjectDetails })),
);
const Team = lazy(() =>
  import("./pages/Team").then((m) => ({ default: m.Team })),
);
const TeamDetails = lazy(() =>
  import("./pages/TeamDetails").then((m) => ({ default: m.TeamDetails })),
);
const Reports = lazy(() =>
  import("./pages/Reports").then((m) => ({ default: m.Reports })),
);
const Tasks = lazy(() => import("./pages/Task"));
const TaskDetails = lazy(() =>
  import("./component/tdetails/TaskDetails").then((m) => ({
    default: m.TaskDetails,
  })),
);

// Fallback spinner during route transitions
const PageLoader = () => (
  <div
    className='d-flex justify-content-center align-items-center py-5'
    style={{ minHeight: "50vh" }}>
    <div className='spinner-border text-primary' role='status'>
      <span className='visually-hidden'>Loading page...</span>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position='top-right'
        toastOptions={{
          style: {
            fontSize: "1rem",
            borderRadius: "8px",
            background: "var(--card-bg)",
            color: "var(--text-primary)",
            border: "1px solid var(--glass-border)",
          },
        }}
      />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* PUBLIC LANDING & AUTH ROUTES */}
          <Route path='/' element={<LandingPage />} />
          <Route path='/landing' element={<LandingPage />} />
          <Route path='/login' element={<Signin />} />
          <Route path='/signup' element={<Signup />} />

          {/* PROTECTED WORKSPACE ROUTES */}
          <Route
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/project' element={<Project />} />
            <Route path='/project/:id' element={<ProjectDetails />} />
            <Route path='/team' element={<Team />} />
            <Route path='/team/:id' element={<TeamDetails />} />
            <Route path='/report' element={<Reports />} />
            <Route path='/tasks' element={<Tasks />} />
            <Route path='/tasks/:id' element={<TaskDetails />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
