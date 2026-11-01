import { useState, useEffect, useMemo } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getProjects } from "../api/project.api";
import axios from "../api/axiosHelper";
import toast from "react-hot-toast";
import Modal from "../component/model/Model";
import AddProjectForm from "../component/projectform/AddProjectForm";
import "../component/project/project.css";
import "../component/projectlist/plist.css";

const Project = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [showProjectModal, setShowProjectModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const res = await getProjects();
      setProjects(res.data?.data?.project || []);
    } catch (error) {
      console.error("Failed to fetch projects", error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

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

  const filteredProjects = useMemo(() => {
    let list = projects.filter((p) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        p.name?.toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q)
      );
    });
    if (sort === "name_asc") {
      list = [...list].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (sort === "name_desc") {
      list = [...list].sort((a, b) => (b.name || "").localeCompare(a.name || ""));
    }
    return list;
  }, [projects, search, sort]);

  const handleAddProject = () => {
    if (!localStorage.getItem("userToken")) {
      window.location.href = "/login";
      return;
    }
    setShowProjectModal(true);
  };

  return (
    <Container fluid className='project-page animate-fade-in px-0'>
      <div className='projects-header d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4'>
        <div>
          <h2 className='fw-bold mb-1'>Projects</h2>
          <p className='text-secondary mb-0'>
            Overview of all active workspace projects
          </p>
        </div>
        <button
          className='btn btn-primary btn-sm px-3 py-2 shadow-sm dashboard-action-btn'
          onClick={handleAddProject}>
          + New Project
        </button>
      </div>

      <div className='d-flex flex-wrap gap-3 mb-4'>
        <input
          type='text'
          className='form-control'
          style={{ maxWidth: "320px" }}
          placeholder='Search projects...'
          aria-label='Search projects'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className='form-select'
          style={{ maxWidth: "200px" }}
          aria-label='Sort projects'
          value={sort}
          onChange={(e) => setSort(e.target.value)}>
          <option value=''>Sort by Newest</option>
          <option value='name_asc'>Name (A–Z)</option>
          <option value='name_desc'>Name (Z–A)</option>
        </select>
      </div>

      {loading ? (
        <div className='text-center py-5'>
          <div className='spinner-border text-primary' role='status'>
            <span className='visually-hidden'>Loading...</span>
          </div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div
          className='text-center py-5 border rounded p-4'
          style={{ background: "var(--card-bg)" }}>
          <h5 className='text-secondary fw-bold mb-1'>No Projects Found</h5>
          <p className='text-muted mb-0'>
            Create a new project or adjust your search query.
          </p>
        </div>
      ) : (
        <Row className='g-4'>
          {filteredProjects.map((p, idx) => {
            const statusText = p.status || (idx % 4 === 2 ? "Completed" : "In Progress");
            const isCompleted = statusText.toLowerCase() === "completed";

            return (
              <Col xs={12} sm={6} md={6} lg={6} xl={4} key={p._id}>
                <Card
                  className='project-card h-100 p-2'
                  onClick={() => navigate(`/project/${p._id}`)}>
                  <Card.Body className='d-flex flex-column'>
                    <div className='d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2'>
                      <span
                        className={`project-status-pill ${isCompleted ? "completed" : "in-progress"}`}>
                        {statusText}
                      </span>
                      <div className='d-flex align-items-center gap-2 ms-auto flex-shrink-0'>
                        {p.createdAt && (
                          <span className='text-secondary small'>
                            {new Date(p.createdAt).toLocaleDateString()}
                          </span>
                        )}
                        <button
                          type='button'
                          title='Delete project'
                          aria-label={`Delete project ${p.name}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteProject(p._id);
                          }}
                          className='project-delete-icon-btn'>
                          🗑
                        </button>
                      </div>
                    </div>
                    <Card.Title className='fw-bold fs-5 mb-2'>
                      {p.name}
                    </Card.Title>
                    <Card.Text className='text-secondary small flex-grow-1'>
                      {p.description || "No description provided."}
                    </Card.Text>
                    <div className='mt-3 pt-2 border-top d-flex justify-content-between align-items-center small'>
                      <span
                        className='fw-semibold'
                        style={{ color: "var(--primary-color)" }}>
                        View Project Tasks →
                      </span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      <Modal
        show={showProjectModal}
        title='Add Project'
        size='md'
        onClose={() => setShowProjectModal(false)}>
        <AddProjectForm
          onSuccess={loadProjects}
          onClose={() => setShowProjectModal(false)}
        />
      </Modal>
    </Container>
  );
};

export { Project };
