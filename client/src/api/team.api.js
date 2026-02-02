import API_URL from "./axiosHelper";

export const getTeams = () => API_URL.get("/teams");
export const createTeam = (data) => API_URL.post("/teams", data);
