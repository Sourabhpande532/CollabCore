/* eslint-disable react-hooks/exhaustive-deps */
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axiosHelper";
import AddMemberModal from "../component/model/AddMemberModal";
import "./globalpagecss/teams.css";

const TeamDetails = () => {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [team, setTeam] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sort, setSort] = useState("");

  useEffect(() => {
    fetchTasks();
    fetchTeamDetails();
  }, [sort]);

  const fetchTasks = async () => {
    const res = await axios.get(`/tasks/team/${id}`, {
      params: { sort },
    });
    setTasks(res.data.data.tasks);
  };

  const fetchTeamDetails = async () => {
    const res = await axios.get(`/teams/${id}`);
    setTeam(res.data.data.team);
  };

  return (
    <div className='team-details'>
      <h4>Team Tasks</h4>
      <div className='d-flex gap-2 mb-3'>
        <select
          className='form-select w-auto'
          onChange={(e) => setSort(e.target.value)}>
          <option value=''>Sort</option>
          <option value='due_asc'>Due Date ↑</option>
          <option value='due_desc'>Due Date ↓</option>
          <option value='status'>Status</option>
        </select>
      </div>

      <h3>{team?.name}</h3>

      <div className='members-section'>
        <h5>Members</h5>

        {team?.members.map((m) => (
          <div key={m._id} className='member-row'>
            <div className='avatar'>{m.name[0]}</div>
            <span>{m.name}</span>
          </div>
        ))}

        <button className='secondary-btn' onClick={() => setShowModal(true)}>
          + Member
        </button>
      </div>

      {showModal && (
        <AddMemberModal
          teamId={id}
          onClose={() => setShowModal(false)}
          onAdded={fetchTeamDetails}
        />
      )}

      {tasks.map((task) => (
        <div key={task._id} className='border rounded p-3 mb-2'>
          <strong>{task.name}</strong>
          <div>Status: {task.status}</div>
          <div>Priority: {task.priority}</div>
        </div>
      ))}
    </div>
  );
};

export { TeamDetails };
