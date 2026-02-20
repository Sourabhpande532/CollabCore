/* eslint-disable no-template-curly-in-string */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import "./plist.css";
import axios from "../../api/axiosHelper";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useLoading from "../../utils/useLoading";
import ProjectShimmerGrid from "../common/ProjectShimmerGrid";
const ProjectPage = ({ refresh }) => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const { loading, startLoading, stopLoading } = useLoading();
  const navigate = useNavigate();
  useEffect(() => {
    fetchProject();
  }, [search, sort, refresh]);

  const fetchProject = async () => {
    try {
      startLoading();
      const res = await axios.get("/projects", {
        params: { search, sort },
      });
      setProjects(res.data.data.project);
    } catch (error) {
      console.error(error);
    } finally {
      stopLoading();
    }
  };

  const deleteProject = async (id) => {
    await axios.delete(`/projects/${id}`);
    setProjects((prev) => prev.filter((p) => p._id !== id));
    toast.success("Deleted project");
  };

  return (
    <div className='project-container'>
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
        {loading ? (
          <ProjectShimmerGrid count={8} />
        ) : (
          projects.map((project) => (
            <div
              key={project._id}
              className='shadow-sm project-card'
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/project/${project._id}`)}>
              <h4 className='fs-6'>{project.name}</h4>
              <p className=''>{project.description || "No description"}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteProject(project._id);
                }}
                className='delete-btn'>
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export { ProjectPage };
