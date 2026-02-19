import { useEffect, useState } from "react";
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
    await axios.post(`/teams/${teamId}/members`, { userId: selected });
    onAdded();
    onClose();
    toast.success("Added Member")
  };

  return (
    <div className='modal-overlay'>
      <div className='modal-box'>
        <h4>Add New Member</h4>

        <select onChange={(e) => setSelected(e.target.value)}>
          <option value=''>Select Member</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name}
            </option>
          ))}
        </select>

        <div className='modal-actions'>
          <button onClick={onClose}>Cancel</button>
          <button className='primary-btn' onClick={addMember}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};
export default AddMemberModal;
