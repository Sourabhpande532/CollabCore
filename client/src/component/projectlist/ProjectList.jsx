/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import "./plist.css";
import axios from "../../api/axiosHelper";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ProjectShimmerGrid from "../common/ProjectShimmerGrid";
import useLoading from "../../hooks/useLoading";

const ProjectPage = ({ refresh, searchQuery = "", sort = "" }) => {
  const [projects, setProjects] = useState([]);
  const { loading, startLoading, stopLoading } = useLoading(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProject();
  }, [refresh]);

  const fetchProject = async () => {
    try {
      startLoading();
      const res = await axios.get("/projects");
      setProjects(res.data?.data?.project || []);
    } catch (error) {
      console.error(error);
    } finally {
      stopLoading();
    }
  };

  const filteredProjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = projects.filter((p) => {
      if (!q) return true;
      return (
        p.name?.toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q)
      );
    });

    if (sort === "name_asc") {
      list = [...list].sort((a, b) =>
        (a.name || "").localeCompare(b.name || ""),
      );
    } else if (sort === "name_desc") {
      list = [...list].sort((a, b) =>
        (b.name || "").localeCompare(a.name || ""),
      );
    }
    return list;
  }, [projects, searchQuery, sort]);

  const deleteProject = async (id) => {
    if (!localStorage.getItem("userToken")) {
      window.location.href = "/login";
      return;
    }
    try {
      await axios.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p._id !== id));
      toast.success("Project deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete project");
    }
  };

  return (
    <div className='project-container'>
      <div className='project-grid'>
        {loading ? (
          <ProjectShimmerGrid count={6} />
        ) : filteredProjects.length === 0 ? (
          <div
            className='w-100 text-center py-5 border rounded px-3'
            style={{ gridColumn: "1 / -1", background: "var(--card-bg)" }}>
            <h5 className='text-secondary fw-bold mb-1'>No projects found</h5>
            <p className='text-muted mb-0'>
              Create a new project or adjust your search query.
            </p>
          </div>
        ) : (
          filteredProjects.map((project, idx) => {
            const statusLabel =
              project.status || (idx % 3 === 0 ? "In Progress" : "Completed");
            const statusClass =
              statusLabel === "Completed" ? "Completed" : "InProgress";

            return (
              <div
                key={project._id}
                className='shadow-sm project-card'
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/project/${project._id}`)}>
                <div className='d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3'>
                  <span className={`project-status-pill ${statusClass}`}>
                    {statusLabel}
                  </span>
                  <button
                    type='button'
                    title='Delete project'
                    aria-label={`Delete project ${project.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteProject(project._id);
                    }}
                    className='project-delete-icon-btn'>
                    🗑
                  </button>
                </div>

                <h4 className='project-card-title'>{project.name}</h4>
                <p className='project-card-desc'>
                  {project.description ||
                    "Manage deliverables, assign team owners, and track milestone completion across tasks."}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
export { ProjectPage };
