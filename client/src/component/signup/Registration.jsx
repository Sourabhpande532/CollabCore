import { useState } from "react";
import "./regi.css";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Registration = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { userRegister } = useAuth();
  const register = async (e) => {
    e.preventDefault();
    await userRegister(form);
    navigate("/login", { replace: true });
  };

  return (
    <div className='auth-container'>
      <div className='auth-card'>
        <h1 className='auth-title'>Register</h1>

        <form className='auth-form' onSubmit={register}>
          <input
            name='name'
            type='text'
            placeholder='Full Name'
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            name='email'
            type='email'
            placeholder='Email'
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            name='password'
            type='password'
            placeholder='Password'
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <button type='submit'>Register</button>

          <p className='auth-text'>
            Already have an account? <Link to='/login'>Login ➡️</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export { Registration };
