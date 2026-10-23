/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "../../api/axiosHelper";
import "./myTasks.css";
import toast from "react-hot-toast";
import ShimmerGrid from "../common/ShimmerGrid";
import useLoading from "../../hooks/useLoading";

const MyTasks = ({ refresh, searchQuery = "" }) => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const owner = searchParams.get("owner") || "";
  const team = searchParams.get("team") || "";
  const project = searchParams.get("project") || "";
  const status = searchParams.get("status") || "";
  const sort = searchParams.get("sort") || "";
  const { loading, startLoading, stopLoading } = useLoading();

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [searchParams, refresh]);

  const fetchFilters = async () => {
    try {
      const [userRes, teamRes, projectRes] = await Promise.all([
        axios.get("/users"),
        axios.get("/teams"),
        axios.get("/projects"),
      ]);
      setUsers(userRes.data.data.users);
      setTeams(teamRes.data.data.team);
      setProjects(projectRes.data.data.project);
    } catch (error) {
      console.error("Error fetching filters:", error);
    }
  };
  const fetchTasks = async () => {
    try {
      startLoading();
      const res = await axios.get("/tasks/filter", {
        params: { owner, team, project, status, sort },
      });
      setTasks(res.data.data.tasks);
    } catch (error) {
      console.error(error);
    } finally {
      stopLoading(false);
    }
  };

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };
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
      toast.error("Failed to delete");
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
    }
  };
  return (
    <div className='task-container'>
      {/* FILTERS */}
      <div className='task-filters'>
        <select
          value={owner}
          onChange={(e) => updateFilter("owner", e.target.value)}>
          <option value=''>All Owners</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name}
            </option>
          ))}
        </select>

        <select
          value={team}
          onChange={(e) => updateFilter("team", e.target.value)}>
          <option value=''>All Teams</option>
          {teams.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>

        <select
          value={project}
          onChange={(e) => updateFilter("project", e.target.value)}>
          <option value=''>All Projects</option>
          {projects.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => updateFilter("status", e.target.value)}>
          <option value=''>All Status</option>
          <option value='To Do'>To Do</option>
          <option value='In Progress'>In Progress</option>
          <option value='Completed'>Completed</option>
        </select>

        <select
          value={sort}
          onChange={(e) => updateFilter("sort", e.target.value)}>
          <option value=''>Sort by</option>
          <option value='due_asc'>Due Date ↑</option>
          <option value='due_desc'>Due Date ↓</option>
          <option value='priority'>Priority</option>
        </select>
      </div>

      {/* TASK GRID */}
      <div className='task-grid'>
        {loading ? (
          <ShimmerGrid count={15} />
        ) : tasks.length === 0 ? (
          <div className="w-100 text-center py-5" style={{ gridColumn: "1 / -1" }}>
            <h5 className="text-secondary fw-bold">No tasks found</h5>
            <p className="text-muted">Try adjusting your filters.</p>
          </div>
        ) : (
          tasks
            .filter((task) => {
              if (!searchQuery) return true;
              const q = searchQuery.toLowerCase();
              return (
                task.name.toLowerCase().includes(q) ||
                (task.project?.name || "").toLowerCase().includes(q)
              );
            })
            .map((task) => (
            <div
              key={task._id}
              className='shadow-sm task-card'
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/tasks/${task._id}`)}>
              <div className={`badge ${task.status.replace(" ", "")}`}>
                {task.status}
              </div>
              <h5 className='fs-6'>{task.name}</h5>
              <p className='task-meta'>
                {task.project?.name} • {task.team?.name}
              </p>
              <div className='mt-2'>
                <span
                  className={`badge rounded-pill px-3 py-2 d-inline-flex align-items-center gap-1 ${
                    task.priority === "High"
                      ? "bg-danger"
                      : task.priority === "Medium"
                        ? "bg-warning text-dark"
                        : "bg-success"
                  }`}>
                  {task.priority === "High" && "🔴"}
                  {task.priority === "Medium" && "🟡"}
                  {task.priority === "Low" && "🟢"}
                  {task.priority}
                </span>
              </div>

              <div className='task-actions'>
                {task.status !== "Completed" && (
                  <button
                    className='complete-btn'
                    onClick={(e) => {
                      e.stopPropagation();
                      markComplete(task._id);
                    }}>
                    ✔ Complete
                  </button>
                )}

                <button
                  className='delete-btn'
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTask(task._id);
                  }}>
                  🗑 Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export { MyTasks };
