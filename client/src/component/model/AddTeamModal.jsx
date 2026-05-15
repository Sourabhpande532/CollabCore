import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "../../api/axiosHelper";
import "./modelcss/addTeam.css";
import toast from "react-hot-toast";

const AddTeamModal = ({ onClose, onCreated }) => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    members: [],
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get("/users");
    setUsers(res.data.data.users);
  };

  const toggleMember = (userId) => {
    setForm((prev) => {
      const exists = prev.members.includes(userId);

      return {
        ...prev,
        members: exists
          ? prev.members.filter((id) => id !== userId)
          : [...prev.members, userId],
      };
    });
  };

  const createTeam = async () => {
    if (!form.name) {
      toast.error("Team name is required");
      return;
    }
    await axios.post("/teams", form);
    onCreated();
    onClose();
    toast.success("Team Added");
  };

  return ReactDOM.createPortal(
    <div className='modal-overlay' onClick={onClose}>
      <div className='custom-modal' onClick={(e) => e.stopPropagation()}>
        <h3>Create New Team</h3>

        {/* Team Name */}
        <div className='form-group'>
          <label>Team Name</label>
          <input
            type='text'
            className="form-control"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder='Enter team name'
          />
        </div>

        {/* Description */}
        <div className='form-group'>
          <label>Description</label>
          <textarea
            className="form-control"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder='Enter description'
            rows={3}
          />
        </div>

        {/* Members */}
        <div className='form-group'>
          <label>Add Members</label>
          <div className='members-grid'>
            {users.map((user) => {
              const selected = form.members.includes(user._id);

              return (
                <div
                  key={user._id}
                  className={`member-card ${selected ? "selected" : ""}`}
                  onClick={() => toggleMember(user._id)}
                >
                  <div className='avatar'>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span>{user.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className='modal-actions'>
          <button className='btn btn-secondary' onClick={onClose}>
            Cancel
          </button>
          <button className='btn btn-primary' onClick={createTeam}>
            Create Team
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
export default AddTeamModal;
