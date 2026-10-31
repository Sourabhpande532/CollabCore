/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../api/axiosHelper";
import "./taskDetails.css";
import EditTaskModal from "../taskform/EditTaskForm";
import { getInitials, getAvatarColor, formatDueDate } from "../../utils/uiHelpers";
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
      setTask(null);
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
          project: res.data.data.task.project?.name
            ? res.data.data.task.project
            : prevTask?.project,
          team: res.data.data.task.team?.name
            ? res.data.data.task.team
            : prevTask?.team,
          owners: res.data.data.task.owners?.[0]?.name
            ? res.data.data.task.owners
            : prevTask?.owners,
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

  const handleDeleteTask = async () => {
    if (!localStorage.getItem("userToken")) {
      window.location.href = "/login";
      return;
    }
    try {
      await axios.delete(`/tasks/${id}`);
      toast.success("Task deleted successfully");
      navigate("/tasks", { replace: true });
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast.error("Failed to delete task");
    }
  };

  if (loading) {
    return (
      <div
        className='d-flex justify-content-center align-items-center'
        style={{ minHeight: "50vh" }}>
        <div className='spinner-border text-primary' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className='task-details-container animate-fade-in'>
        <div className='card p-4 text-center'>
          <h4 className='fw-bold mb-2'>Task Not Found</h4>
          <p className='text-secondary mb-3 justify-content-center'>
            The task you are looking for may have been deleted or does not exist.
          </p>
          <div>
            <button
              className='btn btn-primary'
              onClick={() => navigate("/tasks")}>
              ← Back to Tasks
            </button>
          </div>
        </div>
      </div>
    );
  }

  const daysLeft = task.dueDate
    ? Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24))
    : task.timeToComplete || "N/A";

  const projectId =
    typeof task.project === "object" ? task.project?._id : null;
  const projectName =
    typeof task.project === "object"
      ? task.project?.name
      : task.project || "Unassigned";
  const teamName =
    typeof task.team === "object" ? task.team?.name : task.team || "Unassigned";
  const ownersList = Array.isArray(task.owners)
    ? task.owners.filter(Boolean)
    : [];
  const formattedDue = formatDueDate(
    task.dueDate,
    task.createdAt,
    task.timeToComplete,
  );

  const handleEditTask = () => {
    if (!localStorage.getItem("userToken")) {
      window.location.href = "/login";
      return;
    }
    setIsEditing(true);
  };

  const statusBadgeClass =
    task.status === "Completed"
      ? "status-completed"
      : task.status === "In Progress"
        ? "status-progress"
        : task.status === "Blocked"
          ? "status-blocked"
          : "status-todo";

  const priorityLevel = task.priority || "Medium";

  return (
    <div className='task-details-container animate-fade-in'>
      <div className='d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3'>
        <button
          className='btn btn-secondary'
          onClick={() =>
            projectId ? navigate(`/project/${projectId}`) : navigate(-1)
          }>
          ← {projectId ? "Back to Project" : "Back"}
        </button>
        <div className='d-flex gap-2'>
          <button className='btn btn-primary' onClick={handleEditTask}>
            Edit Task
          </button>
          <button
            className='btn btn-outline-danger'
            onClick={handleDeleteTask}>
            Delete
          </button>
        </div>
      </div>

      <div className='card p-4 shadow-sm'>
        <div className='d-flex justify-content-between align-items-start flex-wrap gap-2 pb-3 mb-4 border-bottom'>
          <h3 className='m-0 fw-bold border-0 pb-0'>Task: {task?.name}</h3>
          <div className='d-flex align-items-center gap-2'>
            <span className={`status-badge ${statusBadgeClass}`}>
              {task.status || "To Do"}
            </span>
            <span className={`priority-badge ${priorityLevel}`}>
              ⚑ {priorityLevel} Priority
            </span>
          </div>
        </div>

        <div className='row g-3'>
          <div className='col-md-6'>
            <p>
              <strong>Project:</strong> <span>{projectName}</span>
            </p>
            <p>
              <strong>Team:</strong> <span>{teamName}</span>
            </p>
            <p>
              <strong>Owners:</strong>{" "}
              {ownersList.length > 0 ? (
                <span className='d-inline-flex flex-wrap align-items-center gap-2'>
                  {ownersList.map((o, idx) => {
                    const oName = typeof o === "object" ? o.name : String(o);
                    return (
                      <span
                        key={o._id || idx}
                        className='d-inline-flex align-items-center gap-1'>
                        <span
                          className='rounded-circle text-white d-inline-flex align-items-center justify-content-center fw-bold'
                          style={{
                            width: "26px",
                            height: "26px",
                            fontSize: "0.7rem",
                            background: getAvatarColor(oName, idx),
                          }}>
                          {getInitials(oName)}
                        </span>
                        <span className='fw-semibold'>{oName}</span>
                      </span>
                    );
                  })}
                </span>
              ) : (
                <span>Unassigned</span>
              )}
            </p>
            <p>
              <strong>Tags:</strong>{" "}
              <span className='tags'>
                {task.tags && task.tags.length > 0 ? (
                  task.tags.map((tag, index) => <span key={index}>#{tag}</span>)
                ) : (
                  <span className='text-secondary small'>No tags</span>
                )}
              </span>
            </p>
          </div>

          <div className='col-md-6'>
            <p>
              <strong>Due Date:</strong> <span>{formattedDue}</span>
            </p>
            <p>
              <strong>Time to Complete:</strong>{" "}
              <span>{task.timeToComplete || 1} Days</span>
            </p>
            <p>
              <strong>Status:</strong> <span>{task.status || "To Do"}</span>
            </p>
            <p>
              <strong>Time Remaining:</strong>{" "}
              <span>
                {daysLeft} {typeof daysLeft === "number" ? "Days" : ""}
              </span>
            </p>
          </div>
        </div>

        <div className='mt-4 pt-3 border-top d-flex flex-wrap align-items-center justify-content-between gap-3'>
          <div className='d-flex flex-wrap gap-2'>
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

          <div className='d-flex align-items-center gap-2'>
            <label
              htmlFor='quick-status-select'
              className='small fw-bold text-secondary mb-0'>
              Change Status:
            </label>
            <select
              id='quick-status-select'
              className='form-select form-select-sm w-auto'
              value={task.status || "To Do"}
              onChange={(e) => updateStatus(e.target.value)}>
              <option value='To Do'>To Do</option>
              <option value='In Progress'>In Progress</option>
              <option value='Completed'>Completed</option>
              <option value='Blocked'>Blocked</option>
            </select>
          </div>
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
