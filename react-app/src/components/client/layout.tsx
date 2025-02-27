import React from "react"
import { Outlet } from "react-router"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { showToast } from "../../helpers/myHelper"
import { clearToast } from "@/redux/slice/toastSlice"
import Header from "./header"
import SideBar from "./sideBar";

const Layout : React.FC = () => {
    const { message, type } = useSelector((state: RootState) => state.toast)
    const dispatch = useDispatch()


    useEffect(() => {
        showToast(message, type)
        dispatch(clearToast())
    }, [message, type])

    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <div className="flex flex-1">
                <SideBar isCollapsed={isCollapsed} toggleSidebar={() => setIsCollapsed(!isCollapsed)} />

                <main className={`transition-all duration-300 w-full p-1 bg-gray-100 ${isCollapsed ? "ml-16" : "ml-64"}`}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout
