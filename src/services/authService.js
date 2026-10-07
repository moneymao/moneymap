import api from "./api";

const syncUser = async () => {
  const response = await api.post("/auth/sync");
  return response.data;
};

const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

const authService = {
  syncUser,
  getCurrentUser,
  logout,
};

export default authService;