import "./project.css"
const TaskRow = ({ task }) => {
  return (
    <div className="task-row">
      <span>{task.name}</span>
      <span className={`status ${task.status?.toLowerCase()}`}>
        {task.status}
      </span>
      <span>{task.owners?.[0]?.name}</span>
      <span>{task.dueDate || "N/A"}</span>
    </div>
  );
};

export default TaskRow;
