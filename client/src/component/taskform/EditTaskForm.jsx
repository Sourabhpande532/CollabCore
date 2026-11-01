import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { updateTask, getUsers } from "../../api/task.api";
import { getProjects } from "../../api/project.api";
import { getTeams } from "../../api/team.api";
import axios from "../../api/axiosHelper";
import toast from "react-hot-toast";
import "../model/modelcss/model.css";

const EditTaskModal = ({ task, onClose, onUpdated }) => {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [newTagInput, setNewTagInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const initialProjectId =
    typeof task?.project === "object"
      ? task?.project?._id
      : task?.project || "";
  const initialTeamId =
    typeof task?.team === "object" ? task?.team?._id : task?.team || "";
  const initialOwners = Array.isArray(task?.owners)
    ? task.owners.map((o) => (typeof o === "object" ? o._id : o))
    : [];
  const initialDueDate = task?.dueDate
    ? new Date(task.dueDate).toISOString().split("T")[0]
    : "";

  const [form, setForm] = useState({
    name: task?.name || "",
    project: initialProjectId,
    team: initialTeamId,
    owners: initialOwners,
    dueDate: initialDueDate,
    timeToComplete: task?.timeToComplete || 1,
    priority: task?.priority || "Medium",
    status: task?.status || "To Do",
  });

  const [tagInput, setTagInput] = useState((task?.tags || []).join(", "));

  useEffect(() => {
    fetchTeams();
    fetchUsers();
    fetchProjects();
    fetchTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await getTeams();
      setTeams(res.data?.data?.team || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data?.data?.users || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await getProjects();
      setProjects(res.data?.data?.project || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTags = async () => {
    try {
      const res = await axios.get("/tags");
      const fetched = res.data?.data?.tag?.map((t) => t.name) || [];
      setAvailableTags(
        Array.from(new Set([...fetched, ...(task?.tags || [])])),
      );
    } catch {
      setAvailableTags(task?.tags || ["Urgent", "Bug", "Feature"]);
    }
  };

  const currentParsedTags = tagInput
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const toggleTagChip = (tag) => {
    const exists = currentParsedTags.some(
      (t) => t.toLowerCase() === tag.toLowerCase(),
    );
    const updated = exists
      ? currentParsedTags.filter((t) => t.toLowerCase() !== tag.toLowerCase())
      : [...currentParsedTags, tag];
    setTagInput(updated.join(", "));
  };

  const handleAddNewTag = async () => {
    const trimmed = newTagInput.trim();
    if (!trimmed) return;
    try {
      await axios.post("/tags", { name: trimmed });
    } catch {
      // Proceed locally even if tag already exists in DB
    }
    if (!availableTags.includes(trimmed)) {
      setAvailableTags((prev) => [...prev, trimmed]);
    }
    if (!currentParsedTags.includes(trimmed)) {
      setTagInput([...currentParsedTags, trimmed].join(", "));
    }
    setNewTagInput("");
    toast.success("Tag added");
  };

  const handleOwnerSelect = (userId) => {
    setForm((prev) => ({
      ...prev,
      owners: prev.owners.includes(userId)
        ? prev.owners.filter((id) => id !== userId)
        : [...prev.owners, userId],
    }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.project || !form.team) {
      toast.error("Task Name, Project & Team are required");
      return;
    }

    const parsedTags = tagInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      name: form.name.trim(),
      project: form.project,
      team: form.team,
      owners: form.owners,
      tags: parsedTags,
      dueDate: form.dueDate ? form.dueDate : undefined,
      timeToComplete: Number(form.timeToComplete) || 1,
      priority: form.priority,
      status: form.status,
    };

    try {
      setSubmitting(true);
      const res = await updateTask(task._id, payload);

      if (onUpdated) {
        await onUpdated(res.data?.data?.task);
      }
      toast.success("Task Updated Successfully");
      onClose();
    } catch (err) {
      console.error("Update task failed", err);
      toast.error(err.response?.data?.message || "Failed to update task");
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
            <h5 className='modal-title'>Edit Task</h5>
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

                {/* PROJECT */}
                <div className='col-12 col-md-6'>
                  <label className='form-label'>Project</label>
                  <select
                    className='form-select'
                    value={form.project}
                    onChange={(e) =>
                      setForm({ ...form, project: e.target.value })
                    }>
                    <option value=''>Select Project</option>
                    {projects.map((proj) => (
                      <option key={proj._id} value={proj._id}>
                        {proj.name}
                      </option>
                    ))}
                  </select>
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
                    {teams.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* TIME */}
                <div className='col-12 col-md-6'>
                  <label className='form-label'>Time (Days)</label>
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

                {/* DUE DATE */}
                <div className='col-12 col-md-6'>
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

                {/* PRIORITY */}
                <div className='col-12 col-md-6'>
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

                {/* STATUS */}
                <div className='col-12 col-md-6'>
                  <label className='form-label'>Status</label>
                  <select
                    className='form-select'
                    value={form.status}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        status: e.target.value,
                      })
                    }>
                    <option value='To Do'>To Do</option>
                    <option value='In Progress'>In Progress</option>
                    <option value='Completed'>Completed</option>
                    <option value='Blocked'>Blocked</option>
                  </select>
                </div>

                {/* TAGS */}
                <div className='col-12'>
                  <label className='form-label'>Tags (comma separated)</label>
                  <input
                    type='text'
                    className='form-control mb-2'
                    placeholder='e.g. Urgent, Frontend, Bug'
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                  />
                  {availableTags.length > 0 && (
                    <div className='d-flex flex-wrap gap-1 mb-2'>
                      {availableTags.map((tag) => {
                        const isSelected = currentParsedTags.some(
                          (t) => t.toLowerCase() === tag.toLowerCase(),
                        );
                        return (
                          <button
                            key={tag}
                            type='button'
                            onClick={() => toggleTagChip(tag)}
                            className={`btn btn-sm ${isSelected ? "btn-primary" : "btn-outline-secondary"}`}
                            style={{ padding: "0.2rem 0.6rem", fontSize: "0.78rem" }}>
                            #{tag}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  <div className='d-flex gap-2' style={{ maxWidth: "340px" }}>
                    <input
                      type='text'
                      className='form-control form-control-sm'
                      placeholder='Create new tag...'
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddNewTag();
                        }
                      }}
                    />
                    <button
                      type='button'
                      className='btn btn-sm btn-secondary text-nowrap'
                      onClick={handleAddNewTag}>
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
              {submitting ? "Updating..." : "Update Task"}
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

export default EditTaskModal;
