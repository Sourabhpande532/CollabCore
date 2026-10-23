import { useState } from "react";
import "./login.css";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const success = await login(form);
    if (success) {
      navigate("/dashboard", { replace: true });
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
      navigate("/dashboard", { replace: true });
    }
  };

  return (
    <div className="login-page-container">
      <div className='login-box animate-fade-in'>
        <h2>Welcome Back</h2>
        <p className="text-center text-secondary mb-4">Sign in to continue to CollabCore</p>

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
            <div className='password-input-wrapper'>
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                required
              />
              <button
                type='button'
                className='password-toggle-btn'
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="23" x2="23" y2="1"></line>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
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

export { Login };
