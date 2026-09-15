import { useState, useEffect } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getProjects } from "../api/project.api";
import "../component/project/project.css";

const Project = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <Container className='project-page animate-fade-in'>
      <div className="mb-4">
        <h3 className='fw-bold mb-1'>Projects</h3>
        <p className="text-secondary">Overview of all active workspace projects</p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-5 border rounded p-4">
          <h5 className="text-secondary fw-bold mb-1">No Projects Found</h5>
          <p className="text-muted">Create a new project from the Dashboard to get started.</p>
        </div>
      ) : (
        <Row className="g-4">
          {projects.map((p) => (
            <Col md={6} lg={4} key={p._id}>
              <Card
                className='project-card h-100 p-2'
                onClick={() => navigate(`/project/${p._id}`)}>
                <Card.Body>
                  <Card.Title className="fw-bold fs-5 mb-2">{p.name}</Card.Title>
                  <Card.Text className="text-secondary small">
                    {p.description || "No description provided."}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export { Project };
