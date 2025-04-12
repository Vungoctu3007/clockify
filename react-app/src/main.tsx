import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import { store } from "./redux/store.ts";
import { Provider } from "react-redux";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router";

import Layout from "./components/client/layout.tsx";
import Login from "./pages/login.tsx";
import Calendar from "./pages/calendar/screens/index.tsx";
import Projects from "./pages/projects/screens/index.tsx";
import AuthMiddleware from "./middlewares/AuthMiddleware.tsx";
import TimeTracking from "./pages/time_tracker/screens/index.tsx";
import ProjectTasks from "./pages/projects/screens/edit.tsx";
import Team from "./pages/team/screens/index.tsx";
import Tags from "./pages/tags/screens/index.tsx";
import DashboardComponent from "./components/Dashboard.tsx";


const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/",
        element: (
            <AuthMiddleware>
                <Layout />
            </AuthMiddleware>
        ),
        children: [
            {
                path: "/",
                element: <DashboardComponent />,
            },
            {
                path: "/dashboard",
                element: <DashboardComponent />
            },
            {
                path: "/calendar",
                element: <Calendar />,
            },
            {
                path: "/projects",
                element: <Projects />,
            },
            {
                path: "/projects/:projectId/edit",
                element: <ProjectTasks />,
            },
            // {
            //     path: "/time-tracker",
            //     element: <TimeTracking />,
            // },
            {
                path: "/team",
                element: <Team />,
            },
            {
                path: "/tags",
                element: <Tags />,
            },
        ],
    },
]);


createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <RouterProvider router={router} />
        <ToastContainer />
    </Provider>
);
