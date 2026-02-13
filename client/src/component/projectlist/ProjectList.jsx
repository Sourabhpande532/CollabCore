/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import "./plist.css";
import axios from "../../api/axiosHelper";
import { Link } from "react-router-dom";
const ProjectPage = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  useEffect(() => {
    fetchProject();
  }, [search, sort]);

  const fetchProject = async () => {
    const res = await axios.get("/projects", {
      params: { search, sort },
    });
    setProjects(res.data.data.project);
  };

  const deleteProject = async (id) => {
    await axios.delete(`/projects/${id}`);
    fetchProject();
  };

  return (
    <div className='project-container'>
      <h2>Projects</h2>
      <div className='project-toolbar'>
        <input
          type='text'
          placeholder='Search project'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select onChange={(e) => setSort(e.target.value)}>
          <option value=''>--Sort--</option>
          <option value='name-asc'>Name A-Z</option>
          <option value='name_desc'>Name Z-A</option>
        </select>
      </div>
      <div className='project-grid'>
        {projects.map((project) => (
          <div key={project._id} className='project-card'>
            <Link
              className='text-docoration-none'
              to={`/project/${project._id}`}
              onClick={() =>
                localStorage.setItem("activeProject", project._id)
              }>
              <h4>{project.name}</h4>
            </Link>
            <p className='fw-lighter'>
              {project.description || "No description"}
            </p>
            <button
              onClick={() => deleteProject(project._id)}
              className='delete-btn'>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export { ProjectPage };
