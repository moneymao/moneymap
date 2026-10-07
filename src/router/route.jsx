import { createBrowserRouter } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout/PublicLayout";
import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout";

import ProtectedRoute from "./ProtectedRoute";

import Home from "../pages/Home/Home";
import HowItWorks from "../pages/HowItWorks/HowItWorks";
import Features from "../pages/Features/Features";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import VerifyEmail from "../pages/VerifyEmail/VerifyEmail";
import Dashboard from "../pages/Dashboard/Dashboard";
import Transactions from "../pages/Transactions/Transactions";
import Budget from "../pages/Budget/Budget";
import Goals from "../pages/Goals/Goals";
import Reports from "../pages/Reports/Reports";
import NotFound from "../pages/NotFound/NotFound";

const router = createBrowserRouter([
    {
        element: <PublicLayout />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/how-it-works",
                element: <HowItWorks />,
            },
            {
                path: "/features",
                element: <Features />,
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/register",
                element: <Register />,
            },
            {
                path: "/verify-email",
                element: <VerifyEmail />,
            },
        ],
    },

    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <DashboardLayout />,
                children: [
                    {
                        path: "/dashboard",
                        element: <Dashboard />,
                    },
                    {
                        path: "/transactions",
                        element: <Transactions />,
                    },
                    {
                        path: "/budget",
                        element: <Budget />,
                    },
                    {
                        path: "/goals",
                        element: <Goals />,
                    },
                    {
                        path: "/reports",
                        element: <Reports />,
                    },
                ],
            },
        ],
    },

    {
        path: "*",
        element: <NotFound />,
    },
]);

export default router;