import { useEffect, useState } from "react";
import { createTask, getUsers } from "../../api/task.api";
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
  priority: "Medium",
};

const AddTaskForm = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState(initialState);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    getProjects().then((res) => setProjects(res.data?.data?.project || []));
    getUsers().then((res) => setUsers(res.data?.data?.users || []));
    getTeams().then((res) => setTeams(res.data?.data?.team || []));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
      priority: form.priority,
    };

    if (!payload.name || !payload.project || !payload.team) {
      toast.error("Task Name, Project & Team are required");
      return;
    }

    try {
      await createTask(payload);
      setForm(initialState);
      onSuccess();
      onClose();
      toast.success("Task Created Successfully");
    } catch (err) {
      console.error("Create Task Error:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Failed to create task");
    }
  };

  return (
    <div style={{ maxHeight: "70vh", overflowY: "auto", paddingRight: "8px" }}>
      <form onSubmit={handleSubmit}>
        <div className='row'>
          {/* Task Name */}
          <div className='col-md-6 mb-2'>
            <input
              className='form-control'
              placeholder='Task Name'
              name='name'
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Time */}
          <div className='col-md-6 mb-2'>
            <input
              type='number'
              className='form-control'
              placeholder='Time (days)'
              name='timeToComplete'
              value={form.timeToComplete}
              onChange={handleChange}
            />
          </div>

          {/* Project */}
          <div className='col-md-6 mb-2'>
            <select
              className='form-select'
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
          </div>

          {/* Team */}
          <div className='col-md-6 mb-2'>
            <select
              className='form-select'
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
          </div>

          {/* Status */}
          <div className='col-12 mb-3'>
            <select
              className='form-select'
              name='status'
              value={form.status}
              onChange={handleChange}>
              <option value='To Do'>To Do</option>
              <option value='In Progress'>In Progress</option>
              <option value='Completed'>Completed</option>
              <option value='Blocked'>Blocked</option>
            </select>
          </div>

          {/* Priority */}
          <div className='col-12 mb-3'>
            <select
              className='form-select'
              name='priority'
              value={form.priority}
              onChange={handleChange}>
              <option value='High'>High</option>
              <option value='Medium'>Medium</option>
              <option value='Low'>Low</option>
            </select>
          </div>

          {/* Owners */}
          <div className='col-12 mb-3'>
            <label className='form-label'>Owners</label>
            <div>
              {users.map((u) => (
                <div key={u._id} className='form-check form-check-inline'>
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
          </div>

          {/* Tags */}
          <div className='col-12 mb-3'>
            <label className='form-label'>Tags</label>
            <div>
              {["Urgent", "Bug", "Immediate", "Tech"].map((tag) => (
                <div key={tag} className='form-check form-check-inline'>
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
          </div>
        </div>

        {/* Buttons */}
        <div className='d-flex gap-2 mt-3'>
          <button type='submit' className='btn btn-primary w-50'>
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
    </div>
  );
};

export default AddTaskForm;
