import { useEffect, useState } from "react";
import axios from "../../api/axiosHelper";
import "./model.css";
import toast from "react-hot-toast";

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
      toast.success("Project Task completed");
    } catch (err) {
      console.error("Create task failed", err);
      alert("Failed to create task");
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className='modal d-block' tabIndex='-1'>
      <div className='modal-dialog modal-dialog-centered modal-lg'>
        <div className='modal-content' style={{ maxHeight: "90vh" }}>
          {/* HEADER */}
          <div className='modal-header'>
            <h5 className='modal-title'>
              Create New Task for{" "}
              <span className='text-primary'>{projectName}</span>
            </h5>
            <button
              type='button'
              className='btn-close'
              onClick={onClose}></button>
          </div>

          {/* BODY (Scrollable) */}
          <div className='modal-body' style={{ overflowY: "auto" }}>
            <div className='container-fluid'>
              <div className='row g-3'>
                {/* TASK NAME */}
                <div className='col-12'>
                  <input
                    className='form-control'
                    placeholder='Task name'
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                {/* TEAM */}
                <div className='col-12 col-md-6'>
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
                  <input
                    type='number'
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
                  <select
                    className='form-select'
                    value={form.priority}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        priority: e.target.value,
                      })
                    }>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>

                {/* TAGS */}
                <div className='col-12'>
                  <input
                    className='form-control'
                    placeholder='Tags (comma separated)'
                    onChange={(e) =>
                      setForm({
                        ...form,
                        tags: e.target.value.split(",").map((t) => t.trim()),
                      })
                    }
                  />
                </div>

                {/* OWNERS */}
                <div className='col-12'>
                  <label className='form-label fw-semibold'>Owners</label>

                  <div className='row g-2'>
                    {users.map((user) => {
                      const selected = form.owners.includes(user._id);

                      return (
                        <div key={user._id} className='col-6 col-sm-4 col-md-3'>
                          <div
                            className={`border rounded p-2 text-center ${
                              selected
                                ? "bg-primary text-white border-primary"
                                : ""
                            }`}
                            style={{ cursor: "pointer", fontSize: "14px" }}
                            onClick={() => handleOwnerSelect(user._id)}>
                            <div className='fw-bold'>
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
          <div className='modal-footer'>
            <button className='btn btn-primary' onClick={handleSubmit}>
              Create Task
            </button>
            <button className='btn btn-secondary' onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
