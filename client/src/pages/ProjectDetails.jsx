/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "../api/axiosHelper";
import CreateTaskModal from "../component/project/CreateTaskModel";
import { getComments, addComment } from "../api/comment.api";
import toast from "react-hot-toast";
import "../../src/App.css";

const ProjectDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (!id) return;
    fetchProject();
    fetchTasks();
    fetchCommentsData();
  }, [id, searchParams]);

  const fetchCommentsData = async () => {
    try {
      const res = await getComments(id);
      setComments(res.data?.data?.comments || []);
    } catch (error) {
      console.error("Failed to fetch comments", error);
    }
  };

  const handlePostComment = async () => {
    if (!localStorage.getItem("userToken")) {
      window.location.href = "/login";
      return;
    }
    if (!newComment.trim()) return;
    try {
      await addComment({ projectId: id, text: newComment });
      setNewComment("");
      fetchCommentsData();
      toast.success("Comment added!");
    } catch (error) {
      console.error("Failed to post comment", error);
      toast.error("Failed to post comment");
    }
  };

  const fetchProject = async () => {
    try {
      const res = await axios.get("/projects");
      const found = res.data.data.project.find((p) => p._id === id);
      setProject(found);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(searchParams.entries());
      params.project = id;
      const res = await axios.get("/tasks", { params });
      setTasks(res.data.data.tasks || []);
    } catch (error) {
      console.error(error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const STATUS_OPTIONS = ["To Do", "In Progress", "Completed", "Blocked"];

  const handleAddTask = () => {
    if (!localStorage.getItem("userToken")) {
      window.location.href = "/login";
      return;
    }
    setShowModal(true);
  };

  return (
    <div className='project-page'>
      <main className='project-content'>
        {/* HEADER */}
        <h2>{project?.name}</h2>
        <p>{project?.description}</p>

        <div className='top-actions d-flex flex-wrap gap-3 align-items-center mb-4'>
          <select className="form-select w-auto" onChange={(e) => updateFilter("sort", e.target.value)}>
            <option value=''>Sort by</option>
            <option value='priority_desc'>Priority High → Low</option>
            <option value='priority_asc'>Priority Low → High</option>
            <option value='newest'>Newest First</option>
            <option value='oldest'>Oldest First</option>
          </select>

          <select className="form-select w-auto" onChange={(e) => updateFilter("status", e.target.value)}>
            <option value=''>All Status</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <button className="btn btn-primary ms-sm-auto dashboard-action-btn" onClick={handleAddTask}>+ New Task</button>
        </div>

        {tasks?.length === 0 && (
          <p className='alert alert-info'>No tasks found for this project</p>
        )}

        {/* TASK LIST */}
        {tasks.length > 0 && (
          <div className='mt-4'>
            {/* Desktop Table */}
            <div className='d-none d-md-block table-responsive'>
              <table className='table table-hover align-middle'>
                <thead className='table-light'>
                  <tr>
                    <th>Task</th>
                    <th>Owner</th>
                    <th>Priority</th>
                    <th>Due</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => {
                    const ownerName = task.owners?.[0]?.name || "NA";
                    const ownerInitial = ownerName.charAt(0).toUpperCase();

                    return (
                      <tr key={task._id}>
                        <td>{task.name}</td>
                        <td>
                          <div className='d-flex align-items-center gap-2'>
                            <div
                              className='rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center'
                              style={{
                                width: "32px",
                                height: "32px",
                                fontSize: "14px",
                              }}>
                              {ownerInitial}
                            </div>
                            <span>{ownerName}</span>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`badge ${task.priority === "High"
                              ? "bg-danger"
                              : task.priority === "Medium"
                                ? "bg-warning text-dark"
                                : "bg-success"
                              }`}>
                            {task.priority}
                          </span>
                        </td>
                        <td>{task.timeToComplete} days</td>
                        <td>{task.status}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className='d-block d-md-none'>
              {tasks.map((task) => {
                const ownerName = task.owners?.[0]?.name || "NA";
                const ownerInitial = ownerName.charAt(0).toUpperCase();

                return (
                  <div key={task._id} className='card glass-morphism mb-3 p-3'>
                    <div className='d-flex justify-content-between align-items-start mb-2'>
                      <h6 className='fw-bold mb-0 text-truncate me-2'>{task.name}</h6>
                      <span
                        className={`badge ${task.priority === "High"
                          ? "bg-danger"
                          : task.priority === "Medium"
                            ? "bg-warning text-dark"
                            : "bg-success"
                          }`}>
                        {task.priority}
                      </span>
                    </div>
                    
                    <div className='d-flex align-items-center gap-2 mb-3'>
                      <div
                        className='rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center'
                        style={{ width: "28px", height: "28px", fontSize: "12px" }}>
                        {ownerInitial}
                      </div>
                      <span className='text-secondary small'>{ownerName}</span>
                    </div>

                    <div className='d-flex justify-content-between align-items-center'>
                      <span className='small text-secondary'>Due: {task.timeToComplete} days</span>
                      <span className='fw-semibold small'>{task.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* COMMENTS SECTION */}
        <div className="mt-5 pt-4 border-top">
          <h4 className="fw-bold mb-4">Project Discussion</h4>
          
          <div className="comments-list mb-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment._id} className="comment-card glass-morphism p-3 mb-3" style={{ borderRadius: '12px' }}>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '35px', height: '35px' }}>
                        {comment.author?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div>
                        <div className="fw-bold comment-author" style={{ fontSize: '0.95rem' }}>{comment.author?.name || "Unknown User"}</div>
                        <div className="text-secondary comment-time" style={{ fontSize: '0.8rem' }}>
                          {new Date(comment.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="mb-0 mt-2 text-primary-dark" style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>
                    {comment.text}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-secondary font-italic">No comments yet. Be the first to start the discussion!</p>
            )}
          </div>

          <div className="comment-input-area glass-morphism p-3" style={{ borderRadius: '12px' }}>
            <textarea
              className="form-control mb-3"
              rows="3"
              placeholder="Add a comment or update about this project..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              style={{ resize: 'none', background: 'var(--card-bg)', color: 'var(--text-primary)' }}
            ></textarea>
            <div className="d-flex justify-content-end">
              <button 
                className="btn btn-primary px-4" 
                onClick={handlePostComment}
                disabled={!newComment.trim()}
              >
                Post Comment
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL */}
      {showModal && (
        <CreateTaskModal
          projectId={id}
          projectName={project?.name}
          onClose={() => setShowModal(false)}
          onCreated={fetchTasks}
        />
      )}
    </div>
  );
};

export { ProjectDetails };
