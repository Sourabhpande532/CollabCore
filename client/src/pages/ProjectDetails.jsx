/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "../api/axiosHelper";
import CreateTaskModal from "../component/project/CreateTaskModel";
import "../pages/productDetails.css";

const ProjectDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchProject();
    fetchTasks();
  }, [id, searchParams]);

  const fetchProject = async () => {
    const res = await axios.get("/projects");
    const found = res.data.data.project.find((p) => p._id === id);
    setProject(found);
  };

  const fetchTasks = async () => {
    setLoading(true);
    const params = Object.fromEntries(searchParams.entries());
    params.project = id;
    const res = await axios.get("/tasks", { params });
    setTasks(res.data.data.tasks);
    setLoading(false);
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

  const STATUS_OPTIONS = ["To Do", "In Progress", "Completed", "Blocked"];

  return (
    <div className='project-page'>
      <main className='project-content'>
        {/* HEADER */}
        <h2>{project?.name}</h2>
        <p>{project?.description}</p>

        {/* TOP ACTIONS */}
        <div className='top-actions'>
          <select onChange={(e) => updateFilter("sort", e.target.value)}>
            <option value=''>Sort</option>
            <option value='priority_desc'>Priority High → Low</option>
            <option value='priority_asc'>Priority Low → High</option>
            <option value='newest'>Newest First</option>
            <option value='oldest'>Oldest First</option>
          </select>

          <select onChange={(e) => updateFilter("status", e.target.value)}>
            <option value=''>All Status</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <button onClick={() => setShowModal(true)}>+ New Task</button>
        </div>

        {tasks?.length === 0 && (
          <p className='alert alert-danger'>No Task for the Project</p>
        )}

        {/* TASK TABLE */}
        {tasks.length > 0 && (
          <div className='table-responsive mt-4'>
            <table className='table table-hover align-middle'>
              <thead className='table-light'>
                <tr>
                  <th>Task</th>
                  <th>Owner</th>
                  <th>Priority</th>
                  <th>Due</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => {
                  const ownerName = task.owners?.[0]?.name || "NA";
                  const ownerInitial = ownerName.charAt(0).toUpperCase();

                  return (
                    <tr key={task._id}>
                      {/* TASK */}
                      <td>{task.name}</td>

                      {/* OWNER */}
                      <td>
                        <div className='d-flex align-items-center gap-2'>
                          <div
                            className='rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center'
                            style={{
                              width: "32px",
                              height: "32px",
                              fontSize: "14px",
                            }}>
                            {ownerInitial}
                          </div>
                          <span>{ownerName}</span>
                        </div>
                      </td>

                      {/* PRIORITY */}
                      <td>
                        <span
                          className={`badge ${
                            task.priority === "High"
                              ? "bg-danger"
                              : task.priority === "Medium"
                                ? "bg-warning text-dark"
                                : "bg-success"
                          }`}>
                          {task.priority}
                        </span>
                      </td>

                      {/* DUE */}
                      <td>{task.timeToComplete} days</td>

                      {/* STATUS */}
                      <td>{task.status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* MODAL */}
      {showModal && (
        <CreateTaskModal
          projectId={id}
          projectName={project?.name}
          onClose={() => setShowModal(false)}
          onCreated={fetchTasks}
        />
      )}
    </div>
  );
};

export { ProjectDetails };
