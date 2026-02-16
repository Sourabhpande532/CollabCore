import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/axiosHelper";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const status = searchParams.get("status") || "";
  const sort = searchParams.get("sort") || "";

  // Fetch tasks when URL changes
  useEffect(() => {
    api
      .get("/tasks?" + searchParams.toString())
      .then((res) => setTasks(res.data.data.tasks));
  }, [searchParams]);

  // Handle status filter
  const handleStatusChange = (e) => {
    const value = e.target.value;

    const params = {};
    if (value) params.status = value;
    if (sort) params.sort = sort;

    setSearchParams(params);
  };

  // Handle sorting
  const handleSortChange = (e) => {
    const value = e.target.value;

    const params = {};
    if (status) params.status = status;
    if (value) params.sort = value;

    setSearchParams(params);
  };

  return (
    <div className='container mt-4'>
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <h3 className='fw-bold'>Tasks</h3>
      </div>

      {/* Filters Section */}
      <div className='row mb-4'>
        <div className='col-md-6 mb-2'>
          <select
            className='form-select'
            value={status}
            onChange={handleStatusChange}>
            <option value=''>Filter by Status</option>
            <option value='To Do'>To Do</option>
            <option value='In Progress'>In Progress</option>
            <option value='Completed'>Completed</option>
            <option value='Blocked'>Blocked</option>
          </select>
        </div>

        <div className='col-md-6 mb-2'>
          <select
            className='form-select'
            value={sort}
            onChange={handleSortChange}>
            <option value=''>Sort By</option>
            <option value='name'>Name (A-Z)</option>
            <option value='-name'>Name (Z-A)</option>
            <option value='status'>Status</option>
            <option value='-createdAt'>Newest First</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      {tasks.length === 0 && (
        <div className='alert alert-secondary text-center'>No tasks found</div>
      )}

      <div className='row'>
        {tasks.map((t) => (
          <div key={t._id} className='col-md-6 col-lg-4 mb-3'>
            <div
              className='card shadow-sm h-100 task-card'
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/tasks/${t._id}`)}>
              <div className='card-body'>
                <h5 className='card-title fw-semibold'>{t.name}</h5>

                <p className='mb-1'>
                  <span className='badge bg-primary'>{t.status}</span>
                </p>

                <small className='text-muted d-block'>
                  Project: {t.project?.name || "N/A"}
                </small>
                <small className='text-muted d-block'>
                  Team: {t.team?.name || "N/A"}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
