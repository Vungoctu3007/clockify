import React, { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { showToast } from "../../helpers/myHelper";
import { clearToast } from "@/redux/slice/toastSlice";
import Header from "./header";
import SideBar from "./sideBar";
import echo from "@/pusher/echo";
import { fetchUser } from "@/services/authService";
import { User } from "@/types/User";
import { Notification } from "@/types/notification";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

const Layout: React.FC = () => {
    const { message, type } = useSelector((state: RootState) => state.toast);
    const dispatch = useDispatch();
    const { toast } = useToast();

    const [userId, setUserId] = useState<number | null>(null);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        const getUser = async () => {
            const user: User | null = await fetchUser();
            if (user) {
                setUserId(user.user_id);
            } else {
                console.error("Failed to fetch user");
            }
        };

        getUser();
    }, []);

    useEffect(() => {
        if (!userId) return;

        const channel = echo.private(`task-reminders.${userId}`);
        channel.listen('TaskReminderEvent', (e: Notification) => {
            toast({
                title: e.title,
                description: e.content,
                duration: 5000,
            });
        });

        return () => {
            channel.stopListening('TaskReminderEvent');
            echo.leave(`task-reminders.${userId}`);
        };
    }, [userId, toast]);

    useEffect(() => {
        showToast(message, type);
        dispatch(clearToast());
    }, [message, type]);

    return (
        <div className="flex flex-col min-h-screen">
            <Toaster />
            <Header userId={userId} />
            <div className="flex flex-1">
                <SideBar isCollapsed={isCollapsed} toggleSidebar={() => setIsCollapsed(!isCollapsed)} />
                <main className={`transition-all duration-300 w-full p-1 bg-gray-100 ${isCollapsed ? "ml-16" : "ml-64"}`}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
