import { useEffect, useState } from "react";
import "./login.css";
import { useNavigate, Link } from "react-router-dom";
import {
  GUEST_CREDENTIALS,
  useAuth,
  warmUpGuestSession,
} from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { warmUpDashboardData } from "../../api/axiosHelper";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login, guestLogin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    // Preload Dashboard data and warm up guest session while user is on Login screen
    warmUpDashboardData();
    warmUpGuestSession();
  }, []);

  const validateForm = (values) => {
    const nextErrors = {};
    const email = (values.email || "").trim();
    const password = values.password || "";

    if (!email) {
      nextErrors.email = "Email address is required";
    } else if (!EMAIL_REGEX.test(email)) {
      nextErrors.email = "Please enter a valid email address";
    }

    if (!password || !password.trim()) {
      nextErrors.password = "Password is required";
    } else if (password.trim().length < 4) {
      nextErrors.password = "Password must be at least 4 characters";
    }

    return nextErrors;
  };

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      const success = await login({
        email: form.email.trim(),
        password: form.password,
      });
      if (success) {
        navigate("/dashboard", { replace: true });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGuestLogin = async () => {
    if (submitting) return;
    setErrors({});
    setForm(GUEST_CREDENTIALS);
    setSubmitting(true);
    try {
      const success = await guestLogin();
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

        <form onSubmit={handleLogin} noValidate autoComplete='off'>
          <div className='user-box'>
            <label htmlFor='login-email'>Email Address</label>
            <input
              id='login-email'
              type='email'
              name='email'
              className={errors.email ? "input-error" : ""}
              value={form.email}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              placeholder='e.g. name@company.com'
              autoComplete='off'
              aria-invalid={Boolean(errors.email)}
              required
            />
            {errors.email && (
              <span className='auth-error-text' role='alert'>
                {errors.email}
              </span>
            )}
          </div>

          <div className='user-box'>
            <label htmlFor='login-password'>Password</label>
            <div className='password-input-wrapper'>
              <input
                id='login-password'
                type='text'
                name='login_secret'
                className={[
                  errors.password ? "input-error" : "",
                  !showPassword && form.password ? "password-masked" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                value={form.password}
                onChange={(e) => handleFieldChange("password", e.target.value)}
                placeholder='••••••••'
                autoComplete='off'
                data-lpignore='true'
                data-1p-ignore='true'
                data-form-type='other'
                spellCheck={false}
                aria-invalid={Boolean(errors.password)}
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
            {errors.password && (
              <span className='auth-error-text' role='alert'>
                {errors.password}
              </span>
            )}
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
