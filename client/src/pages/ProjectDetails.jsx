/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import axios from "../api/axiosHelper";
import CreateTaskModal from "../component/project/CreateTaskModel";
import { getComments, addComment } from "../api/comment.api";
import { getInitials, getAvatarColor, formatDueDate } from "../utils/uiHelpers";
import toast from "react-hot-toast";
import "../component/tasklist/myTasks.css";
import "../../src/App.css";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const sort = searchParams.get("sort") || "";
  const status = searchParams.get("status") || "";
  const owner = searchParams.get("owner") || searchParams.get("owners") || "";
  const tag = searchParams.get("tags") || "";

  useEffect(() => {
    if (!id) return;
    fetchProject();
    fetchTasks();
    fetchCommentsData();
    fetchFilterOptions();
  }, [id]);

  const fetchFilterOptions = async () => {
    try {
      const [uRes, tRes] = await Promise.all([
        axios.get("/users").catch(() => ({ data: { data: { users: [] } } })),
        axios.get("/tags").catch(() => ({ data: { data: { tag: [] } } })),
      ]);
      setUsers(uRes.data?.data?.users || []);
      setTagsList(tRes.data?.data?.tag?.map((t) => t.name) || []);
    } catch (err) {
      console.error(err);
    }
  };

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
      const found = res.data?.data?.project?.find((p) => p._id === id);
      setProject(found || null);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/tasks", { params: { project: id } });
      setTasks(res.data?.data?.tasks || []);
    } catch (error) {
      console.error(error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const availableTags = useMemo(() => {
    const taskTags = tasks.flatMap((t) => t.tags || []);
    return Array.from(new Set([...tagsList, ...taskTags])).filter(Boolean);
  }, [tagsList, tasks]);

  const filteredTasks = useMemo(() => {
    let list = tasks.filter((t) => {
      if (status && t.status !== status) return false;
      if (owner) {
        const ownerLower = owner.toLowerCase();
        const hasOwner = (t.owners || []).some((o) => {
          const oId = typeof o === "object" ? o._id : o;
          const oName = typeof o === "object" ? o.name : "";
          return (
            oId === owner ||
            (oName && oName.toLowerCase().includes(ownerLower))
          );
        });
        if (!hasOwner) return false;
      }
      if (tag) {
        const tagLower = tag.toLowerCase();
        const hasTag = (t.tags || []).some(
          (tg) => tg.toLowerCase() === tagLower,
        );
        if (!hasTag) return false;
      }
      return true;
    });

    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    if (sort === "priority_desc") {
      list = [...list].sort(
        (a, b) =>
          (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2),
      );
    } else if (sort === "priority_asc") {
      list = [...list].sort(
        (a, b) =>
          (priorityOrder[b.priority] || 2) - (priorityOrder[a.priority] || 2),
      );
    } else if (sort === "newest") {
      list = [...list].sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      );
    } else if (sort === "oldest") {
      list = [...list].sort(
        (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0),
      );
    } else if (sort === "due_asc") {
      list = [...list].sort(
        (a, b) => (a.timeToComplete || 0) - (b.timeToComplete || 0),
      );
    }

    return list;
  }, [tasks, status, owner, tag, sort]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (key === "owner") newParams.delete("owners");
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
    <div className='project-page animate-fade-in'>
      <div className='mb-3'>
        <button
          type='button'
          className='btn btn-outline-secondary btn-sm'
          onClick={() => navigate("/project")}>
          ← Back to Projects
        </button>
      </div>

      <main className='project-content'>
        {/* HEADER */}
        <h2>{project?.name || tasks[0]?.project?.name || "Project Details"}</h2>
        <p>
          {project?.description ||
            "View and filter project tasks, owners, tags, and team discussions."}
        </p>

        <div className='top-actions'>
          {/* Left: Sort by pills matching Reference Screen 3 */}
          <div className='sort-pills-group'>
            <span className='sort-by-label'>Sort by:</span>
            <button
              type='button'
              className={`sort-pill-btn ${sort === "priority_asc" ? "active" : ""}`}
              onClick={() =>
                updateFilter("sort", sort === "priority_asc" ? "" : "priority_asc")
              }>
              Priority Low-High
            </button>
            <button
              type='button'
              className={`sort-pill-btn ${sort === "priority_desc" ? "active" : ""}`}
              onClick={() =>
                updateFilter(
                  "sort",
                  sort === "priority_desc" ? "" : "priority_desc",
                )
              }>
              Priority High-Low
            </button>
            <button
              type='button'
              className={`sort-pill-btn ${sort === "newest" ? "active" : ""}`}
              onClick={() =>
                updateFilter("sort", sort === "newest" ? "" : "newest")
              }>
              Newest First
            </button>
            <button
              type='button'
              className={`sort-pill-btn ${sort === "oldest" ? "active" : ""}`}
              onClick={() =>
                updateFilter("sort", sort === "oldest" ? "" : "oldest")
              }>
              Oldest First
            </button>
          </div>

          {/* Right: Filter dropdowns + New Task button */}
          <div className='top-actions-right d-flex align-items-center gap-2'>
            <div className='top-actions-filter-group d-flex align-items-center gap-2'>
              <select
                className='form-select form-select-sm w-auto'
                aria-label='Filter by Owner'
                value={owner}
                onChange={(e) => updateFilter("owner", e.target.value)}>
                <option value=''>By Owner</option>
                {users.map((u) => (
                  <option key={u._id} value={u.name}>
                    {u.name}
                  </option>
                ))}
              </select>

              <select
                className='form-select form-select-sm w-auto'
                aria-label='Filter by Tag'
                value={tag}
                onChange={(e) => updateFilter("tags", e.target.value)}>
                <option value=''>By Tag</option>
                {availableTags.map((tg) => (
                  <option key={tg} value={tg}>
                    {tg}
                  </option>
                ))}
              </select>

              <select
                className='form-select form-select-sm w-auto'
                aria-label='Filter by Status'
                value={status}
                onChange={(e) => updateFilter("status", e.target.value)}>
                <option value=''>By Status</option>
                {STATUS_OPTIONS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>

              {(sort || status || owner || tag) && (
                <button
                  type='button'
                  className='btn btn-outline-secondary btn-sm'
                  onClick={() => setSearchParams({})}>
                  Reset
                </button>
              )}
            </div>

            <button
              className='btn btn-primary btn-sm px-3 fw-semibold dashboard-action-btn'
              onClick={handleAddTask}>
              + New Task
            </button>
          </div>
        </div>

        {loading ? (
          <div className='text-center py-4'>
            <div className='spinner-border text-primary' role='status'>
              <span className='visually-hidden'>Loading...</span>
            </div>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div
            className='text-center py-4 px-3 border rounded'
            style={{ background: "var(--input-bg)" }}>
            <h6 className='fw-bold mb-1'>No tasks found for this project</h6>
            <p className='text-secondary small mb-0'>
              Create a new task or clear active filters to view all tasks.
            </p>
          </div>
        ) : (
          <div className='mt-3'>
            {/* Desktop Table */}
            <div className='d-none d-md-block table-responsive'>
              <table className='table project-table align-middle mb-0'>
                <thead>
                  <tr>
                    <th>Tasks</th>
                    <th>Owner</th>
                    <th>Tags</th>
                    <th>Priority</th>
                    <th>Due On</th>
                    <th>Status</th>
                    <th className='text-end'></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task) => {
                    const owners = (task.owners || []).filter(Boolean);
                    const dueText = formatDueDate(
                      task.dueDate,
                      task.createdAt,
                      task.timeToComplete,
                    );
                    const priorityLevel = task.priority || "Medium";

                    return (
                      <tr
                        key={task._id}
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate(`/tasks/${task._id}`)}>
                        <td className='fw-bold'>{task.name}</td>
                        <td>
                          <div className='task-owner-group'>
                            {owners.length === 0 ? (
                              <>
                                <div
                                  className='task-avatar-circle'
                                  style={{ background: "#64748b" }}>
                                  UN
                                </div>
                                <span className='task-owner-name'>
                                  Unassigned
                                </span>
                              </>
                            ) : owners.length === 1 ? (
                              <>
                                <div
                                  className='task-avatar-circle'
                                  style={{
                                    background: getAvatarColor(
                                      owners[0].name || "U",
                                      0,
                                    ),
                                  }}
                                  title={owners[0].name}>
                                  {getInitials(owners[0].name)}
                                </div>
                                <span className='task-owner-name'>
                                  {owners[0].name}
                                </span>
                              </>
                            ) : (
                              <div className='task-avatar-stack'>
                                {owners.slice(0, 3).map((o, idx) => {
                                  const oName =
                                    typeof o === "object" ? o.name : "User";
                                  return (
                                    <div
                                      key={o._id || idx}
                                      className='task-avatar-circle'
                                      style={{
                                        background: getAvatarColor(oName, idx),
                                      }}
                                      title={oName}>
                                      {getInitials(oName)}
                                    </div>
                                  );
                                })}
                                {owners.length > 3 && (
                                  <div
                                    className='task-avatar-circle more'
                                    title={`${owners.length - 3} more`}>
                                    +{owners.length - 3}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          {task.tags && task.tags.length > 0 ? (
                            <div className='d-flex flex-wrap gap-1'>
                              {task.tags.map((tg, i) => (
                                <span key={i} className='task-tag-chip'>
                                  #{tg}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className='text-secondary small'>—</span>
                          )}
                        </td>
                        <td>
                          <span className={`priority-badge ${priorityLevel}`}>
                            ⚑ {priorityLevel}
                          </span>
                        </td>
                        <td className='fw-bold small'>{dueText}</td>
                        <td>
                          <span
                            className={`task-status-badge ${(task.status || "To Do").replace(/\s+/g, "")}`}>
                            {task.status || "To Do"}
                          </span>
                        </td>
                        <td className='text-end text-secondary fw-bold'>→</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className='d-block d-md-none'>
              {filteredTasks.map((task) => {
                const owners = (task.owners || []).filter(Boolean);
                const dueText = formatDueDate(
                  task.dueDate,
                  task.createdAt,
                  task.timeToComplete,
                );
                const priorityLevel = task.priority || "Medium";

                return (
                  <div
                    key={task._id}
                    className='card glass-morphism mb-3 p-3'
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/tasks/${task._id}`)}>
                    <div className='d-flex justify-content-between align-items-start mb-2'>
                      <h6 className='fw-bold mb-0 me-2'>{task.name}</h6>
                      <span className={`priority-badge ${priorityLevel}`}>
                        ⚑ {priorityLevel}
                      </span>
                    </div>

                    <div className='task-due-date mb-2'>
                      Due on: <strong>{dueText}</strong>
                    </div>

                    {task.tags && task.tags.length > 0 && (
                      <div className='d-flex flex-wrap gap-1 mb-2'>
                        {task.tags.map((tg, i) => (
                          <span key={i} className='task-tag-chip'>
                            #{tg}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className='d-flex justify-content-between align-items-center pt-2 border-top'>
                      <div className='task-owner-group'>
                        {owners.length > 0 ? (
                          <>
                            <div
                              className='task-avatar-circle'
                              style={{
                                background: getAvatarColor(
                                  owners[0].name || "U",
                                  0,
                                ),
                              }}>
                              {getInitials(owners[0].name)}
                            </div>
                            <span className='task-owner-name'>
                              {owners.map((o) => o.name).join(", ")}
                            </span>
                          </>
                        ) : (
                          <span className='small text-secondary'>
                            Unassigned
                          </span>
                        )}
                      </div>
                      <span
                        className={`task-status-badge ${(task.status || "To Do").replace(/\s+/g, "")}`}>
                        {task.status || "To Do"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* COMMENTS SECTION */}
        <div className='mt-5 pt-4 border-top'>
          <h4 className='fw-bold mb-4'>Project Discussion</h4>

          <div className='comments-list mb-4'>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment._id}
                  className='comment-card glass-morphism p-3 mb-3'
                  style={{ borderRadius: "12px" }}>
                  <div className='d-flex justify-content-between align-items-start mb-2'>
                    <div className='d-flex align-items-center gap-2'>
                      <div
                        className='rounded-circle text-white d-flex align-items-center justify-content-center fw-bold'
                        style={{
                          width: "35px",
                          height: "35px",
                          background: "var(--primary-color)",
                        }}>
                        {comment.author?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div>
                        <div
                          className='fw-bold comment-author'
                          style={{ fontSize: "0.95rem" }}>
                          {comment.author?.name || "Workspace Member"}
                        </div>
                        <div
                          className='text-secondary comment-time'
                          style={{ fontSize: "0.8rem" }}>
                          {new Date(comment.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p
                    className='mb-0 mt-2 text-primary-dark'
                    style={{ fontSize: "0.95rem", lineHeight: "1.5" }}>
                    {comment.text}
                  </p>
                </div>
              ))
            ) : (
              <p className='text-secondary fst-italic'>
                No comments yet. Be the first to start the discussion!
              </p>
            )}
          </div>

          <div
            className='comment-input-area glass-morphism p-3'
            style={{ borderRadius: "12px" }}>
            <textarea
              className='form-control mb-3'
              rows='3'
              aria-label='Add a comment about this project'
              placeholder='Add a comment or update about this project...'
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              style={{
                resize: "none",
                background: "var(--card-bg)",
                color: "var(--text-primary)",
              }}></textarea>
            <div className='d-flex justify-content-end'>
              <button
                className='btn btn-primary px-4'
                onClick={handlePostComment}
                disabled={!newComment.trim()}>
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
