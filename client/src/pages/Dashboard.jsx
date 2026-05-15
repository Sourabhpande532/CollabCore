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
    <div className="dashboard-page">
      {/* Projects Section */}
      <section className="mb-5">
        <div className='d-flex justify-content-between align-items-center mb-4'>
          <div>
            <h2 className='fw-bold mb-0'>Projects</h2>
            <p className="text-secondary mb-0">Manage your workspace projects</p>
          </div>
          <button
            className='btn btn-primary shadow-sm'
            onClick={() => setShowProjectModal(true)}>
            + New Project
          </button>
        </div>
        <div className='projects-grid-wrapper'>
          <ProjectPage refresh={refreshProjects} />
        </div>
      </section>

      {/* Tasks Section */}
      <section className="mb-5">
        <div className='d-flex justify-content-between align-items-center mb-4'>
          <div>
            <h2 className='fw-bold mb-0'>My Tasks</h2>
            <p className="text-secondary mb-0">Track your personal progress</p>
          </div>
          <button
            className='btn btn-primary shadow-sm'
            onClick={() => setShowTaskModal(true)}>
            + Add Tasks
          </button>
        </div>

        <MyTasks refresh={refreshTasks} />
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
