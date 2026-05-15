import { useEffect, useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
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
    <div className='reports-page animate-fade-in'>
      <div className='mb-4'>
        <h2 className='fw-bold mb-0'>Workasana Reports</h2>
        <p className='text-secondary'>
          Visualize your team's productivity and progress
        </p>
      </div>

      <Row className='g-4 mb-4'>
        <Col lg={6}>
          <Card className='h-100 border-0 shadow-sm'>
            <Card.Body>
              <Card.Title>Total Work Done Last Week</Card.Title>
              <LastWeekChart count={lastWeekCount} />
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className='h-100 border-0 shadow-sm'>
            <Card.Body>
              <Card.Title>Total Days of Work Pending</Card.Title>
              <PendingWorkChart totalDays={pendingDays} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Card className='border-0 shadow-sm'>
            <Card.Body>
              <Card.Title>Tasks Closed by Team</Card.Title>
              <ClosedTasksChart data={closedByTeam} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export { Reports };
