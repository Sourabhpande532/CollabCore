import { useEffect, useState } from "react";
import { createTask, getUsers } from "../../api/task.api";
import { getProjects } from "../../api/project.api";
import { getTeams } from "../../api/team.api";
import toast from "react-hot-toast";
import axios from "../../api/axiosHelper";

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
      setAvailableTags([...availableTags, trimmed]);
      setForm({ ...form, tags: [...form.tags, trimmed] });
      setNewTagInput("");
      toast.success("Tag created successfully");
    } catch (err) {
      setAvailableTags([...availableTags, trimmed]);
      setForm({ ...form, tags: [...form.tags, trimmed] });
      setNewTagInput("");
      toast.success("Tag added to task");
    }
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
    <div style={{ maxHeight: "70vh", overflowY: "auto", paddingRight: "8px" }}>
      <form onSubmit={handleSubmit}>
        <div className='row g-3'>
          {/* Task Name */}
          <div className='col-md-6'>
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

          {/* Time */}
          <div className='col-md-6'>
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

          {/* Project */}
          <div className='col-md-6'>
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
          <div className='col-md-6'>
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

          {/* Status */}
          <div className='col-md-6'>
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
          <div className='col-md-6'>
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

          {/* Due Date */}
          <div className='col-12'>
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

          {/* Owners */}
          <div className='col-12'>
            <label className='form-label d-block'>Owners (Team Members)</label>
            <div className='d-flex flex-wrap gap-2'>
              {users.map((u) => {
                const checkId = `add-task-owner-${u._id}`;
                return (
                  <div key={u._id} className='form-check form-check-inline'>
                    <input
                      id={checkId}
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
                    <label htmlFor={checkId} className='form-check-label'>
                      {u.name}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tags */}
          <div className='col-12'>
            <label className='form-label d-block'>Tags</label>
            <div className='d-flex flex-wrap gap-2 mb-2'>
              {availableTags.map((tag) => {
                const tagId = `add-task-tag-${tag}`;
                return (
                  <div key={tag} className='form-check form-check-inline'>
                    <input
                      id={tagId}
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
                    <label htmlFor={tagId} className='form-check-label'>
                      {tag}
                    </label>
                  </div>
                );
              })}
            </div>
            <div className='d-flex mt-2' style={{ maxWidth: "320px" }}>
              <input
                type='text'
                className='form-control form-control-sm me-2'
                placeholder='New Tag Name'
                aria-label='New Tag Name'
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
                className='btn btn-sm btn-secondary'
                onClick={handleAddTag}>
                + Add Tag
              </button>
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
