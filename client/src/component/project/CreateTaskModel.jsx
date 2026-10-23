import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "../../api/axiosHelper";
import "../model/modelcss/model.css";
import toast from "react-hot-toast";

const CreateTaskModal = ({ projectId, onClose, onCreated, projectName }) => {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    team: "",
    owners: [],
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
    if (!form.name.trim() || !form.team) {
      toast.error("Task Name and Team are required");
      return;
    }

    const parsedTags = tagInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      name: form.name.trim(),
      project: projectId,
      team: form.team,
      owners: form.owners,
      tags: parsedTags,
      dueDate: form.dueDate ? form.dueDate : undefined,
      timeToComplete: Number(form.timeToComplete) || 1,
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

  /* ---------------- UI ---------------- */

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          {/* HEADER */}
          <div className="modal-header">
            <h5 className="modal-title">
              Create New Task for{" "}
              <span className="text-primary">{projectName}</span>
            </h5>
            <button
              type="button"
              className="close-btn"
              onClick={onClose}
              aria-label="Close"
            >
              &times;
            </button>
          </div>

          {/* BODY (Scrollable) */}
          <div className="modal-body">
            <div className="container-fluid p-0">
              <div className="row g-3">
                {/* TASK NAME */}
                <div className="col-12">
                  <label className="form-label">Task Name</label>
                  <input
                    className="form-control"
                    placeholder="Task name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                {/* TEAM */}
                <div className="col-12 col-md-6">
                  <label className="form-label">Team</label>
                  <select
                    className="form-select"
                    value={form.team}
                    onChange={(e) =>
                      setForm({ ...form, team: e.target.value })
                    }
                  >
                    <option value="">Select Team</option>
                    {teams.map((team) => (
                      <option key={team._id} value={team._id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* TIME */}
                <div className="col-12 col-md-6">
                  <label className="form-label">Time (Days)</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Time (days)"
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
                <div className="col-12 col-md-6">
                  <label className="form-label">Due Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={form.dueDate}
                    onChange={(e) =>
                      setForm({ ...form, dueDate: e.target.value })
                    }
                  />
                </div>

                {/* PRIORITY */}
                <div className="col-12 col-md-6">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-select"
                    value={form.priority}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        priority: e.target.value,
                      })
                    }
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                {/* TAGS */}
                <div className="col-12">
                  <label className="form-label">Tags (comma separated)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Urgent, Frontend, Bug"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                  />
                </div>

                {/* OWNERS */}
                <div className="col-12">
                  <label className="form-label">Assign Owners</label>

                  <div className="row g-2">
                    {users.map((user) => {
                      const selected = form.owners.includes(user._id);

                      return (
                        <div key={user._id} className="col-6 col-sm-4 col-md-3">
                          <div
                            className={`owner-card-btn ${selected ? "selected" : ""}`}
                            onClick={() => handleOwnerSelect(user._id)}
                          >
                            <div className="avatar-initial">
                              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                            </div>
                            <div className="owner-name" title={user.name}>
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
          <div className="modal-footer">
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Creating..." : "Create Task"}
            </button>
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CreateTaskModal;
