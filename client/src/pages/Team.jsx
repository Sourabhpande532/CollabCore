import { useEffect, useState } from "react";
import axios from "../api/axiosHelper";
import "../../src/App.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AddTeamModal from "../component/model/AddTeamModal";

const Team = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/teams");
      setTeams(res.data?.data?.team || []);
    } catch (error) {
      console.error("Error fetching teams:", error);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeam = () => {
    if (!isAuthenticated && !localStorage.getItem("userToken")) {
      navigate("/login");
      return;
    }
    setShowModal(true);
  };

  return (
    <div className='teams-page animate-fade-in'>
      <div className='teams-header'>
        <div>
          <h2 className="fw-bold mb-1">Teams</h2>
          <p className="text-secondary mb-0">Collaborate with team members across projects</p>
        </div>
        <button className='primary-btn' onClick={handleAddTeam}>
          + New Team
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : teams.length === 0 ? (
        <div className="text-center py-5 border rounded p-4">
          <h5 className="text-secondary fw-bold mb-1">No Teams Found</h5>
          <p className="text-muted mb-0">Create a team to manage collaborative task assignments.</p>
        </div>
      ) : (
        <div className='teams-grid'>
          {teams.map((team) => (
            <div
              key={team._id}
              className='team-card'
              onClick={() => navigate(`/team/${team._id}`)}>
              <h4>{team.name}</h4>

              <div className='avatars'>
                {team.members?.slice(0, 4).map((m) => (
                  <div key={m._id} className='avatar' title={m.name}>
                    {m.name ? m.name[0].toUpperCase() : "U"}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

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
