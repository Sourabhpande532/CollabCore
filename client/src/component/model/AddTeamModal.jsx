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
    try {
      const res = await axios.get("/users");
      setUsers(res.data?.data?.users || res.data?.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
    }
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
    if (!form.name.trim()) {
      toast.error("Team name is required");
      return;
    }
    try {
      await axios.post("/teams", form);
      if (onCreated) onCreated();
      onClose();
      toast.success("Team Added");
    } catch (err) {
      console.error("Error creating team:", err);
      toast.error(err.response?.data?.error || "Failed to create team");
    }
  };

  return ReactDOM.createPortal(
    <div className='modal-overlay' onClick={onClose}>
      <div className='custom-modal' onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h5 className="modal-title fw-bold">Create New Team</h5>
          <button type="button" className="close-btn" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="modal-body">
          {/* Team Name */}
          <div className='form-group mb-3'>
            <label className="form-label">Team Name</label>
            <input
              type='text'
              className="form-control"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder='Enter team name'
            />
          </div>

          {/* Description */}
          <div className='form-group mb-3'>
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder='Enter description'
              rows={3}
            />
          </div>

          {/* Members */}
          <div className='form-group mb-3'>
            <label className="form-label">Add Members</label>
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
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <span>{user.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className='modal-footer'>
          <button className='btn btn-primary' onClick={createTeam}>
            Create Team
          </button>
          <button className='btn btn-secondary' onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AddTeamModal;
