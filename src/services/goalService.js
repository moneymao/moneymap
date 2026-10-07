// src/services/goalService.js

import api from "./api";

const createGoal = async (goalData) => {
  const response = await api.post("/goals", goalData);
  return response.data;
};

const getGoals = async () => {
  const response = await api.get("/goals");
  return response.data;
};

const getGoalById = async (id) => {
  const response = await api.get(`/goals/${id}`);
  return response.data;
};

const updateGoal = async (id, goalData) => {
  const response = await api.patch(
    `/goals/${id}`,
    goalData
  );

  return response.data;
};

const addToGoal = async (id, amount) => {
  const response = await api.post(
    `/goals/${id}/add`,
    { amount }
  );

  return response.data;
};

const deleteGoal = async (id) => {
  const response = await api.delete(`/goals/${id}`);
  return response.data;
};

const goalService = {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  addToGoal,
  deleteGoal,
};

export default goalService;