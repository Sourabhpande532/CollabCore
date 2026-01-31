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
    <div className='login-box'>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <div className='user-box'>
          <input
            type='email'
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <label>Email</label>
        </div>

        <div className='user-box'>
          <input
            type='password'
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <label>Password</label>
        </div>

        <button type='submit' className='login-btn'>
          Submit
        </button>

        <button type='button' className='guest-btn' onClick={handleGuestLogin}>
          Login as Guest
        </button>
        <br />
        <br />
        <Link className='sign' to='/signup'>
          Sign Up
        </Link>
      </form>
    </div>
  );
};

export { Form };
