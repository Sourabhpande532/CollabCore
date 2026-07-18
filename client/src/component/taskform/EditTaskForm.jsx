import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { updateTask } from "../../api/task.api";
import { getProjects } from "../../api/project.api";
import { getTeams } from "../../api/team.api";
import { getUsers } from "../../api/task.api";
import toast from "react-hot-toast";

const EditTaskModal = ({ task, onClose, onUpdated }) => {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);

  const [form, setForm] = useState({
    name: task?.name || "",
    project: task?.project?._id || task?.project || "",
    team: task?.team?._id || task?.team || "",
    owners: task?.owners?.map(o => o._id || o) || [],
    tags: task?.tags || [],
    dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
    timeToComplete: task?.timeToComplete || "",
    priority: task?.priority || "Medium",
    status: task?.status || "To Do",
  });

  /* ---------------- FETCH DATA ---------------- */

  useEffect(() => {
    fetchTeams();
    fetchUsers();
    fetchProjects();
  }, []);

  const fetchTeams = async () => {
    const res = await getTeams();
    setTeams(res.data?.data?.team || []);
  };

  const fetchUsers = async () => {
    const res = await getUsers();
    setUsers(res.data?.data?.users || []);
  };

  const fetchProjects = async () => {
    const res = await getProjects();
    setProjects(res.data?.data?.project || []);
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
    if (!form.name || !form.project || !form.team) {
      toast.error("Task Name, Project & Team are required");
      return;
    }

    try {
      const res = await updateTask(task._id, {
        name: form.name,
        project: form.project,
        team: form.team,
        owners: form.owners,
        tags: form.tags,
        dueDate: form.dueDate,
        timeToComplete: Number(form.timeToComplete),
        priority: form.priority,
        status: form.status,
      });
      // Update UI
      onUpdated(res.data.data.task);
      onClose();
      toast.success("Task Updated Successfully");
    } catch (err) {
      console.error("Update task failed", err);
      toast.error(err.response?.data?.message || "Failed to update task");
    }
  };

  /* ---------------- UI ---------------- */

  return ReactDOM.createPortal(
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000,
        backdropFilter: "blur(8px)",
      }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        onClick={(e) => e.stopPropagation()}
        style={{ margin: "auto", width: "100%", maxWidth: "800px" }}
      >
        <div
          className="modal-content"
          style={{
            maxHeight: "90vh",
            backgroundColor: "var(--card-bg, #fff)",
            color: "var(--text-primary, #000)",
            borderRadius: "12px",
            border: "1px solid var(--glass-border, #ddd)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* HEADER */}
          <div className="modal-header">
            <h5 className="modal-title">Edit Task</h5>
            <button
              type="button"
              style={{background:'red', color:"black"}}
              onClick={onClose}
            ></button>
          </div>

          {/* BODY (Scrollable) */}
          <div className="modal-body" style={{ overflowY: "auto" }}>
            <div className="container-fluid">
              <div className="row g-3">
                {/* TASK NAME */}
                <div className="col-12">
                  <input
                    className="form-control"
                    placeholder="Task name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                {/* PROJECT */}
                <div className="col-12 col-md-6">
                  <select
                    className="form-select"
                    value={form.project}
                    onChange={(e) =>
                      setForm({ ...form, project: e.target.value })
                    }
                  >
                    <option value="">Select Project</option>
                    {projects.map((proj) => (
                      <option key={proj._id} value={proj._id}>
                        {proj.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* TEAM */}
                <div className="col-12 col-md-6">
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
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>

                {/* STATUS */}
                <div className="col-12 col-md-6">
                  <select
                    className="form-select"
                    value={form.status}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>

                {/* TAGS */}
                <div className="col-12">
                  <input
                    className="form-control"
                    placeholder="Tags (comma separated)"
                    value={form.tags.join(", ")}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        tags: e.target.value.split(",").map((t) => t.trim()).filter(t => t),
                      })
                    }
                  />
                </div>

                {/* OWNERS */}
                <div className="col-12">
                  <label className="form-label fw-semibold">Owners</label>

                  <div className="row g-2">
                    {users.map((user) => {
                      const selected = form.owners.includes(user._id);

                      return (
                        <div key={user._id} className="col-6 col-sm-4 col-md-3">
                          <div
                            className={`border rounded p-2 text-center ${selected
                              ? "bg-primary text-white border-primary"
                              : ""
                              }`}
                            style={{ cursor: "pointer", fontSize: "14px" }}
                            onClick={() => handleOwnerSelect(user._id)}
                          >
                            <div className="fw-bold">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <small>{user.name}</small>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER (Always Visible) */}
          <div className="modal-footer">
            <button className="btn btn-primary me-2" onClick={handleSubmit}>
              Update Task
            </button>
            <button className="btn btn-secondary text-black" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default EditTaskModal;
