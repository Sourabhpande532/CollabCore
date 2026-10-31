import { useEffect, useState } from "react";
import "./login.css";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import API_URL from "../../api/axiosHelper";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    // Preload Dashboard chunk and warm up API connection while user is on Login screen
    import("../../pages/Dashboard").catch(() => {});
    API_URL.get("/tags").catch(() => {});
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const success = await login(form);
      if (success) {
        navigate("/dashboard", { replace: true });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGuestLogin = async () => {
    if (submitting) return;
    const guestCredentials = {
      email: "a@gmail.com",
      password: "5321",
    };
    setForm(guestCredentials);
    setSubmitting(true);
    try {
      const success = await login(guestCredentials);
      if (success) {
        navigate("/dashboard", { replace: true });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='login-page-container'>
      <button
        type='button'
        className='theme-toggle-btn auth-theme-toggle'
        onClick={toggleTheme}
        aria-label={
          theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"
        }
        title={
          theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"
        }>
        {theme === "light" ? "🌙" : "☀️"}
      </button>

      <div className='login-box animate-fade-in'>
        <div className='text-center mb-3'>
          <Link to='/' className='auth-brand-link'>
            ❖ CollabCore
          </Link>
        </div>
        <h2>Welcome Back</h2>
        <p className='text-center text-secondary mb-4'>
          Sign in to continue to your CollabCore workspace
        </p>

        <form onSubmit={handleLogin}>
          <div className='user-box'>
            <label htmlFor='login-email'>Email Address</label>
            <input
              id='login-email'
              type='email'
              name='email'
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder='e.g. name@company.com'
              autoComplete='email'
              required
            />
          </div>

          <div className='user-box'>
            <label htmlFor='login-password'>Password</label>
            <div className='password-input-wrapper'>
              <input
                id='login-password'
                type={showPassword ? "text" : "password"}
                name='password'
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder='••••••••'
                autoComplete='current-password'
                required
              />
              <button
                type='button'
                className='password-toggle-btn'
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? (
                  <svg
                    width='20'
                    height='20'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'>
                    <path d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24'></path>
                    <line x1='1' y1='23' x2='23' y2='1'></line>
                  </svg>
                ) : (
                  <svg
                    width='20'
                    height='20'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'>
                    <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'></path>
                    <circle cx='12' cy='12' r='3'></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button type='submit' className='login-btn' disabled={submitting}>
            {submitting ? "Signing In..." : "Sign In"}
          </button>

          <button
            type='button'
            className='guest-btn'
            onClick={handleGuestLogin}
            disabled={submitting}>
            {submitting ? "Loading Workspace..." : "Try as Guest"}
          </button>

          <div className='sign-link-container'>
            Don&apos;t have an account? <Link to='/signup'>Create Account</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export { Login };
