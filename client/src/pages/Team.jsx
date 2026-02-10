import { useEffect, useState } from "react";
import axios from "../api/axiosHelper";
import "./globalpagecss/teams.css";
import { Link, useNavigate } from "react-router-dom";
import AddTeamModal from "../component/model/AddTeamModal";
const Team = () => {
  const [teams, setTeams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    const res = await axios.get("/teams");
    setTeams(res.data.data.team);
  };

  return (
    <div className='teams-page'>
      <div className='teams-header'>
        <h2>Teams</h2>
        <button className='primary-btn' onClick={() => setShowModal(true)}>
          + New Team
        </button>
      </div>

      <div className='teams-grid'>
        {teams.map((team) => (
          <div
            key={team._id}
            className='team-card'
            onClick={() => navigate(`/team/${team._id}`)}>
            <h4>{team.name}</h4>

            <div className='avatars'>
              {team.members.slice(0, 3).map((m) => (
                <div key={m._id} className='avatar'>
                  {m.name[0].toUpperCase()}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <AddTeamModal
          onClose={() => setShowModal(false)}
          onCreated={fetchTeams}
        />
      )}
    </div>
  );
};
export { Team };
