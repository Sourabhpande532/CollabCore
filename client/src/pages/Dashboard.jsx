import { useState } from "react";
import Modal from "../component/model/Model";
import AddProjectForm from "../component/projectform/AddProjectForm";
import AddTaskForm from "../component/taskform/AddTaskForm";
import { MyTasks } from "../component/tasklist/MyTask";
import { ProjectPage } from "../component/projectlist/ProjectList";

const Dashboard = () => {
  const [refreshProjects, setRefreshProject] = useState(false);
  const [refreshTasks, setRefreshTasks] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [projectSort, setProjectSort] = useState("");

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
    <div className='dashboard-page animate-fade-in'>
      {/* Top Search Bar (Matches Reference PDF Screen 2) */}
      <div className='dashboard-search-bar mb-4'>
        <div className='position-relative'>
          <input
            type='text'
            className='form-control pe-5'
            style={{
              height: "44px",
              borderRadius: "10px",
              background: "var(--card-bg)",
            }}
            aria-label='Search across projects and tasks'
            placeholder='Search projects, tasks, teams, or #tags...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery ? (
            <button
              type='button'
              className='btn btn-sm position-absolute top-50 end-0 translate-middle-y me-2 text-secondary border-0'
              aria-label='Clear search'
              onClick={() => setSearchQuery("")}>
              ✕
            </button>
          ) : (
            <span
              className='position-absolute top-50 end-0 translate-middle-y me-3 text-secondary'
              style={{ pointerEvents: "none" }}>
              🔍
            </span>
          )}
        </div>
      </div>

      {/* Projects Section (Header with inline Filter + "+ New Project" button) */}
      <section className='mb-5'>
        <div className='dashboard-section-header d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3'>
          <div className='d-flex align-items-center gap-3 flex-wrap'>
            <h2 className='fw-bold mb-0 fs-4'>Projects</h2>
            <select
              className='form-select form-select-sm w-auto'
              style={{ minWidth: "130px", height: "34px", fontSize: "0.82rem" }}
              aria-label='Filter or sort projects'
              value={projectSort}
              onChange={(e) => setProjectSort(e.target.value)}>
              <option value=''>Filter: Newest</option>
              <option value='name_asc'>Name (A–Z)</option>
              <option value='name_desc'>Name (Z–A)</option>
            </select>
          </div>
          <button
            className='btn btn-primary btn-sm px-3 py-2 shadow-sm dashboard-action-btn'
            onClick={handleAddProject}>
            + New Project
          </button>
        </div>
        <div className='projects-grid-wrapper'>
          <ProjectPage
            refresh={refreshProjects}
            searchQuery={searchQuery}
            sort={projectSort}
          />
        </div>
      </section>

      {/* My Tasks Section (Header + "+ New Task" button) */}
      <section className='mb-4'>
        <MyTasks
          refresh={refreshTasks}
          searchQuery={searchQuery}
          onAddTask={handleAddTask}
        />
      </section>

      {/* Modals */}
      <Modal
        show={showProjectModal}
        title='Create New Project'
        size='md'
        onClose={() => setShowProjectModal(false)}>
        <AddProjectForm
          onSuccess={() => setRefreshProject((prev) => !prev)}
          onClose={() => setShowProjectModal(false)}
        />
      </Modal>
      <Modal
        show={showTaskModal}
        title='Create New Task'
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
