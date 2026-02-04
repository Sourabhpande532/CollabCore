import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axiosHelper";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const status = searchParams.get("status") || "";

  // fetch tasks when URL changes
  useEffect(() => {
    api
      .get("/tasks?" + searchParams.toString())
      .then((res) => setTasks(res.data.data.tasks));
  }, [searchParams]);

  // handle dropdown change
  const handleStatusChange = (e) => {
    const value = e.target.value;

    if (value) {
      setSearchParams({ status: value });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="container mt-4">
      <h3>Tasks</h3>

      {/* 🔽 Dropdown Filter */}
      <select
        className="form-select mb-3"
        value={status}
        onChange={handleStatusChange}
      >
        <option value="">All Tasks</option>
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
        <option value="Blocked">Blocked</option>
      </select>

      {/* 🧾 Task List */}
      {tasks.length === 0 && <p>No tasks found</p>}

      {tasks.map((t) => (
        <div key={t._id} className="card p-2 mb-2">
          <b>{t.name}</b>
          <div>Status: {t.status}</div>
          <div>Project: {t.project?.name}</div>
          <div>Team: {t.team?.name}</div>
        </div>
      ))}
    </div>
  );
}
