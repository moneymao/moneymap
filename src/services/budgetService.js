import api from "./api";

const createBudget = async (budgetData) => {
  const response = await api.post("/budgets", budgetData);

  return response.data;
};

const getBudgets = async (params = {}) => {
  const response = await api.get("/budgets", {
    params,
  });

  return response.data;
};

const getBudgetById = async (id) => {
  const response = await api.get(`/budgets/${id}`);

  return response.data;
};

const updateBudget = async (id, budgetData) => {
  const response = await api.patch(
    `/budgets/${id}`,
    budgetData
  );

  return response.data;
};

const deleteBudget = async (id) => {
  const response = await api.delete(`/budgets/${id}`);

  return response.data;
};

const budgetService = {
  createBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
};

export default budgetService;