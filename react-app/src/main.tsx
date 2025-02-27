import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import { store } from "./redux/store.ts";
import { Provider } from "react-redux";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router";

import Layout from "./components/client/layout.tsx";
import Login from "./pages/login.tsx";
import Home from "./pages/home.tsx";
import Calendar from "./pages/calendar/screens/index.tsx";
import Tasks from "./pages/tasks/screens/index.tsx";
import AuthMiddleware from "./middlewares/AuthMiddleware.tsx";
import TimeTracking from "./pages/time_tracker/screens/index.tsx";

const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/",
        element: (
            <AuthMiddleware>
               <Layout/>
            </AuthMiddleware>
        ),
        children: [
            {
                path: "/",
                element: <Tasks />
            },
            {
                path: "/calendar",
                element: <Calendar/>
            },
            {
                path: "/tasks",
                element: <Tasks/>
            },
            {
                path: "/time-tracker",
                element: <TimeTracking/>
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
