import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Link } from "react-router";
import React, { useState, useEffect } from "react";
import { Menu, Bell, HelpCircle } from "lucide-react";

interface PropIndex {
    title: string;
    link: string;
    subItems?: {
        title: string;
        link: string;
    }[];
}

interface HeaderProps {
    items: PropIndex[];
}

const Header: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            {/* Thêm div giữ chỗ có chiều cao bằng header */}
            {isScrolled && <div className="h-16"></div>}

            <header
                className={`w-full bg-white border-b border-gray-200 transition-all duration-300 ${
                    isScrolled ? "fixed top-0 left-0 shadow-md z-50" : "relative"
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
                            <button className="p-2 text-gray-400 hover:text-gray-500">
                                <Bell className="w-5 h-5" />
                            </button>
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
