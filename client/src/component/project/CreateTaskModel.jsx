import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "../../api/axiosHelper";
import "../model/modelcss/model.css";
import toast from "react-hot-toast";

const CreateTaskModal = ({ projectId, onClose, onCreated, projectName }) => {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [newTagInput, setNewTagInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    team: "",
    owners: [],
    tags: [],
    dueDate: "",
    timeToComplete: "",
    status: "To Do",
    priority: "Medium",
  });

  useEffect(() => {
    fetchTeams();
    fetchUsers();
    fetchTags();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await axios.get("/teams");
      setTeams(res.data?.data?.team || []);
    } catch (err) {
      console.error("Fetch teams error:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/users");
      setUsers(res.data?.data?.users || []);
    } catch (err) {
      console.error("Fetch users error:", err);
    }
  };

  const fetchTags = async () => {
    try {
      const res = await axios.get("/tags");
      const fetched = res.data?.data?.tag?.map((t) => t.name) || [];
      setAvailableTags(
        fetched.length > 0 ? fetched : ["Urgent", "Bug", "Feature", "Frontend"],
      );
    } catch {
      setAvailableTags(["Urgent", "Bug", "Feature", "Frontend"]);
    }
  };

  const handleOwnerSelect = (userId) => {
    setForm((prev) => ({
      ...prev,
      owners: prev.owners.includes(userId)
        ? prev.owners.filter((id) => id !== userId)
        : [...prev.owners, userId],
    }));
  };

  const toggleTag = (tag) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleAddTag = async () => {
    const trimmed = newTagInput.trim();
    if (!trimmed) return;
    if (availableTags.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
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

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.team) {
      toast.error("Task Name and Team are required");
      return;
    }

    const payload = {
      name: form.name.trim(),
      project: projectId,
      team: form.team,
      owners: form.owners,
      tags: form.tags,
      dueDate: form.dueDate ? form.dueDate : undefined,
      timeToComplete: Number(form.timeToComplete) || 1,
      status: form.status,
      priority: form.priority,
    };

    try {
      setSubmitting(true);
      const res = await axios.post("/tasks", payload);

      if (onCreated) {
        await onCreated(res.data?.data?.task);
      }
      toast.success("Task Created Successfully");
      onClose();
    } catch (err) {
      console.error("Create task failed", err);
      toast.error(err.response?.data?.message || "Failed to create task");
    } finally {
      setSubmitting(false);
    }
  };

  return ReactDOM.createPortal(
    <div className='modal-overlay' onClick={onClose}>
      <div
        className='modal-dialog modal-dialog-centered modal-lg'
        onClick={(e) => e.stopPropagation()}>
        <div className='modal-content'>
          {/* HEADER */}
          <div className='modal-header'>
            <h5 className='modal-title'>
              Create New Task for{" "}
              <span style={{ color: "var(--primary-color)" }}>
                {projectName}
              </span>
            </h5>
            <button
              type='button'
              className='close-btn'
              onClick={onClose}
              aria-label='Close'>
              &times;
            </button>
          </div>

          {/* BODY (Scrollable) */}
          <div className='modal-body'>
            <div className='container-fluid p-0'>
              <div className='row g-3'>
                {/* TASK NAME */}
                <div className='col-12'>
                  <label className='form-label'>Task Name</label>
                  <input
                    className='form-control'
                    placeholder='Task name'
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                {/* TEAM */}
                <div className='col-12 col-md-6'>
                  <label className='form-label'>Team</label>
                  <select
                    className='form-select'
                    value={form.team}
                    onChange={(e) =>
                      setForm({ ...form, team: e.target.value })
                    }>
                    <option value=''>Select Team</option>
                    {teams.map((team) => (
                      <option key={team._id} value={team._id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* TIME */}
                <div className='col-12 col-md-6'>
                  <label className='form-label'>Time to Complete (Days)</label>
                  <input
                    type='number'
                    min='1'
                    className='form-control'
                    placeholder='Time (days)'
                    value={form.timeToComplete}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        timeToComplete: e.target.value,
                      })
                    }
                  />
                </div>

                {/* STATUS */}
                <div className='col-12 col-md-4'>
                  <label className='form-label'>Status</label>
                  <select
                    className='form-select'
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value })
                    }>
                    <option value='To Do'>To Do</option>
                    <option value='In Progress'>In Progress</option>
                    <option value='Completed'>Completed</option>
                    <option value='Blocked'>Blocked</option>
                  </select>
                </div>

                {/* PRIORITY */}
                <div className='col-12 col-md-4'>
                  <label className='form-label'>Priority</label>
                  <select
                    className='form-select'
                    value={form.priority}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        priority: e.target.value,
                      })
                    }>
                    <option value='High'>High</option>
                    <option value='Medium'>Medium</option>
                    <option value='Low'>Low</option>
                  </select>
                </div>

                {/* DUE DATE */}
                <div className='col-12 col-md-4'>
                  <label className='form-label'>Due Date</label>
                  <input
                    type='date'
                    className='form-control'
                    value={form.dueDate}
                    onChange={(e) =>
                      setForm({ ...form, dueDate: e.target.value })
                    }
                  />
                </div>

                {/* TAGS */}
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

                {/* OWNERS */}
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
            </div>
          </div>

          {/* FOOTER */}
          <div className='modal-footer'>
            <button
              className='btn btn-primary'
              onClick={handleSubmit}
              disabled={submitting}>
              {submitting ? "Creating..." : "Create Task"}
            </button>
            <button className='btn btn-secondary' onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default CreateTaskModal;
