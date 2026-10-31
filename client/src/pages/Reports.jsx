import { useEffect, useMemo, useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  fetchLastWeekReport,
  fetchPendingReport,
  fetchClosedTasksReport,
} from "../api/report.api";
import { getTasks } from "../api/task.api";

import LastWeekChart from "../component/report/LastWeekChart";
import PendingWorkChart from "../component/report/PendingWorkChart";
import ClosedTasksChart from "../component/report/ClosedTasks";

import "../component/report/report.css";

const Reports = () => {
  const navigate = useNavigate();
  const [lastWeekCount, setLastWeekCount] = useState(0);
  const [pendingDays, setPendingDays] = useState(0);
  const [closedByTeam, setClosedByTeam] = useState({});
  const [allTasks, setAllTasks] = useState([]);
  const [groupBy, setGroupBy] = useState("owner");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const [lastWeekRes, pendingRes, closedRes, tasksRes] = await Promise.all([
        fetchLastWeekReport(),
        fetchPendingReport(),
        fetchClosedTasksReport(),
        getTasks().catch(() => ({ data: { data: { tasks: [] } } })),
      ]);

      setLastWeekCount(lastWeekRes.data?.count || 0);
      setPendingDays(pendingRes.data?.totalDays || 0);
      setClosedByTeam(closedRes.data || {});
      setAllTasks(tasksRes.data?.data?.tasks || []);
    } catch (error) {
      console.error("Report fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  const closedByTeamData = useMemo(() => {
    if (Object.keys(closedByTeam).length > 0) {
      return closedByTeam;
    }
    const completed = allTasks.filter((t) => t.status === "Completed");
    const counts = {};
    completed.forEach((task) => {
      const teamName = task.team?.name || "Unassigned";
      counts[teamName] = (counts[teamName] || 0) + 1;
    });
    return counts;
  }, [closedByTeam, allTasks]);

  const closedTasksBreakdown = useMemo(() => {
    const completed = allTasks.filter((t) => t.status === "Completed");
    const counts = {};

    completed.forEach((task) => {
      if (groupBy === "project") {
        const projName = task.project?.name || "Unassigned";
        counts[projName] = (counts[projName] || 0) + 1;
      } else {
        if (Array.isArray(task.owners) && task.owners.length > 0) {
          task.owners.forEach((o) => {
            const oName = (typeof o === "object" ? o.name : "") || "Unassigned";
            counts[oName] = (counts[oName] || 0) + 1;
          });
        } else {
          counts.Unassigned = (counts.Unassigned || 0) + 1;
        }
      }
    });

    return counts;
  }, [groupBy, allTasks]);

  const totalClosedCount = useMemo(() => {
    return Object.values(closedByTeam).reduce(
      (sum, n) => sum + Number(n || 0),
      0,
    );
  }, [closedByTeam]);

  const topProductiveOwner = useMemo(() => {
    const completed = allTasks.filter((t) => t.status === "Completed");
    const ownerCounts = {};
    completed.forEach((t) => {
      (t.owners || []).forEach((o) => {
        const name = typeof o === "object" ? o.name : "";
        if (name) {
          ownerCounts[name] = (ownerCounts[name] || 0) + 1;
        }
      });
    });
    const sorted = Object.entries(ownerCounts).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? `${sorted[0][0]} (${sorted[0][1]})` : "N/A";
  }, [allTasks]);

  return (
    <div className='reports-page animate-fade-in'>
      <div className='mb-3'>
        <button
          type='button'
          className='btn btn-outline-secondary btn-sm'
          onClick={() => navigate("/dashboard")}>
          ← Back to Dashboard
        </button>
      </div>

      <div className='mb-4'>
        <h2 className='fw-bold mb-1'>CollabCore Reports</h2>
        <p className='text-secondary mb-0'>
          Report Overview — Total Work Done Last Week, Pending Days, and Tasks
          Closed by Team, Owner &amp; Project
        </p>
      </div>

      {/* Summary KPI Cards */}
      <Row className='g-3 mb-4'>
        <Col sm={6} lg={3}>
          <Card className='border-0 shadow-sm h-100'>
            <Card.Body className='py-3'>
              <div className='text-secondary small fw-semibold text-uppercase'>
                Completed Last 7 Days
              </div>
              <div
                className='fs-2 fw-bold mt-1'
                style={{ color: "var(--primary-color)" }}>
                {loading ? "—" : lastWeekCount}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} lg={3}>
          <Card className='border-0 shadow-sm h-100'>
            <Card.Body className='py-3'>
              <div className='text-secondary small fw-semibold text-uppercase'>
                Total Days Pending
              </div>
              <div className='fs-2 fw-bold mt-1' style={{ color: "#f59e0b" }}>
                {loading ? "—" : `${pendingDays}d`}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} lg={3}>
          <Card className='border-0 shadow-sm h-100'>
            <Card.Body className='py-3'>
              <div className='text-secondary small fw-semibold text-uppercase'>
                Total Tasks Closed
              </div>
              <div className='fs-2 fw-bold mt-1' style={{ color: "#10b981" }}>
                {loading ? "—" : totalClosedCount}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} lg={3}>
          <Card className='border-0 shadow-sm h-100'>
            <Card.Body className='py-3'>
              <div className='text-secondary small fw-semibold text-uppercase'>
                Most Productive Owner
              </div>
              <div
                className='fs-5 fw-bold mt-2 text-truncate'
                title={topProductiveOwner}
                style={{ color: "var(--text-primary)" }}>
                {loading ? "—" : topProductiveOwner}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className='g-4 mb-4'>
        <Col lg={6}>
          <Card className='h-100 border-0 shadow-sm'>
            <Card.Body>
              <Card.Title>Total Work Done Last Week</Card.Title>
              <LastWeekChart count={lastWeekCount} tasks={allTasks} />
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className='h-100 border-0 shadow-sm'>
            <Card.Body>
              <Card.Title>Total Days of Work Pending Across Projects</Card.Title>
              <PendingWorkChart totalDays={pendingDays} tasks={allTasks} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className='g-4'>
        <Col lg={6}>
          <Card className='h-100 border-0 shadow-sm'>
            <Card.Body>
              <Card.Title>Tasks Closed by Team</Card.Title>
              <ClosedTasksChart data={closedByTeamData} />
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className='h-100 border-0 shadow-sm'>
            <Card.Body>
              <div className='d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3'>
                <Card.Title className='mb-0'>
                  Tasks Closed by {groupBy === "owner" ? "Owner" : "Project"}
                </Card.Title>
                <div
                  className='d-flex gap-2 flex-wrap'
                  role='group'
                  aria-label='Group closed tasks by'>
                  <button
                    type='button'
                    className={`btn btn-sm ${groupBy === "owner" ? "btn-primary" : "btn-outline-secondary"}`}
                    onClick={() => setGroupBy("owner")}>
                    By Owner
                  </button>
                  <button
                    type='button'
                    className={`btn btn-sm ${groupBy === "project" ? "btn-primary" : "btn-outline-secondary"}`}
                    onClick={() => setGroupBy("project")}>
                    By Project
                  </button>
                </div>
              </div>
              <ClosedTasksChart data={closedTasksBreakdown} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export { Reports };
