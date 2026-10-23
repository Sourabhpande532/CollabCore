import { useState } from "react";
import "./register.css";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Registration = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { userRegister } = useAuth();
  const register = async (e) => {
    e.preventDefault();
    await userRegister(form);
    navigate("/login", { replace: true });
  };

  return (
    <div className='signup-page-container'>
      <div className='signup-box animate-fade-in'>
        <h2>Create Account</h2>
        <p className='text-center text-secondary mb-4'>Join CollabCore today</p>

        <form onSubmit={register}>
          <div className='user-box'>
            <label>Full Name</label>
            <input
              type='text'
              name='name'
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder='Your Name'
              required
            />
          </div>

          <div className='user-box'>
            <label>Email Address</label>
            <input
              type='email'
              name='email'
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder='name@company.com'
              required
            />
          </div>

          <div className='user-box'>
            <label>Password</label>
            <div className='password-input-wrapper'>
              <input
                type={showPassword ? "text" : "password"}
                name='password'
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder='••••••••'
                required
              />
              <button
                type='button'
                className='password-toggle-btn'
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}>
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

          <button type='submit' className='signup-btn'>
            Sign Up
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
