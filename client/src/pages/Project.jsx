import { useState, useEffect } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getProjects } from "../api/project.api";
import "../component/project/project.css";
const Project = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const res = await getProjects();
    setProjects(res.data.data.project);
  };

  return (
    <Container className='project-page'>
      <h3 className='mb-4'>Project</h3>
      <Row>
        {projects.map((p) => (
          <Col md={4} key={p.id}>
            <Card
              className='project-card'
              onClick={() => navigate(`/project/${p._id}`)}>
              <Card.Body>
                <Card.Title>{p.name}</Card.Title>
                <Card.Text>{p.description}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};
export { Project };
