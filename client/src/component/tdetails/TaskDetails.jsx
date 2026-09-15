/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../api/axiosHelper";
import "./taskDetails.css";
import EditTaskModal from "../taskform/EditTaskForm";
import toast from "react-hot-toast";

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTaskDetails();
  }, [id]);

  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/tasks/${id}`);
      setTask(res.data?.data?.task || null);
    } catch (error) {
      console.error("Failed to fetch task details:", error);
      toast.error("Failed to load task details");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    if (!localStorage.getItem("userToken")) {
      window.location.href = "/login";
      return;
    }
    try {
      const res = await axios.put(`/tasks/${id}/status`, {
        status: newStatus,
      });
      if (res.data?.data?.task) {
        setTask((prevTask) => ({
          ...prevTask,
          ...res.data.data.task,
          // Preserve populated objects if return is unpopulated
          project: res.data.data.task.project?.name ? res.data.data.task.project : prevTask?.project,
          team: res.data.data.task.team?.name ? res.data.data.task.team : prevTask?.team,
          owners: res.data.data.task.owners?.[0]?.name ? res.data.data.task.owners : prevTask?.owners,
        }));
      } else {
        await fetchTaskDetails();
      }
      toast.success(`Task marked as ${newStatus}`);
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update task status");
    }
  };

  if (loading || !task) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const daysLeft = task.dueDate
    ? Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24))
    : task.timeToComplete || "N/A";

  const projectName = typeof task.project === "object" ? task.project?.name : task.project || "N/A";
  const teamName = typeof task.team === "object" ? task.team?.name : task.team || "N/A";
  const ownerNames = Array.isArray(task.owners)
    ? task.owners.map((o) => (typeof o === "object" ? o.name : o)).filter(Boolean).join(", ")
    : "N/A";

  const handleEditTask = () => {
    if (!localStorage.getItem("userToken")) {
      window.location.href = "/login";
      return;
    }
    setIsEditing(true);
  };

  return (
    <div className='container mt-4 task-details-container animate-fade-in'>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button className='btn btn-secondary' onClick={() => navigate(-1)}>
          ← Back
        </button>
        <button className='btn btn-primary' onClick={handleEditTask}>
          Edit Task
        </button>
      </div>

      <div className='card p-4 shadow-sm'>
        <h3 className='mb-4 fw-bold'>{task?.name}</h3>

        <div className='row g-3'>
          <div className='col-md-6'>
            <p>
              <strong>Project:</strong> {projectName}
            </p>
            <p>
              <strong>Team:</strong> {teamName}
            </p>
            <p>
              <strong>Owners:</strong> {ownerNames || "Unassigned"}
            </p>
            <p>
              <strong>Tags:</strong>{" "}
              <span className='tags'>
                {task.tags && task.tags.length > 0 ? (
                  task.tags.map((tag, index) => (
                    <span key={index}>{tag}</span>
                  ))
                ) : (
                  <span className="text-secondary small">No tags</span>
                )}
              </span>
            </p>
          </div>

          <div className='col-md-6'>
            <p>
              <strong>Due Date:</strong> {task.dueDate ? task.dueDate.substring(0, 10) : "N/A"}
            </p>
            <p>
              <strong>Priority:</strong> {task.priority || "Medium"}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`status-badge ${
                  task.status === "Completed"
                    ? "status-completed"
                    : task.status === "In Progress"
                      ? "status-progress"
                      : "status-todo"
                }`}>
                {task.status}
              </span>
            </p>
            <p>
              <strong>Time Remaining:</strong> {daysLeft} {typeof daysLeft === "number" ? "days" : ""}
            </p>
          </div>
        </div>

        <div className='mt-4 pt-3 border-top d-flex gap-2'>
          {task.status !== "Completed" && (
            <button
              className='btn btn-success'
              onClick={() => updateStatus("Completed")}>
              ✔ Mark as Complete
            </button>
          )}
          {task.status === "Completed" && (
            <button
              className='btn btn-outline-secondary'
              onClick={() => updateStatus("In Progress")}>
              Reopen Task
            </button>
          )}
        </div>
      </div>

      {isEditing && (
        <EditTaskModal 
          task={task} 
          onClose={() => setIsEditing(false)} 
          onUpdated={async () => {
            await fetchTaskDetails();
            setIsEditing(false);
          }} 
        />
      )}
    </div>
  );
};

export { TaskDetails };
