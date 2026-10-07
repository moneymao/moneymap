import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import transactionReducer from "./slices/transactionSlice";
import dashboardReducer from "./slices/dashboardSlice";
import budgetReducer from "./slices/budgetSlice";
import goalReducer from "./slices/goalSlice";
import reportReducer from "./slices/reportSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionReducer,
    dashboard: dashboardReducer,
    budget: budgetReducer,
    goals: goalReducer,
    reports: reportReducer,
  },
});

export default store;