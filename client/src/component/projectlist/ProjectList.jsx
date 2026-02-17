/* eslint-disable no-template-curly-in-string */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import "./plist.css";
import axios from "../../api/axiosHelper";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const ProjectPage = ({ refresh }) => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    fetchProject();
  }, [search, sort, refresh]);

  const fetchProject = async () => {
    const res = await axios.get("/projects", {
      params: { search, sort },
    });
    setProjects(res.data.data.project);
  };

  const deleteProject = async (id) => {
    await axios.delete(`/projects/${id}`);
    fetchProject();
    toast.success("Deleted project");
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
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value=''>--Sort--</option>
          <option value='name_asc'>Name A-Z</option>
          <option value='name_desc'>Name Z-A</option>
        </select>
      </div>
      <div className='project-grid'>
        {projects.map((project) => (
          <div
            key={project._id}
            className='shadow-sm project-card'
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/project/${project._id}`)}>
            <h4 className='fs-6'>{project.name}</h4>
            <p className=''>{project.description || "No description"}</p>
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
