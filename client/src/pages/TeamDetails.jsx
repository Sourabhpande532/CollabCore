/* eslint-disable react-hooks/exhaustive-deps */
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import axios from "../api/axiosHelper";
import AddMemberModal from "../component/model/AddMemberModal";
import { getInitials, getAvatarColor, formatDueDate } from "../utils/uiHelpers";
import "../component/tasklist/myTasks.css";
import "../../src/App.css";

const TeamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [team, setTeam] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sort, setSort] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("");
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

  const filteredTasks = useMemo(() => {
    let list = tasks.filter((t) => {
      if (statusFilter && t.status !== statusFilter) return false;
      if (ownerFilter) {
        const hasOwner = (t.owners || []).some(
          (o) => (typeof o === "object" ? o._id : o) === ownerFilter,
        );
        if (!hasOwner) return false;
      }
      return true;
    });

    if (sort === "due_asc") {
      list = [...list].sort(
        (a, b) => (a.timeToComplete || 0) - (b.timeToComplete || 0),
      );
    } else if (sort === "due_desc") {
      list = [...list].sort(
        (a, b) => (b.timeToComplete || 0) - (a.timeToComplete || 0),
      );
    } else if (sort === "status") {
      list = [...list].sort((a, b) =>
        (a.status || "").localeCompare(b.status || ""),
      );
    }
    return list;
  }, [tasks, statusFilter, ownerFilter, sort]);

  const handleAddMember = () => {
    if (!localStorage.getItem("userToken")) {
      window.location.href = "/login";
      return;
    }
    setShowModal(true);
  };

  return (
    <div className='team-details-page animate-fade-in'>
      <div className='mb-3'>
        <button
          type='button'
          className='btn btn-outline-secondary btn-sm'
          onClick={() => navigate("/team")}>
          ← Back to Teams
        </button>
      </div>

      <div className='d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3'>
        <div>
          <h2 className='fw-bold mb-1'>{team?.name || "Team Workspace"}</h2>
          <p className='text-secondary mb-0'>
            {team?.description || "Manage team members and assigned tasks"}
          </p>
        </div>
        <div className='d-flex flex-wrap gap-2 align-items-center'>
          <select
            className='form-select w-auto'
            aria-label='Filter tasks by status'
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}>
            <option value=''>All Statuses</option>
            <option value='To Do'>To Do</option>
            <option value='In Progress'>In Progress</option>
            <option value='Completed'>Completed</option>
            <option value='Blocked'>Blocked</option>
          </select>

          <select
            className='form-select w-auto'
            aria-label='Filter tasks by member'
            value={ownerFilter}
            onChange={(e) => setOwnerFilter(e.target.value)}>
            <option value=''>All Members</option>
            {(team?.members || []).map((m) => (
              <option key={m._id} value={m._id}>
                {m.name}
              </option>
            ))}
          </select>

          <select
            className='form-select w-auto'
            aria-label='Sort team tasks'
            value={sort}
            onChange={(e) => setSort(e.target.value)}>
            <option value=''>Sort by</option>
            <option value='due_asc'>Time to Complete ↑</option>
            <option value='due_desc'>Time to Complete ↓</option>
            <option value='status'>Status</option>
          </select>

          <button className='primary-btn' onClick={handleAddMember}>
            + Add Member
          </button>
        </div>
      </div>

      <div className='row g-4 mb-4'>
        {/* Members Section matching Reference Screen 8 */}
        <div className='col-lg-4'>
          <div className='card p-3 h-100 d-flex flex-column'>
            <h6
              className='text-secondary fw-bold text-uppercase small mb-3'
              style={{ letterSpacing: "0.06em" }}>
              Members ({team?.members?.length || 0})
            </h6>
            <div className='flex-grow-1'>
              {team?.members && team.members.length > 0 ? (
                team.members.map((m, idx) => (
                  <div key={m._id || idx} className='member-row'>
                    <div
                      style={{
                        borderRadius: "50%",
                        width: "34px",
                        height: "34px",
                        backgroundColor: getAvatarColor(m.name || "U", idx),
                        fontSize: "0.75rem",
                      }}
                      className='me-2 d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0'>
                      {getInitials(m.name)}
                    </div>
                    <div className='overflow-hidden'>
                      <div className='fw-semibold text-truncate'>{m.name}</div>
                      {m.email && (
                        <div
                          className='text-secondary text-truncate'
                          style={{ fontSize: "0.75rem" }}>
                          {m.email}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className='text-secondary small'>
                  No members assigned to this team yet.
                </p>
              )}
            </div>

            <div className='mt-3 pt-2 border-top'>
              <button
                type='button'
                className='btn btn-primary btn-sm px-3 fw-semibold'
                onClick={handleAddMember}>
                + Member
              </button>
            </div>
          </div>
        </div>

        {/* Team Tasks Section */}
        <div className='col-lg-8'>
          <div className='card p-3 h-100'>
            <h6
              className='text-secondary fw-bold text-uppercase small mb-3'
              style={{ letterSpacing: "0.06em" }}>
              Assigned Tasks ({filteredTasks.length})
            </h6>
            {loading ? (
              <div className='text-center py-4'>
                <div className='spinner-border text-primary' role='status'>
                  <span className='visually-hidden'>Loading...</span>
                </div>
              </div>
            ) : filteredTasks.length === 0 ? (
              <p className='text-secondary small mb-0'>
                No tasks match the selected filters for this team.
              </p>
            ) : (
              <div className='d-flex flex-column gap-2'>
                {filteredTasks.map((task) => {
                  const ownerNames = (task.owners || [])
                    .map((o) => o.name)
                    .filter(Boolean)
                    .join(", ");
                  const dueText = formatDueDate(
                    task.dueDate,
                    task.createdAt,
                    task.timeToComplete,
                  );

                  return (
                    <div
                      key={task._id}
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/tasks/${task._id}`)}
                      className='task-card p-3 d-flex justify-content-between align-items-center flex-wrap gap-2'>
                      <div>
                        <strong className='d-block mb-1'>{task.name}</strong>
                        <span className='text-secondary small'>
                          Due on: <strong>{dueText}</strong>
                          {ownerNames ? ` • Owners: ${ownerNames}` : ""}
                        </span>
                      </div>
                      <div className='d-flex align-items-center gap-2'>
                        <span
                          className={`priority-badge ${task.priority || "Medium"}`}>
                          ⚑ {task.priority || "Medium"}
                        </span>
                        <span
                          className={`task-status-badge ${(task.status || "To Do").replace(/\s+/g, "")}`}>
                          {task.status || "To Do"}
                        </span>
                      </div>
                    </div>
                  );
                })}
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
