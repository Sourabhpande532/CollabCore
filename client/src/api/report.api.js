import api from "../api/axiosHelper";

export const fetchLastWeekReport = ()=> api.get("/report/last-week");

export const fetchPendingReport = () => api.get("/report/pending");

export const fetchClosedTasksReport = ()=> api.get("/report/closed-tasks")