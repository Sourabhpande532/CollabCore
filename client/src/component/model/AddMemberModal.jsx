import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "../../api/axiosHelper";
import "./modelcss/model.css";
import "./modelcss/addMember.css";
import toast from "react-hot-toast";

const AddMemberModal = ({ teamId, onClose, onAdded }) => {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    axios
      .get("/users")
      .then((res) => setUsers(res.data?.data?.users || res.data?.users || []))
      .catch((err) => {
        console.error("Error fetching users:", err);
        setUsers([]);
      });
  }, []);

  const addMember = async () => {
    if (!selected) {
      toast.error("Please select a member");
      return;
    }
    try {
      await axios.post(`/teams/${teamId}/members`, { userId: selected });
      if (onAdded) onAdded();
      onClose();
      toast.success("Member added successfully");
    } catch (err) {
      console.error("Error adding member:", err);
      toast.error(err.response?.data?.error || "Failed to add member");
    }
  };

  return ReactDOM.createPortal(
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal-box sm' onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h5 className="modal-title fw-bold">Add New Member</h5>
          <button type="button" className="close-btn" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <label className="form-label mb-2">Select Team Member</label>
          <select 
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="form-select"
          >
            <option value=''>Select Member</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        {/* Footer */}
        <div className='modal-footer'>
          <button className='btn btn-primary' onClick={addMember}>
            Add Member
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AddMemberModal;
