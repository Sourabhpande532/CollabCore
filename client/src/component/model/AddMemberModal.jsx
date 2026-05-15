import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "../../api/axiosHelper";
import "./modelcss/addMember.css";
import toast from "react-hot-toast";

const AddMemberModal = ({ teamId, onClose, onAdded }) => {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    axios.get("/users").then((res) => setUsers(res.data.data.users));
  }, []);

  const addMember = async () => {
    if (!selected) {
      toast.error("Please select a member");
      return;
    }
    await axios.post(`/teams/${teamId}/members`, { userId: selected });
    onAdded();
    onClose();
    toast.success("Added Member");
  };

  return ReactDOM.createPortal(
    <div className='modal-overlay' onClick={onClose} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      backdropFilter: 'blur(8px)'
    }}>
      <div className='modal-box' onClick={(e) => e.stopPropagation()} style={{
        backgroundColor: 'var(--card-bg, #fff)',
        color: 'var(--text-primary, #000)',
        padding: '2rem',
        borderRadius: '12px',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}>
        <h4 style={{ marginBottom: '1.5rem', fontWeight: '700' }}>Add New Member</h4>

        <select 
          onChange={(e) => setSelected(e.target.value)}
          className="form-select"
          style={{ marginBottom: '1.5rem' }}
        >
          <option value=''>Select Member</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name}
            </option>
          ))}
        </select>

        <div className='modal-actions' style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className='btn btn-primary' onClick={addMember}>
            Add Member
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
export default AddMemberModal;
