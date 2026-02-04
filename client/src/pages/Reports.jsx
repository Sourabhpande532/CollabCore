import { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import {
  fetchLastWeekReport,
  fetchPendingReport,
  fetchClosedTasksReport,
} from "../api/report.api";

import LastWeekChart from "../component/report/LastWeekChart";
import PendingWorkChart from "../component/report/PendingWorkChart";
import ClosedTasksChart from "../component/report/ClosedTasks";

import "../component/report/report.css";

const Reports = () => {
  const [lastWeekCount, setLastWeekCount] = useState(0);
  const [pendingDays, setPendingDays] = useState(0);
  const [closedByTeam, setClosedByTeam] = useState({});

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const lastWeekRes = await fetchLastWeekReport();
      setLastWeekCount(lastWeekRes.data.count);

      const pendingRes = await fetchPendingReport();
      setPendingDays(pendingRes.data.totalDays);

      const closedRes = await fetchClosedTasksReport();
      setClosedByTeam(closedRes.data);
    } catch (error) {
      console.error("Report fetch error", error);
    }
  };

  return (
    <Container fluid className='reports-page ms-4'>
      <Row>
        {/* Main Content */}
        <Col md={10}>
          <h3 className='mb-4'>Workasana Reports</h3>

          <Row className='mb-4'>
            <Col md={6}>
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>Total Work Done Last Week</Card.Title>
                  <LastWeekChart count={lastWeekCount} />
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card>
                <Card.Body>
                  <Card.Title>Total Days of Work Pending</Card.Title>
                  <PendingWorkChart totalDays={pendingDays} />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Card>
                <Card.Body>
                  <Card.Title>Tasks Closed by Team</Card.Title>
                  <ClosedTasksChart data={closedByTeam} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};
export { Reports };
