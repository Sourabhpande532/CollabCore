import { useState } from "react";
import { getProjects } from "../api/project.api";
import { getTasks } from "../api/task.api";
import { useEffect } from "react";
import { Sidebar } from "../component/sidebar/Sidebar";
import "./pages.css";
const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  console.log(projects);
  console.log(tasks);

  useEffect(() => {
    getProjects()
      .then((res) => setProjects(res.data?.data?.project))
      .catch((err) => setError(err));
    getTasks()
      .then((res) => setTasks(res.data?.data?.tasks))
      .catch((err) => setError(err));
  }, []);

  return (
    <div className='layout'>
      <div className='content'>
        <h4 className='section-title'>Projects</h4>

        <div className='projects-grid'>
          {projects.length > 0 ? (
            projects.map((p) => (
              <div key={p._id} className='project-card'>
                <h6 className='project-title'>{p.name}</h6>
                <p className='project-desc'>{p.description}</p>
              </div>
            ))
          ) : (
            <p className='empty-text'>Project not found</p>
          )}
        </div>

        <h4 className='section-title mt'>My Tasks</h4>

        <div className='tasks-list'>
          {tasks.map((t) => (
            <div key={t._id} className='task-card'>
              <span className='task-name'>{t.name}</span>
              <span className={`task-status ${t.status.toLowerCase()}`}>
                {t.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export { Dashboard };
