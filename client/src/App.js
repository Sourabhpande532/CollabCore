import "../src/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Signup } from "./pages/Signup";
import { Signin } from "./pages/Signin";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <BrowserRouter>
      <Toaster
        position='top-right'
        toastOptions={{
          style: {
            fontSize: "1.8rem",
          },
        }}
      />
      <Routes>
        <Route path='/login' element={<Signin />} />
        <Route path='/signup' element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
