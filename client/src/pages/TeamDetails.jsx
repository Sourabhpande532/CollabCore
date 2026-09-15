/* eslint-disable react-hooks/exhaustive-deps */
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axiosHelper";
import AddMemberModal from "../component/model/AddMemberModal";
import "../../src/App.css";

const TeamDetails = () => {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [team, setTeam] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchTasks();
      fetchTeamDetails();
    }
  }, [id, sort]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`/tasks/team/${id}`, {
        params: { sort },
      });
      setTasks(res.data?.data?.tasks || []);
    } catch (error) {
      console.error("Failed to fetch team tasks:", error);
      setTasks([]);
    }
  };

  const fetchTeamDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/teams/${id}`);
      setTeam(res.data?.data?.team || null);
    } catch (error) {
      console.error("Failed to fetch team details:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='team-details-page animate-fade-in'>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold mb-1">{team?.name || "Team Workspace"}</h2>
          <p className="text-secondary mb-0">Manage team members and assigned tasks</p>
        </div>
        <div className='d-flex gap-2 align-items-center'>
          <select
            className='form-select w-auto'
            value={sort}
            onChange={(e) => setSort(e.target.value)}>
            <option value=''>Sort by</option>
            <option value='due_asc'>Due Date ↑</option>
            <option value='due_desc'>Due Date ↓</option>
            <option value='status'>Status</option>
          </select>
          <button className='primary-btn ms-2' onClick={() => setShowModal(true)}>
            + Add Member
          </button>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {/* Members Section */}
        <div className="col-lg-4">
          <div className="card p-3 h-100">
            <h5 className="fw-bold mb-3">Members ({team?.members?.length || 0})</h5>
            {team?.members && team.members.length > 0 ? (
              team.members.map((m) => (
                <div key={m._id} className='member-row'>
                  <div style={{ borderRadius: "50%", width: "25px", height: "25px", backgroundColor: "#0f766e", fontSize: "0.75rem" }} className='me-2 d-flex align-items-center justify-content-center text-white fw-bold'>{m.name ? m.name[0].toUpperCase() : "U"}</div>
                  <span className="fw-semibold">{m.name}</span>
                </div>
              ))
            ) : (
              <p className="text-secondary small">No members assigned to this team yet.</p>
            )}
          </div>
        </div>

        {/* Team Tasks Section */}
        <div className="col-lg-8">
          <div className="card p-3 h-100">
            <h5 className="fw-bold mb-3">Assigned Tasks ({tasks.length})</h5>
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : tasks.length === 0 ? (
              <p className="text-secondary small">No tasks assigned to this team.</p>
            ) : (
              <div className="d-flex flex-column gap-2">
                {tasks.map((task) => (
                  <div key={task._id} className='task-card p-3 d-flex justify-content-between align-items-center flex-wrap gap-2'>
                    <div>
                      <strong className="d-block mb-1">{task.name}</strong>
                      <span className="text-secondary small">Priority: {task.priority || "Normal"}</span>
                    </div>
                    <span className={`badge rounded-pill px-3 py-2 ${
                      task.status === "Completed" ? "bg-success" : task.status === "In Progress" ? "bg-warning text-dark" : "bg-secondary"
                    }`}>
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <AddMemberModal
          teamId={id}
          onClose={() => setShowModal(false)}
          onAdded={fetchTeamDetails}
        />
      )}
    </div>
  );
};

export { TeamDetails };
