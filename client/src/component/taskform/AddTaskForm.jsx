import { useEffect, useState } from "react";
import { createTask, getTasks, getUsers } from "../../api/task.api";
import { getProjects } from "../../api/project.api";
import { getTeams } from "../../api/team.api";
import toast from "react-hot-toast";
const initialState = {
  name: "",
  project: "",
  team: "",
  owners: [],
  tags: [],
  timeToComplete: "",
  status: "To Do",
};

const AddTaskForm = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState(initialState);

  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
 
  // fetch dropdown data
  useEffect(() => {
    getProjects().then((res) => setProjects(res.data?.data?.project || []));
    getUsers().then((res) => setUsers(res.data?.data?.users || []));
    getTeams().then((res) => setTeams(res.data?.data?.team || []));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    getTasks();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name.trim(),
      project: form.project,
      team: form.team,
      owners: form.owners,
      tags: form.tags,
      timeToComplete: Number(form.timeToComplete),
      status: form.status,
    };

    // basic validation
    if (!payload.name || !payload.project || !payload.team) {
      toast.error("Task Name, Project & Team are required");
      return;
    }
    try {
      await createTask(payload);
      setForm(initialState);
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Create Task Error:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Failed to create task");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Task Name */}
      <input
        className='form-control mb-2'
        placeholder='Task Name'
        name='name'
        value={form.name}
        onChange={handleChange}
        required
      />

      {/* Project */}
      <select
        className='form-control mb-2'
        name='project'
        value={form.project}
        onChange={handleChange}
        required>
        <option value=''>Select Project</option>
        {projects.map((p) => (
          <option key={p._id} value={p._id}>
            {p.name}
          </option>
        ))}
      </select>

      {/* Team (ObjectId only) */}
      <select
        className='form-control mb-2'
        name='team'
        value={form.team}
        onChange={handleChange}
        required>
        <option value=''>Select Team</option>
        {teams.map((t) => (
          <option key={t._id} value={t._id}>
            {t.name}
          </option>
        ))}
      </select>

      <div className='mb-2'>
        <label className='form-label'>Owners</label>
        {users.map((u) => (
          <div key={u._id} className='form-check'>
            <input
              type='checkbox'
              className='form-check-input'
              value={u._id}
              checked={form.owners.includes(u._id)}
              onChange={(e) => {
                const updated = e.target.checked
                  ? [...form.owners, u._id]
                  : form.owners.filter((id) => id !== u._id);
                setForm({ ...form, owners: updated });
              }}
            />
            <label className='form-check-label'>{u.name}</label>
          </div>
        ))}
      </div>

      <div className='mb-3'>
        <label className='form-label'>Tags</label>
        {["Urgent", "Bug", "Immediate", "Tech"].map((tag) => (
          <div key={tag} className='form-check'>
            <input
              type='checkbox'
              className='form-check-input'
              checked={form.tags.includes(tag)}
              onChange={(e) => {
                const updated = e.target.checked
                  ? [...form.tags, tag]
                  : form.tags.filter((t) => t !== tag);
                setForm({ ...form, tags: updated });
              }}
            />
            <label className='form-check-label'>{tag}</label>
          </div>
        ))}
      </div>

      {/* Time */}
      <input
        type='number'
        className='form-control mb-2'
        placeholder='Time to complete (days)'
        name='timeToComplete'
        value={form.timeToComplete}
        onChange={handleChange}
      />

      {/* Status */}
      <select
        className='form-control mb-3'
        name='status'
        value={form.status}
        onChange={handleChange}>
        <option value='To Do'>To Do</option>
        <option value='In Progress'>In Progress</option>
        <option value='Completed'>Completed</option>
        <option value='Blocked'>Blocked</option>
      </select>

      {/* Buttons */}
      <div className='d-flex gap-2'>
        <button type='submit' onClick={handleSubmit} className='btn btn-primary w-50'>
          Create
        </button>
        <button
          type='button'
          className='btn btn-secondary w-50'
          onClick={() => {
            setForm(initialState);
            onClose();
          }}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddTaskForm;
