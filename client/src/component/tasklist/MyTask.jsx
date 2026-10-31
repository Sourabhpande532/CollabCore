/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "../../api/axiosHelper";
import "./myTasks.css";
import toast from "react-hot-toast";
import ShimmerGrid from "../common/ShimmerGrid";
import useLoading from "../../hooks/useLoading";
import {
  formatDueDate,
  getAvatarColor,
  getInitials,
} from "../../utils/uiHelpers";

const MyTasks = ({ refresh, searchQuery = "", onAddTask }) => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const owner = searchParams.get("owner") || searchParams.get("owners") || "";
  const team = searchParams.get("team") || "";
  const project = searchParams.get("project") || "";
  const status = searchParams.get("status") || "";
  const tags = searchParams.get("tags") || "";
  const sort = searchParams.get("sort") || "";

  const { loading, startLoading, stopLoading } = useLoading(true);

  useEffect(() => {
    fetchTasks();
  }, [refresh]);

  useEffect(() => {
    fetchFilters();
  }, []);

  const fetchTasks = async () => {
    try {
      startLoading();
      const res = await axios.get("/tasks");
      setTasks(res.data?.data?.tasks || []);
    } catch (error) {
      console.error(error);
    } finally {
      stopLoading();
    }
  };

  const fetchFilters = async () => {
    try {
      const [userRes, teamRes, projectRes, tagRes] = await Promise.all([
        axios.get("/users").catch(() => ({ data: { data: { users: [] } } })),
        axios.get("/teams").catch(() => ({ data: { data: { team: [] } } })),
        axios.get("/projects").catch(() => ({ data: { data: { project: [] } } })),
        axios.get("/tags").catch(() => ({ data: { data: { tag: [] } } })),
      ]);
      setUsers(userRes.data?.data?.users || []);
      setTeams(teamRes.data?.data?.team || []);
      setProjects(projectRes.data?.data?.project || []);
      setTagsList(tagRes.data?.data?.tag?.map((t) => t.name) || []);
    } catch (error) {
      console.error("Error fetching filters:", error);
    }
  };

  const availableTags = useMemo(() => {
    const taskTags = tasks.flatMap((t) => t.tags || []);
    return Array.from(new Set([...tagsList, ...taskTags])).filter(Boolean);
  }, [tagsList, tasks]);

  const resolveDropdownValue = (paramValue, list) => {
    if (!paramValue) return "";
    const byName = list.find(
      (item) => item.name?.toLowerCase() === paramValue.toLowerCase(),
    );
    if (byName) return byName.name;
    const byId = list.find((item) => item._id === paramValue);
    return byId ? byId.name : paramValue;
  };

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (key === "owner") newParams.delete("owners");
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  const filteredTasks = useMemo(() => {
    const normalizeStatus = (val) => {
      if (!val) return "";
      if (val.toLowerCase() === "inprogress") return "in progress";
      if (val.toLowerCase() === "todo") return "to do";
      return val.toLowerCase();
    };

    let result = tasks.filter((t) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = t.name?.toLowerCase().includes(q);
        const matchesProject = (t.project?.name || "").toLowerCase().includes(q);
        const matchesTeam = (t.team?.name || "").toLowerCase().includes(q);
        const matchesTag = (t.tags || []).some((tg) =>
          tg.toLowerCase().includes(q),
        );
        if (!matchesName && !matchesProject && !matchesTeam && !matchesTag) {
          return false;
        }
      }

      if (owner) {
        const ownerLower = owner.toLowerCase();
        const hasOwner = (t.owners || []).some((o) => {
          const oId = typeof o === "object" ? o._id : o;
          const oName = typeof o === "object" ? o.name : "";
          return (
            oId === owner ||
            (oName && oName.toLowerCase().includes(ownerLower))
          );
        });
        if (!hasOwner) return false;
      }

      if (team) {
        const teamLower = team.toLowerCase();
        const tId = typeof t.team === "object" ? t.team?._id : t.team;
        const tName = typeof t.team === "object" ? t.team?.name : "";
        if (
          tId !== team &&
          (!tName || !tName.toLowerCase().includes(teamLower))
        ) {
          return false;
        }
      }

      if (project) {
        const projLower = project.toLowerCase();
        const pId = typeof t.project === "object" ? t.project?._id : t.project;
        const pName = typeof t.project === "object" ? t.project?.name : "";
        if (
          pId !== project &&
          (!pName || !pName.toLowerCase().includes(projLower))
        ) {
          return false;
        }
      }

      if (status) {
        if (normalizeStatus(t.status) !== normalizeStatus(status)) {
          return false;
        }
      }

      if (tags) {
        const requestedTags = tags
          .split(",")
          .map((tg) => tg.trim().toLowerCase())
          .filter(Boolean);
        const taskTagsLower = (t.tags || []).map((tg) => tg.toLowerCase());
        const matchesTags = requestedTags.some((reqTag) =>
          taskTagsLower.includes(reqTag),
        );
        if (!matchesTags) return false;
      }

      return true;
    });

    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    if (sort === "due_asc") {
      result = [...result].sort(
        (a, b) => (a.timeToComplete || 0) - (b.timeToComplete || 0),
      );
    } else if (sort === "due_desc") {
      result = [...result].sort(
        (a, b) => (b.timeToComplete || 0) - (a.timeToComplete || 0),
      );
    } else if (sort === "priority" || sort === "priority_desc") {
      result = [...result].sort(
        (a, b) =>
          (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2),
      );
    } else if (sort === "priority_asc") {
      result = [...result].sort(
        (a, b) =>
          (priorityOrder[b.priority] || 2) - (priorityOrder[a.priority] || 2),
      );
    }

    return result;
  }, [tasks, searchQuery, owner, team, project, status, tags, sort]);

  const deleteTask = async (id) => {
    if (!localStorage.getItem("userToken")) {
      window.location.href = "/login";
      return;
    }
    try {
      await axios.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task._id !== id));
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const markComplete = async (id) => {
    if (!localStorage.getItem("userToken")) {
      window.location.href = "/login";
      return;
    }
    try {
      await axios.post(`/tasks/${id}`, { status: "Completed" });
      setTasks((prev) =>
        prev.map((task) =>
          task._id === id ? { ...task, status: "Completed" } : task,
        ),
      );
      toast.success("Task completed successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update task");
    }
  };

  const activeStatus = status === "InProgress" ? "In Progress" : status;
  const hasActiveFilters = Boolean(
    owner || team || project || status || tags || sort,
  );

  return (
    <div className='task-container'>
      {/* Section Header (Matches Reference PDF Screen 2: My Tasks + Filter + "+ New Task") */}
      <div className='dashboard-section-header d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3'>
        <div className='d-flex align-items-center gap-3 flex-wrap'>
          <h2 className='fw-bold mb-0 fs-4'>My Tasks</h2>
          <select
            className='form-select form-select-sm w-auto'
            style={{ minWidth: "130px", height: "34px", fontSize: "0.82rem" }}
            aria-label='Quick filter tasks by status'
            value={activeStatus}
            onChange={(e) => updateFilter("status", e.target.value)}>
            <option value=''>Filter: All Status</option>
            <option value='To Do'>To Do</option>
            <option value='In Progress'>In Progress</option>
            <option value='Completed'>Completed</option>
            <option value='Blocked'>Blocked</option>
          </select>

          {/* Quick Filters from Reference PDF Screen 1 & 2 */}
          <div className='d-none d-md-flex align-items-center gap-1'>
            {["", "In Progress", "Completed", "To Do", "Blocked"].map((st) => {
              const isSelected = activeStatus === st;
              return (
                <button
                  key={st || "all"}
                  type='button'
                  onClick={() => updateFilter("status", st)}
                  className={`quick-filter-pill ${isSelected ? "active" : ""}`}>
                  {st || "All"}
                </button>
              );
            })}
          </div>
        </div>

        {onAddTask && (
          <button
            className='btn btn-primary btn-sm px-3 py-2 shadow-sm dashboard-action-btn'
            onClick={onAddTask}>
            + New Task
          </button>
        )}
      </div>

      {/* Multi-Criteria URL Filter Bar */}
      <div className='task-filters'>
        <select
          aria-label='Filter by Owner'
          value={resolveDropdownValue(owner, users)}
          onChange={(e) => updateFilter("owner", e.target.value)}>
          <option value=''>All Owners</option>
          {users.map((u) => (
            <option key={u._id} value={u.name}>
              {u.name}
            </option>
          ))}
        </select>

        <select
          aria-label='Filter by Team'
          value={resolveDropdownValue(team, teams)}
          onChange={(e) => updateFilter("team", e.target.value)}>
          <option value=''>All Teams</option>
          {teams.map((t) => (
            <option key={t._id} value={t.name}>
              {t.name}
            </option>
          ))}
        </select>

        <select
          aria-label='Filter by Project'
          value={resolveDropdownValue(project, projects)}
          onChange={(e) => updateFilter("project", e.target.value)}>
          <option value=''>All Projects</option>
          {projects.map((p) => (
            <option key={p._id} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          aria-label='Filter by Tag'
          value={tags}
          onChange={(e) => updateFilter("tags", e.target.value)}>
          <option value=''>All Tags</option>
          {availableTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>

        <select
          aria-label='Sort tasks'
          value={sort}
          onChange={(e) => updateFilter("sort", e.target.value)}>
          <option value=''>Sort by</option>
          <option value='due_asc'>Time to Complete ↑</option>
          <option value='due_desc'>Time to Complete ↓</option>
          <option value='priority'>Priority (High → Low)</option>
          <option value='priority_asc'>Priority (Low → High)</option>
        </select>

        {hasActiveFilters && (
          <button
            type='button'
            className='clear-filter-btn'
            onClick={clearAllFilters}>
            Reset
          </button>
        )}
      </div>

      {/* TASK GRID (Matches Reference PDF Screen 2 Task Cards) */}
      <div className='task-grid'>
        {loading ? (
          <ShimmerGrid count={6} />
        ) : filteredTasks.length === 0 ? (
          <div
            className='w-100 text-center py-5 border rounded px-3'
            style={{ gridColumn: "1 / -1", background: "var(--card-bg)" }}>
            <h5 className='text-secondary fw-bold mb-1'>No tasks found</h5>
            <p className='text-muted mb-0'>
              Try adjusting your filters or search criteria.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const validOwners = (task.owners || []).filter(
              (o) => typeof o === "object" && o?.name,
            );
            const priorityLevel = task.priority || "Medium";
            const formattedDate = formatDueDate(
              task.dueDate,
              task.createdAt,
              task.timeToComplete,
            );
            const metaParts = [task.project?.name, task.team?.name].filter(
              Boolean,
            );

            return (
              <div
                key={task._id}
                className='shadow-sm task-card'
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/tasks/${task._id}`)}>
                <div className='d-flex justify-content-between align-items-center gap-2 mb-2'>
                  <span
                    className={`task-status-badge ${(task.status || "To Do").replace(/\s+/g, "")}`}>
                    {task.status || "To Do"}
                  </span>
                  <span className={`priority-badge ${priorityLevel}`}>
                    ⚑ {priorityLevel}
                  </span>
                </div>

                <h5 className='mb-1'>{task.name}</h5>

                <p className='task-due-line mb-1'>
                  Due on: <strong>{formattedDate}</strong>
                  {task.timeToComplete ? ` • ${task.timeToComplete}d est.` : ""}
                </p>

                {metaParts.length > 0 && (
                  <p className='task-meta mb-2'>{metaParts.join(" • ")}</p>
                )}

                {task.tags && task.tags.length > 0 && (
                  <div className='d-flex flex-wrap gap-1 mb-2'>
                    {task.tags.map((tag, idx) => (
                      <span key={idx} className='task-tag-chip'>
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className='task-card-footer mt-auto pt-2 border-top d-flex justify-content-between align-items-center gap-2'>
                  {/* Owner Avatars (Reference PDF Screen 2 style) */}
                  <div className='task-owner-stack d-flex align-items-center'>
                    {validOwners.length === 0 ? (
                      <span className='text-secondary small'>Unassigned</span>
                    ) : validOwners.length === 1 ? (
                      <div className='d-flex align-items-center gap-2'>
                        <span
                          className='owner-circle-avatar'
                          style={{
                            backgroundColor: getAvatarColor(
                              validOwners[0].name,
                            ),
                          }}>
                          {getInitials(validOwners[0].name)}
                        </span>
                        <span
                          className='small fw-semibold text-truncate'
                          style={{
                            maxWidth: "120px",
                            color: "var(--text-secondary)",
                          }}>
                          {validOwners[0].name}
                        </span>
                      </div>
                    ) : (
                      <div className='d-flex align-items-center'>
                        {validOwners.slice(0, 3).map((o, i) => (
                          <span
                            key={o._id || i}
                            title={o.name}
                            className='owner-circle-avatar stacked'
                            style={{
                              backgroundColor: getAvatarColor(o.name),
                              marginLeft: i === 0 ? 0 : "-8px",
                            }}>
                            {getInitials(o.name)}
                          </span>
                        ))}
                        {validOwners.length > 3 && (
                          <span
                            className='owner-circle-avatar stacked more-count'
                            style={{ marginLeft: "-8px" }}>
                            +{validOwners.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Quick Card Actions */}
                  <div className='d-flex align-items-center gap-1'>
                    {task.status !== "Completed" && (
                      <button
                        type='button'
                        title='Mark as Complete'
                        className='complete-btn'
                        onClick={(e) => {
                          e.stopPropagation();
                          markComplete(task._id);
                        }}>
                        ✔ Done
                      </button>
                    )}

                    <button
                      type='button'
                      title='Delete task'
                      aria-label={`Delete task ${task.name}`}
                      className='delete-btn'
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTask(task._id);
                      }}>
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
export { MyTasks };
