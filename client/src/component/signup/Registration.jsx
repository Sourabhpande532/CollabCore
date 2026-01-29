import "./regi.css";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

const Registration = () => {
  const navigate = useNavigate();

  const register = async (e) => {
    e.preventDefault();
    toast.success("Form submitted (API coming soon)");
    // later you can connect backend here
  };

  return (
    <div className='auth-container'>
      <div className='auth-card'>
        <h1 className='auth-title'>Register</h1>

        <form className='auth-form' onSubmit={register}>
          <input name='name' type='text' placeholder='Full Name' required />

          <input name='email' type='email' placeholder='Email' required />

          <input
            name='password'
            type='password'
            placeholder='Password'
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
