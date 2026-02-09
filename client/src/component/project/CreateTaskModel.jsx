import { useEffect, useState } from "react";
import axios from "../../api/axiosHelper";
import "./model.css";

const CreateTaskModal = ({ projectId, onClose, onCreated, projectName }) => {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    name: "",
    team: "",
    owners: [],
    tags: [],
    dueDate: "",
    timeToComplete: "",
    priority: "Medium",
  });

  /* ---------------- FETCH DATA ---------------- */

  useEffect(() => {
    fetchTeams();
    fetchUsers();
  }, []);

  const fetchTeams = async () => {
    const res = await axios.get("/teams");
    setTeams(res.data.data.team);
  };

  const fetchUsers = async () => {
    const res = await axios.get("/users");
    setUsers(res.data.data.users);
  };

  /* ---------------- HANDLERS ---------------- */

  const handleOwnerSelect = (userId) => {
    setForm((prev) => ({
      ...prev,
      owners: prev.owners.includes(userId)
        ? prev.owners.filter((id) => id !== userId)
        : [...prev.owners, userId],
    }));
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post("/tasks", {
        name: form.name,
        project: projectId,
        team: form.team,
        owners: form.owners,
        tags: form.tags,
        dueDate: form.dueDate,
        timeToComplete: Number(form.timeToComplete),
        priority: form.priority,
      });
      // Update UI
      onCreated(res.data.data.task);
      onClose();
    } catch (err) {
      console.error("Create task failed", err);
      alert("Failed to create task");
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className='modal-overlay'>
      <div className='task-modal'>
        <h3>
          Create New Task for <span>{projectName}</span>
        </h3>

        {/* TASK NAME */}
        <input
          placeholder='Task name'
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        {/* TEAM */}
        <select
          value={form.team}
          onChange={(e) => setForm({ ...form, team: e.target.value })}>
          <option value=''>Select Team</option>
          {teams.map((team) => (
            <option key={team._id} value={team._id}>
              {team.name}
            </option>
          ))}
        </select>

        {/* OWNERS */}
        <div className='owners-select'>
          <p className='field-label'>Owners</p>

          <div className='owners-grid'>
            {users.map((user) => {
              const selected = form.owners.includes(user._id);

              return (
                <div
                  key={user._id}
                  className={`owner-option ${selected ? "selected" : ""}`}
                  onClick={() => handleOwnerSelect(user._id)}>
                  <div className='owner-avatar'>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span>{user.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* TAGS */}
        <input
          placeholder='Tags (comma separated)'
          onChange={(e) =>
            setForm({
              ...form,
              tags: e.target.value.split(",").map((t) => t.trim()),
            })
          }
        />

        {/* DUE DATE */}
        <input
          type='date'
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
        />

        {/* TIME */}
        <input
          type='number'
          placeholder='Time (days)'
          value={form.timeToComplete}
          onChange={(e) => setForm({ ...form, timeToComplete: e.target.value })}
        />

        {/* PRIORITY */}
        <select
          value={form.priority}
          onChange={(e) => setForm({ ...form, priority: e.target.value })}>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        {/* ACTIONS */}
        <div className='modal-actions'>
          <button className='btn-primary' onClick={handleSubmit}>
            Create Task
          </button>
          <button className='btn-secondary' onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
