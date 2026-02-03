import { useEffect, useState } from "react";
import { getTasks } from "../api/task.api";
import Modal from "../component/model/Model";
import AddProjectForm from "../component/projectform/AddProjectForm";
import AddTaskForm from "../component/taskform/AddTaskForm";
import "./pages.css";
import { getProjects } from "../api/project.api";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const fetchProjects = () => {
    getProjects().then((res) => setProjects(res.data?.data?.project || []));
  };

  const fetchTasks = () => {
    getTasks().then((res) => setTasks(res.data?.data?.tasks || []));
  };

  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, []);

  return (
    <div className='layout'>
      <div className='content'>
        {/* Projects */}
        <div className='d-flex justify-content-between align-items-center'>
          <h4 className='section-title'>Projects</h4>
          <button
            className='btn btn-outline-primary'
            onClick={() => setShowProjectModal(true)}>
            + New Project
          </button>
        </div>

        <div className='projects-grid'>
          {projects.length ? (
            projects.map((p) => (
              <div key={p._id} className='project-card'>
                <h6>{p.name}</h6>
                <p>{p.description}</p>
              </div>
            ))
          ) : (
            <p>No projects found</p>
          )}
        </div>

        {/* Tasks */}
        <div className='d-flex justify-content-between align-items-center mt-4'>
          <h4 className='section-title'>My Tasks</h4>
          <button
            className='btn btn-outline-primary'
            onClick={() => setShowTaskModal(true)}>
            + Add Tasks
          </button>
        </div>

        <div className='tasks-list'>
          {tasks.map((t) => (
            <div key={t._id} className='task-card'>
              <span>{t.name}</span>
              <span className={`task-status ${t.status.toLowerCase()}`}>
                {t.status}
              </span>
            </div>
          ))}
        </div>

        {/* Modals */}
        <Modal
          show={showProjectModal}
          title='Add Project'
          onClose={() => setShowProjectModal(false)}>
          <AddProjectForm
            onSuccess={fetchProjects}
            onClose={() => setShowProjectModal(false)}
          />
        </Modal>

        <Modal
          show={showTaskModal}
          title='Add Task'
          onClose={() => setShowTaskModal(false)}>
          <AddTaskForm
            onSuccess={fetchTasks}
            onClose={() => setShowTaskModal(false)}
          />
        </Modal>
      </div>
    </div>
  );
};

export { Dashboard };
