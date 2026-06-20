import API_URL from "./axiosHelper";
export const getComments = (projectId) => API_URL.get(`/comments/project/${projectId}`);
export const addComment = (data) => API_URL.post("/comments", data);
