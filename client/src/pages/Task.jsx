import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/axiosHelper";
import Modal from "../component/model/Model";
import AddTaskForm from "../component/taskform/AddTaskForm";
import ShimmerGrid from "../component/common/ShimmerGrid";
import toast from "react-hot-toast";
import { getInitials, getAvatarColor, formatDueDate } from "../utils/uiHelpers";
import "../component/tasklist/myTasks.css";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const owner = searchParams.get("owner") || searchParams.get("owners") || "";
  const team = searchParams.get("team") || "";
  const project = searchParams.get("project") || "";
  const tags = searchParams.get("tags") || "";
  const status = searchParams.get("status") || "";
  const sort = searchParams.get("sort") || "";

  useEffect(() => {
    loadTasks();
    loadFilters();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const tasksRes = await api.get("/tasks");
      setTasks(tasksRes.data?.data?.tasks || []);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const loadFilters = async () => {
    try {
      const [usersRes, teamsRes, projectsRes, tagsRes] = await Promise.all([
        api.get("/users").catch(() => ({ data: { data: { users: [] } } })),
        api.get("/teams").catch(() => ({ data: { data: { team: [] } } })),
        api
          .get("/projects")
          .catch(() => ({ data: { data: { project: [] } } })),
        api.get("/tags").catch(() => ({ data: { data: { tag: [] } } })),
      ]);
      setUsers(usersRes.data?.data?.users || []);
      setTeams(teamsRes.data?.data?.team || []);
      setProjects(projectsRes.data?.data?.project || []);
      setTagsList(tagsRes.data?.data?.tag?.map((t) => t.name) || []);
    } catch (err) {
      console.error("Failed to load filter options:", err);
    }
  };

  const fetchTasksOnly = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data?.data?.tasks || []);
    } catch (err) {
      console.error(err);
    }
  };

  const availableTags = useMemo(() => {
    const fromTasks = tasks.flatMap((t) => t.tags || []);
    return Array.from(new Set([...tagsList, ...fromTasks])).filter(Boolean);
  }, [tagsList, tasks]);

  const updateFilter = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (key === "owner") nextParams.delete("owners");
    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
    setSearchParams(nextParams);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSearchParams({});
  };

  const resolveDropdownValue = (paramValue, list) => {
    if (!paramValue) return "";
    const byName = list.find(
      (item) => item.name?.toLowerCase() === paramValue.toLowerCase(),
    );
    if (byName) return byName.name;
    const byId = list.find((item) => item._id === paramValue);
    return byId ? byId.name : paramValue;
  };

  const filteredTasks = useMemo(() => {
    const normalizeStatus = (val) => {
      if (!val) return "";
      if (val.toLowerCase() === "inprogress") return "in progress";
      if (val.toLowerCase() === "todo") return "to do";
      return val.toLowerCase();
    };

    let list = tasks.filter((t) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = t.name?.toLowerCase().includes(q);
        const matchProj = (t.project?.name || "").toLowerCase().includes(q);
        const matchTeam = (t.team?.name || "").toLowerCase().includes(q);
        const matchTag = (t.tags || []).some((tg) =>
          tg.toLowerCase().includes(q),
        );
        if (!matchTitle && !matchProj && !matchTeam && !matchTag) return false;
      }

      if (owner) {
        const ownerLower = owner.toLowerCase();
        const matched = (t.owners || []).some((o) => {
          const oId = typeof o === "object" ? o._id : o;
          const oName = typeof o === "object" ? o.name : "";
          return (
            oId === owner ||
            (oName && oName.toLowerCase().includes(ownerLower))
          );
        });
        if (!matched) return false;
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
        const reqTags = tags
          .split(",")
          .map((tg) => tg.trim().toLowerCase())
          .filter(Boolean);
        const taskTags = (t.tags || []).map((tg) => tg.toLowerCase());
        if (!reqTags.some((rt) => taskTags.includes(rt))) {
          return false;
        }
      }

      return true;
    });

    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    if (sort === "name") {
      list = [...list].sort((a, b) =>
        (a.name || "").localeCompare(b.name || ""),
      );
    } else if (sort === "-name") {
      list = [...list].sort((a, b) =>
        (b.name || "").localeCompare(a.name || ""),
      );
    } else if (sort === "status") {
      list = [...list].sort((a, b) =>
        (a.status || "").localeCompare(b.status || ""),
      );
    } else if (sort === "-createdAt" || sort === "newest") {
      list = [...list].sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      );
    } else if (sort === "oldest") {
      list = [...list].sort(
        (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0),
      );
    } else if (sort === "due_asc") {
      list = [...list].sort(
        (a, b) => (a.timeToComplete || 0) - (b.timeToComplete || 0),
      );
    } else if (sort === "due_desc") {
      list = [...list].sort(
        (a, b) => (b.timeToComplete || 0) - (a.timeToComplete || 0),
      );
    } else if (sort === "priority" || sort === "priority_desc") {
      list = [...list].sort(
        (a, b) =>
          (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2),
      );
    } else if (sort === "priority_asc") {
      list = [...list].sort(
        (a, b) =>
          (priorityOrder[b.priority] || 2) - (priorityOrder[a.priority] || 2),
      );
    }

    return list;
  }, [tasks, searchQuery, owner, team, project, status, tags, sort]);

  const handleAddTask = () => {
    if (!localStorage.getItem("userToken")) {
      window.location.href = "/login";
      return;
    }
    setShowTaskModal(true);
  };

  const markComplete = async (id) => {
    if (!localStorage.getItem("userToken")) {
      window.location.href = "/login";
      return;
    }
    try {
      await api.post(`/tasks/${id}`, { status: "Completed" });
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

  const deleteTask = async (id) => {
    if (!localStorage.getItem("userToken")) {
      window.location.href = "/login";
      return;
    }
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task._id !== id));
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const hasFilters = Boolean(
    owner || team || project || tags || status || sort || searchQuery,
  );

  return (
    <div className='task-container animate-fade-in'>
      <div className='d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4'>
        <div>
          <h2 className='fw-bold mb-1'>Tasks</h2>
          <p className='text-secondary mb-0'>
            Filter by owner, team, project, tags, or status and share filtered
            views via URL
          </p>
        </div>
        <button className='btn btn-primary shadow-sm' onClick={handleAddTask}>
          + Add Task
        </button>
      </div>

      {/* URL-Based Filters Section */}
      <div className='task-filters'>
        <input
          type='text'
          placeholder='Search tasks...'
          aria-label='Search tasks'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

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
          {teams.map((tm) => (
            <option key={tm._id} value={tm.name}>
              {tm.name}
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
          {availableTags.map((tg) => (
            <option key={tg} value={tg}>
              {tg}
            </option>
          ))}
        </select>

        <select
          aria-label='Filter by Status'
          value={status === "InProgress" ? "In Progress" : status}
          onChange={(e) => updateFilter("status", e.target.value)}>
          <option value=''>All Statuses</option>
          <option value='To Do'>To Do</option>
          <option value='In Progress'>In Progress</option>
          <option value='Completed'>Completed</option>
          <option value='Blocked'>Blocked</option>
        </select>

        <select
          aria-label='Sort By'
          value={sort}
          onChange={(e) => updateFilter("sort", e.target.value)}>
          <option value=''>Sort By</option>
          <option value='priority_desc'>Priority (High → Low)</option>
          <option value='priority_asc'>Priority (Low → High)</option>
          <option value='due_asc'>Time to Complete ↑</option>
          <option value='due_desc'>Time to Complete ↓</option>
          <option value='name'>Name (A–Z)</option>
          <option value='-name'>Name (Z–A)</option>
          <option value='status'>Status</option>
          <option value='-createdAt'>Newest First</option>
        </select>

        {hasFilters && (
          <button
            type='button'
            className='clear-filter-btn'
            onClick={clearFilters}>
            Reset
          </button>
        )}
      </div>

      {/* Task List */}
      {loading ? (
        <div className='task-grid'>
          <ShimmerGrid count={6} />
        </div>
      ) : filteredTasks.length === 0 ? (
        <div
          className='text-center py-5 border rounded p-4'
          style={{ background: "var(--card-bg)" }}>
          <h5 className='text-secondary fw-bold mb-1'>No tasks found</h5>
          <p className='text-muted mb-0'>
            No tasks match your current filter selection.
          </p>
        </div>
      ) : (
        <div className='task-grid'>
          {filteredTasks.map((t) => {
            const owners = (t.owners || []).filter(Boolean);
            const priorityLevel = t.priority || "Medium";
            const dueText = formatDueDate(t.dueDate, t.createdAt, t.timeToComplete);

            return (
              <div
                key={t._id}
                className='shadow-sm task-card'
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/tasks/${t._id}`)}>
                <div className='d-flex justify-content-between align-items-center gap-2 mb-2'>
                  <span
                    className={`task-status-badge ${(t.status || "To Do").replace(/\s+/g, "")}`}>
                    {t.status || "To Do"}
                  </span>
                  <span className={`priority-badge ${priorityLevel}`}>
                    ⚑ {priorityLevel}
                  </span>
                </div>

                <h5>{t.name}</h5>

                <div className='task-due-date'>
                  Due on: <strong>{dueText}</strong>
                </div>

                {(t.project?.name || (t.tags && t.tags.length > 0)) && (
                  <div className='d-flex flex-wrap align-items-center gap-1 mb-2'>
                    {t.project?.name && (
                      <span className='task-tag-chip'>{t.project.name}</span>
                    )}
                    {(t.tags || []).slice(0, 2).map((tg, idx) => (
                      <span key={idx} className='task-tag-chip'>
                        #{tg}
                      </span>
                    ))}
                  </div>
                )}

                <div className='task-card-footer'>
                  <div className='task-owner-group'>
                    {owners.length === 0 ? (
                      <>
                        <div
                          className='task-avatar-circle'
                          style={{ background: "#64748b" }}>
                          UN
                        </div>
                        <span className='task-owner-name'>Unassigned</span>
                      </>
                    ) : owners.length === 1 ? (
                      <>
                        <div
                          className='task-avatar-circle'
                          style={{
                            background: getAvatarColor(owners[0].name || "U", 0),
                          }}
                          title={owners[0].name}>
                          {getInitials(owners[0].name)}
                        </div>
                        <span className='task-owner-name'>
                          {owners[0].name}
                        </span>
                      </>
                    ) : (
                      <div className='task-avatar-stack'>
                        {owners.slice(0, 3).map((o, idx) => {
                          const oName = typeof o === "object" ? o.name : "User";
                          return (
                            <div
                              key={o._id || idx}
                              className='task-avatar-circle'
                              style={{ background: getAvatarColor(oName, idx) }}
                              title={oName}>
                              {getInitials(oName)}
                            </div>
                          );
                        })}
                        {owners.length > 3 && (
                          <div
                            className='task-avatar-circle more'
                            title={`${owners.length - 3} more`}>
                            +{owners.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className='task-actions-inline'>
                    {t.status !== "Completed" && (
                      <button
                        type='button'
                        className='complete-btn'
                        title='Mark task complete'
                        onClick={(e) => {
                          e.stopPropagation();
                          markComplete(t._id);
                        }}>
                        ✔ Done
                      </button>
                    )}

                    <button
                      type='button'
                      className='delete-btn'
                      title='Delete task'
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTask(t._id);
                      }}>
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        show={showTaskModal}
        title='Add Task'
        onClose={() => setShowTaskModal(false)}>
        <AddTaskForm
          onSuccess={fetchTasksOnly}
          onClose={() => setShowTaskModal(false)}
        />
      </Modal>
    </div>
  );
}
