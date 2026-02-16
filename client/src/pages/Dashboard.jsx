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
          {<ProjectPage refresh={refreshProjects} />}
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

        <MyTasks refresh={refreshTasks} />
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
    </div>
  );
};

export { Dashboard };
