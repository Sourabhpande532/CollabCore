import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../api/axiosHelper";
import "./taskDetails.css";
const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);

  useEffect(() => {
    axios.get(`/tasks/${id}`).then((res) => {
      setTask(res.data.data.task);
    });
  }, [id]);

  const updateStatus = async (newStaus) => {
    const res = await axios.put(`/tasks/${id}/status`, {
      status: newStaus,
    });
    setTask(res.data.data.task);
  };
  if (!task) return <p>Loading...</p>;
  const daysLeft = task.dueDate
    ? Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24))
    : "N/A";
  return (
    <div className='container mt-4 task-details-container'>
      <button className='btn btn-secondary mb-3' onClick={() => navigate(-1)}>
        Back
      </button>

      <div className='card p-4 shadow-sm'>
        <h3 className='mb-4'>{task?.name}</h3>

        <div className='row'>
          <div className='col-md-6'>
            <p>
              <strong>Project:</strong> {task.project?.name}
            </p>
            <p>
              <strong>Team:</strong> {task.team?.name}
            </p>
            <p>
              <strong>Owners:</strong>{" "}
              {task.owners.map((o) => o.name).join(", ")}
            </p>
            <p>
              <strong>Tags:</strong>{" "}
              <span className='tags'>
                {task.tags?.map((tag, index) => (
                  <span key={index}>{tag}</span>
                ))}
              </span>
            </p>
          </div>

          <div className='col-md-6'>
            <p>
              <strong>Due Date:</strong> {task.dueDate?.substring(0, 10)}
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
              <strong>Time Remaining:</strong> {daysLeft} days
            </p>
          </div>
        </div>

        <div className='mt-4'>
          {task.status !== "Completed" && (
            <button
              className='btn btn-success'
              onClick={() => updateStatus("Completed")}>
              Mark as Complete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export { TaskDetails };
