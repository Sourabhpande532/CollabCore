import { useState } from "react";
import "./login.css";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Form = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const success = await login(form);
    if (success) {
      navigate("/", { replace: true });
    }
  };
  const handleGuestLogin = async () => {
    const guestCredentials = {
      email: "a@gmail.com",
      password: "5321",
    };
    setForm(guestCredentials); // auto-fill inputs
    const success = await login(guestCredentials);
    if (success) {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="login-page-container">
      <div className='login-box animate-fade-in'>
        <h2>Welcome Back</h2>
        <p className="text-center text-secondary mb-4">Login to continue to Workasana</p>

        <form onSubmit={handleLogin}>
          <div className='user-box'>
            <label>Email Address</label>
            <input
              type='email'
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="e.g. name@company.com"
              required
            />
          </div>

          <div className='user-box'>
            <label>Password</label>
            <input
              type='password'
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              required
            />
          </div>

          <button type='submit' className='login-btn'>
            Sign In
          </button>

          <button type='button' className='guest-btn' onClick={handleGuestLogin}>
            Try as Guest
          </button>
          
          <div className="sign-link-container">
            Don't have an account? <Link to='/signup'>Create Account</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export { Form };
