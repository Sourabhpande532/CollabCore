import "../src/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Signup } from "./pages/Signup";
import { Signin } from "./pages/Signin";
import { Toaster } from "react-hot-toast";
import { Dashboard } from "./pages/Dashboard";
import { PrivateRoute } from "./component/ProtectedRoute/PrivateRoute";
import { Project } from "./pages/Project";
import { Team } from "./pages/Team";
import { Reports } from "./pages/Reports";
import { Setting } from "./pages/Setting";
import { Layout } from "./component/layout/Layout";
function App() {
  return (
    <BrowserRouter>
      <Toaster
        position='top-right'
        toastOptions={{
          style: {
            fontSize: "1.4rem",
          },
        }}
      />
      <Routes>
        {/* PUBLIC ROTES */}
        <Route path='/login' element={<Signin />} />
        <Route path='/signup' element={<Signup />} />

        {/* PRIVATE ROUTES */}
        <Route
          path='/'
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }>
          <Route index element={<Dashboard />} />
          <Route path='/project' element={<Project />} />
          <Route path='/team' element={<Team />} />
          <Route path='/report' element={<Reports />} />
          <Route path='/setting' element={<Setting />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
