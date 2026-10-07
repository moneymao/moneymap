import api from "./api";

const getReportSummary = async (params = {}) => {
  const response = await api.get("/reports/summary", {
    params,
  });

  return response.data;
};

const reportService = {
  getReportSummary,
};

export default reportService;