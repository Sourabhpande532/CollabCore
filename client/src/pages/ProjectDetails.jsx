/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "../api/axiosHelper";
import CreateTaskModal from "../component/project/CreateTaskModel";
import "../pages/productDetails.css";

const ProjectDetails = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchProject();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [searchParams]);

  const fetchProject = async () => {
    const res = await axios.get("/projects");
    const found = res.data.data.project.find((p) => p._id === id);
    setProject(found);
  };

  const fetchTasks = async () => {
    const params = Object.fromEntries(searchParams.entries());
    params.projectId = id;

    const res = await axios.get("/tasks", { params });
    setTasks(res.data.data.tasks);
  };

  const updateFilter = (key, value) => {
    value ? searchParams.set(key, value) : searchParams.delete(key);
    setSearchParams(searchParams);
  };
  const handleTaskCreated = (newTask) => {
    setTasks((prev) => [newTask, ...prev]); //optimistic update
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

        {/* TASK TABLE */}
        <div className='task-table'>
          <div className='table-head'>
            <div>Task</div>
            <div>Owner</div>
            <div>Priority</div>
            <div>Due</div>
            <div>Status</div>
          </div>

          {tasks.map((task) => {
            const ownerName = task.owners?.[0]?.name || "NA";
            const ownerInitial = ownerName.charAt(0).toUpperCase();

            return (
              <div className='table-row' key={task._id}>
                {/* TASK NAME */}
                <div>{task.name}</div>

                {/* OWNER WITH AVATAR */}
                <div className='owner-cell'>
                  <div className='owner-avatar'>{ownerInitial}</div>
                  <span>{ownerName}</span>
                </div>

                {/* PRIORITY */}
                <div>
                  <span className={`badge ${task.priority}`}>
                    {task.priority}
                  </span>
                </div>

                {/* DUE */}
                <div>{task.timeToComplete} days</div>

                {/* STATUS */}
                <div>{task.status}</div>
              </div>
            );
          })}
        </div>
      </main>

      {/* MODAL */}
      {showModal && (
        <CreateTaskModal
          projectId={id}
          projectName={project?.name}
          onClose={() => setShowModal(false)}
          onCreated={handleTaskCreated}
        />
      )}
    </div>
  );
};

export { ProjectDetails };
