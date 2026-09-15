import api from "./api";

export const getAssignments = async () => {
  const response = await api.get("/assignments");
  return response.data;
};

export const getAssignmentById = async (id) => {
  const response = await api.get(`/assignments/${id}`);
  return response.data;
};

export const createAssignment = async (data) => {
  const response = await api.post("/assignments", data);
  return response.data;
};

export const updateAssignment = async (id, data) => {
  const response = await api.put(`/assignments/${id}`, data);
  return response.data;
};

export const deleteAssignment = async (id) => {
  const response = await api.delete(`/assignments/${id}`);
  return response.data;
};