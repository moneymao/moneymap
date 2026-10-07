import api from "./api";

const createTransaction = async (transactionData) => {
  const response = await api.post("/transactions", transactionData);
  return response.data;
};

const getTransactions = async (params = {}) => {
  const response = await api.get("/transactions", {
    params,
  });

  return response.data;
};

const getTransactionById = async (id) => {
  const response = await api.get(`/transactions/${id}`);
  return response.data;
};

const updateTransaction = async (id, transactionData) => {
  const response = await api.patch(
    `/transactions/${id}`,
    transactionData
  );

  return response.data;
};

const deleteTransaction = async (id) => {
  const response = await api.delete(`/transactions/${id}`);
  return response.data;
};

const transactionService = {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
};

export default transactionService;