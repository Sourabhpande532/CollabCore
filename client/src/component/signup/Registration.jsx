import { useState } from "react";
import "./register.css";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const Registration = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { userRegister } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const validateForm = (values) => {
    const nextErrors = {};
    const name = (values.name || "").trim();
    const email = (values.email || "").trim();
    const password = values.password || "";

    if (!name) {
      nextErrors.name = "Full name is required";
    } else if (name.length < 2) {
      nextErrors.name = "Full name must be at least 2 characters";
    }

    if (!email) {
      nextErrors.email = "Email address is required";
    } else if (!EMAIL_REGEX.test(email)) {
      nextErrors.email = "Please enter a valid email address";
    }

    if (!password || !password.trim()) {
      nextErrors.password = "Password is required";
    } else if (password.trim().length < 6) {
      nextErrors.password = "Password must be at least 6 characters";
    }

    return nextErrors;
  };

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const register = async (e) => {
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
      const success = await userRegister({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      if (success) {
        navigate("/login", { replace: true });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='signup-page-container'>
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

      <div className='signup-box animate-fade-in'>
        <div className='text-center mb-3'>
          <Link to='/' className='auth-brand-link'>
            ❖ CollabCore
          </Link>
        </div>
        <h2>Create Account</h2>
        <p className='text-center text-secondary mb-4'>
          Join CollabCore to collaborate with your team
        </p>

        <form onSubmit={register} noValidate>
          <div className='user-box'>
            <label htmlFor='signup-name'>Full Name</label>
            <input
              id='signup-name'
              type='text'
              name='name'
              className={errors.name ? "input-error" : ""}
              value={form.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              placeholder='Your full name'
              autoComplete='name'
              aria-invalid={Boolean(errors.name)}
              required
            />
            {errors.name && (
              <span className='auth-error-text' role='alert'>
                {errors.name}
              </span>
            )}
          </div>

          <div className='user-box'>
            <label htmlFor='signup-email'>Email Address</label>
            <input
              id='signup-email'
              type='email'
              name='email'
              className={errors.email ? "input-error" : ""}
              value={form.email}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              placeholder='name@company.com'
              autoComplete='email'
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
            <label htmlFor='signup-password'>Password</label>
            <div className='password-input-wrapper'>
              <input
                id='signup-password'
                type={showPassword ? "text" : "password"}
                name='password'
                className={errors.password ? "input-error" : ""}
                value={form.password}
                onChange={(e) => handleFieldChange("password", e.target.value)}
                placeholder='••••••••'
                autoComplete='new-password'
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

          <button type='submit' className='signup-btn' disabled={submitting}>
            {submitting ? "Creating Account..." : "Sign Up"}
          </button>

          <div className='login-link-container'>
            Already have an account? <Link to='/login'>Sign In</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export { Registration };
