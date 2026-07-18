/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { getTasks } from "../api/task.api";
import Modal from "../component/model/Model";
import AddProjectForm from "../component/projectform/AddProjectForm";
import AddTaskForm from "../component/taskform/AddTaskForm";
import { getProjects } from "../api/project.api";
import { MyTasks } from "../component/tasklist/MyTask";
import { ProjectPage } from "../component/projectlist/ProjectList";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [refreshProjects, setRefreshProject] = useState(false);
  const [refreshTasks, setRefreshTasks] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const fetchProjects = () => {
    getProjects()
      .then((res) => setProjects(res.data?.data?.project || []))
      .catch(() => setProjects([]));
  };
  const fetchTasks = () => {
    getTasks()
      .then((res) => setTasks(res.data?.data?.tasks || []))
      .catch(() => setTasks([]));
  };
  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, []);

  const handleAddProject = () => {
    if (!localStorage.getItem("userToken")) {
      window.location.href = "/login";
      return;
    }
    setShowProjectModal(true);
  };

  const handleAddTask = () => {
    if (!localStorage.getItem("userToken")) {
      window.location.href = "/login";
      return;
    }
    setShowTaskModal(true);
  };
  
  return (
    <div className="dashboard-page">
      {/* Global Search Section */}
      <section 
        className="mb-4 py-2"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1020,
          background: "var(--bg-gradient)", // Matches the body background
          margin: "0 -10px",
          padding: "10px",
        }}
      >
        <input
          type="text"
          className="form-control form-control-lg shadow-sm"
          placeholder="Search by project or task..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </section>

      {/* Projects Section */}
      <section className="mb-5">
        <div className='dashboard-section-header d-flex justify-content-between align-items-center mb-4'>
          <div>
            <h2 className='fw-bold mb-0'>Projects</h2>
            <p className="text-secondary mb-0 d-none d-sm-block">Manage your workspace projects</p>
          </div>
          <button
            className='btn btn-primary shadow-sm dashboard-action-btn'
            onClick={handleAddProject}>
            + New Project
          </button>
        </div>
        <div className='projects-grid-wrapper'>
          <ProjectPage refresh={refreshProjects} searchQuery={searchQuery} />
        </div>
      </section>

      {/* Tasks Section */}
      <section className="mb-5">
        <div className='dashboard-section-header d-flex justify-content-between align-items-center mb-4'>
          <div>
            <h2 className='fw-bold mb-0'>My Tasks</h2>
            <p className="text-secondary mb-0 d-none d-sm-block">Track your personal progress</p>
          </div>
          <button
            className='btn btn-primary shadow-sm dashboard-action-btn'
            onClick={handleAddTask}>
            + Add Tasks
          </button>
        </div>

        <MyTasks refresh={refreshTasks} searchQuery={searchQuery} />
      </section>

      {/* Modals */}
      <Modal
        show={showProjectModal}
        title='Add Project'
        onClose={() => setShowProjectModal(false)}>
        <AddProjectForm
          onSuccess={() => setRefreshProject((prev) => !prev)}
          onClose={() => setShowProjectModal(false)}
        />
      </Modal>
      <Modal
        show={showTaskModal}
        title='Add Task'
        onClose={() => setShowTaskModal(false)}>
        <AddTaskForm
          onSuccess={() => setRefreshTasks((prev) => !prev)}
          onClose={() => setShowTaskModal(false)}
        />
      </Modal>
    </div>
  );
};

export { Dashboard };
