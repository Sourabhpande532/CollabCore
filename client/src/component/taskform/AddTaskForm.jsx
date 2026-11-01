import { useEffect, useState } from "react";
import { createTask, getUsers } from "../../api/task.api";
import { getProjects } from "../../api/project.api";
import { getTeams } from "../../api/team.api";
import toast from "react-hot-toast";
import axios from "../../api/axiosHelper";
import "../model/modelcss/model.css";

const initialState = {
  name: "",
  project: "",
  team: "",
  owners: [],
  tags: [],
  timeToComplete: "",
  dueDate: "",
  status: "To Do",
  priority: "Medium",
};

const AddTaskForm = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState(initialState);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [newTagInput, setNewTagInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getProjects().then((res) => setProjects(res.data?.data?.project || []));
    getUsers().then((res) => setUsers(res.data?.data?.users || []));
    getTeams().then((res) => setTeams(res.data?.data?.team || []));
    axios
      .get("/tags")
      .then((res) => {
        const fetched = res.data?.data?.tag?.map((t) => t.name) || [];
        setAvailableTags(
          fetched.length > 0
            ? fetched
            : ["Urgent", "Bug", "Immediate", "Tech"],
        );
      })
      .catch(() => setAvailableTags(["Urgent", "Bug", "Immediate", "Tech"]));
  }, []);

  const handleAddTag = async () => {
    const trimmed = newTagInput.trim();
    if (!trimmed) return;
    if (
      availableTags.some((t) => t.toLowerCase() === trimmed.toLowerCase())
    ) {
      toast.error("Tag already exists");
      return;
    }
    try {
      await axios.post("/tags", { name: trimmed });
    } catch {
      // Fallback if tag endpoint fails
    }
    setAvailableTags((prev) => [...prev, trimmed]);
    setForm((prev) => ({ ...prev, tags: [...prev.tags, trimmed] }));
    setNewTagInput("");
    toast.success("Tag added");
  };

  const toggleTag = (tag) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleOwnerSelect = (userId) => {
    setForm((prev) => ({
      ...prev,
      owners: prev.owners.includes(userId)
        ? prev.owners.filter((id) => id !== userId)
        : [...prev.owners, userId],
    }));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const payload = {
      name: form.name.trim(),
      project: form.project,
      team: form.team,
      owners: form.owners,
      tags: form.tags,
      timeToComplete: Number(form.timeToComplete) || 1,
      dueDate: form.dueDate || undefined,
      status: form.status,
      priority: form.priority,
    };

    if (!payload.name || !payload.project || !payload.team) {
      toast.error("Task Name, Project & Team are required");
      return;
    }

    try {
      setSubmitting(true);
      await createTask(payload);
      setForm(initialState);
      if (onSuccess) onSuccess();
      if (onClose) onClose();
      toast.success("Task Created Successfully");
    } catch (err) {
      console.error("Create Task Error:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Failed to create task");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='add-task-form-wrapper'>
      <form onSubmit={handleSubmit}>
        <div className='row g-3'>
          {/* Task Name */}
          <div className='col-12'>
            <label htmlFor='task-name-input' className='form-label'>
              Task Name
            </label>
            <input
              id='task-name-input'
              className='form-control'
              placeholder='Enter task name'
              name='name'
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Project */}
          <div className='col-12 col-md-6'>
            <label htmlFor='task-project-select' className='form-label'>
              Project Name
            </label>
            <select
              id='task-project-select'
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
          <div className='col-12 col-md-6'>
            <label htmlFor='task-team-select' className='form-label'>
              Team
            </label>
            <select
              id='task-team-select'
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

          {/* Time */}
          <div className='col-12 col-md-6'>
            <label htmlFor='task-time-input' className='form-label'>
              Time to Complete (Days)
            </label>
            <input
              id='task-time-input'
              type='number'
              min='1'
              className='form-control'
              placeholder='Estimated days (e.g. 5)'
              name='timeToComplete'
              value={form.timeToComplete}
              onChange={handleChange}
              required
            />
          </div>

          {/* Due Date */}
          <div className='col-12 col-md-6'>
            <label htmlFor='task-due-date' className='form-label'>
              Due Date (Optional)
            </label>
            <input
              id='task-due-date'
              type='date'
              className='form-control'
              name='dueDate'
              value={form.dueDate}
              onChange={handleChange}
            />
          </div>

          {/* Status */}
          <div className='col-12 col-md-6'>
            <label htmlFor='task-status-select' className='form-label'>
              Status
            </label>
            <select
              id='task-status-select'
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
          <div className='col-12 col-md-6'>
            <label htmlFor='task-priority-select' className='form-label'>
              Priority
            </label>
            <select
              id='task-priority-select'
              className='form-select'
              name='priority'
              value={form.priority}
              onChange={handleChange}>
              <option value='High'>High</option>
              <option value='Medium'>Medium</option>
              <option value='Low'>Low</option>
            </select>
          </div>

          {/* Tags */}
          <div className='col-12'>
            <label className='form-label d-block'>Tags</label>
            <div className='d-flex flex-wrap gap-2 mb-2'>
              {availableTags.map((tag) => {
                const active = form.tags.includes(tag);
                return (
                  <button
                    key={tag}
                    type='button'
                    onClick={() => toggleTag(tag)}
                    className={`btn btn-sm ${active ? "btn-primary" : "btn-outline-secondary"}`}
                    style={{ padding: "0.25rem 0.65rem", fontSize: "0.8rem" }}>
                    #{tag}
                  </button>
                );
              })}
            </div>
            <div className='d-flex gap-2' style={{ maxWidth: "340px" }}>
              <input
                type='text'
                className='form-control form-control-sm'
                placeholder='Add custom tag...'
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <button
                type='button'
                className='btn btn-sm btn-secondary text-nowrap'
                onClick={handleAddTag}>
                + Add Tag
              </button>
            </div>
          </div>

          {/* Assign Owners */}
          <div className='col-12'>
            <label className='form-label'>Assign Owners</label>
            <div className='row g-2'>
              {users.map((user) => {
                const selected = form.owners.includes(user._id);

                return (
                  <div key={user._id} className='col-6 col-sm-4 col-md-3'>
                    <div
                      className={`owner-card-btn ${selected ? "selected" : ""}`}
                      onClick={() => handleOwnerSelect(user._id)}>
                      <div className='avatar-initial'>
                        {user.name
                          ? user.name.charAt(0).toUpperCase()
                          : "U"}
                      </div>
                      <div className='owner-name' title={user.name}>
                        {user.name}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className='d-flex gap-3 mt-4'>
          <button
            type='submit'
            className='btn btn-primary flex-grow-1'
            disabled={submitting}>
            {submitting ? "Creating..." : "Create Task"}
          </button>

          <button
            type='button'
            className='btn btn-secondary flex-grow-1'
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
