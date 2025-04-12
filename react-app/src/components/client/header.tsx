import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Menu, Bell, HelpCircle } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import NotificationItem from "../notification";
import { fetchInitialNotifications } from "@/services/notificationService"; // Import API
import { Notification } from "@/types/notification"; // Import type Notification

interface PropIndex {
    title: string;
    link: string;
    subItems?: {
        title: string;
        link: string;
    }[];
}

interface HeaderProps {
    items?: PropIndex[];
    userId: number | null; // Thêm userId để gọi API
}

const Header: React.FC<HeaderProps> = ({ userId }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]); // State để lưu notifications

    const toggleNotification = async () => {
        if (!isNotificationOpen && userId) {
            // Gọi API để lấy notifications khi mở dropdown
            try {
                const response = await fetchInitialNotifications(userId);
                if (response) {
                    setNotifications(response);
                } else {
                    console.error("No notifications found or API error");
                    setNotifications([]);
                }
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
                setNotifications([]);
            }
        }
        setIsNotificationOpen(!isNotificationOpen);
    };

    // Đóng dropdown khi click bên ngoài
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            const dropdown = document.getElementById("notification-dropdown");
            const button = document.getElementById("notification-button");

            if (
                dropdown &&
                button &&
                !dropdown.contains(target) &&
                !button.contains(target)
            ) {
                setIsNotificationOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            {isScrolled && <div className="h-16"></div>}

            <header
                className={`w-full bg-white border-b border-gray-200 transition-all duration-300 ${
                    isScrolled
                        ? "fixed top-0 left-0 shadow-md z-50"
                        : "relative"
                }`}
            >
                <div className="px-4 mx-auto max-w-8xl">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <img
                                src="https://app.clockify.me/assets/logo.svg"
                                alt="Logo"
                                className="h-8"
                            />
                            <nav className="hidden md:ml-6 md:flex md:space-x-4">
                                <span className="text-gray-700">
                                    Vungoctu12a3's workspace
                                </span>
                            </nav>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex md:items-center md:space-x-4">
                            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600">
                                UPGRADE
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-500">
                                <HelpCircle className="w-5 h-5" />
                            </button>

                            <div className="relative inline-block text-left">
                                {/* Nút thông báo */}
                                <button
                                    id="notification-button"
                                    onClick={toggleNotification}
                                    className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none"
                                    type="button"
                                >
                                    <Bell className="w-5 h-5" />
                                </button>

                                {/* Hộp thoại thông báo */}
                                <div
                                    id="notification-dropdown"
                                    className={`absolute right-0 z-10 mt-2 w-80 bg-white rounded-lg shadow-lg dark:bg-gray-700 transition-opacity duration-200 ${
                                        isNotificationOpen
                                            ? "opacity-100 block"
                                            : "opacity-0 hidden"
                                    }`}
                                >
                                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                            Thông báo
                                        </h3>
                                        <button className="text-xs text-green-500 hover:text-green-600">
                                            Đánh dấu là đã đọc
                                        </button>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.length > 0 ? (
                                            notifications.map((notification, index) => (
                                                <NotificationItem
                                                    key={index}
                                                    title={notification.title}
                                                    content={notification.content}
                                                    time={notification.time}
                                                    isRead={notification.isRead}
                                                />
                                            ))
                                        ) : (
                                            <div className="p-4 text-center text-gray-500">
                                                Không có thông báo
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button className="flex items-center justify-center w-8 h-8 text-white bg-green-500 rounded-full">
                                VU
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex md:hidden">
                            <button className="p-2 text-gray-400 hover:text-gray-500">
                                <Menu className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;
