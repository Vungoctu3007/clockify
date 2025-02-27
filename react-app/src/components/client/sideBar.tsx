import React, { useState } from "react";
import {
    Clock,
    Calendar,
    LayoutGrid,
    BarChart2,
    FileText,
    Users,
    UserCircle,
    Tags,
    ChevronDown,
    ChevronUp,
    Menu,
    X,
} from "lucide-react";

const Sidebar = ({ isCollapsed, toggleSidebar }: { isCollapsed: boolean; toggleSidebar: () => void }) => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const NavItem = ({ icon: Icon, text }: { icon: any; text: string }) => (
        <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors">
            <Icon size={20} />
            {!isCollapsed && <span>{text}</span>}
        </a>
    );

    const SectionTitle = ({ title }: { title: string }) =>
        !isCollapsed && <div className="px-4 py-2 text-sm text-gray-500">{title}</div>;

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                className="fixed top-16 left-4 p-2 bg-white rounded-md shadow-md lg:hidden z-50"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
                {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed top-13 left-0 h-[calc(100%-56px)] bg-white shadow-lg transition-all duration-300 z-30
                    ${isCollapsed ? "w-16" : "w-64"}
                    ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
                    lg:translate-x-0`}
            >
                <div className="h-14 flex items-center justify-end px-4 border-b">
                    <button className="hidden lg:flex items-center text-gray-500 hover:text-gray-700" onClick={toggleSidebar}>
                        {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                    </button>
                </div>

                <nav className="pt-2">
                    <NavItem icon={Clock} text="TIME TRACKER" />
                    <NavItem icon={Calendar} text="CALENDAR" />
                    <SectionTitle title="ANALYZE" />
                    <NavItem icon={LayoutGrid} text="DASHBOARD" />
                    <NavItem icon={BarChart2} text="REPORTS" />
                    <SectionTitle title="MANAGE" />
                    <NavItem icon={FileText} text="PROJECTS" />
                    <NavItem icon={Users} text="TEAM" />
                    <NavItem icon={UserCircle} text="CLIENTS" />
                    <NavItem icon={Tags} text="TAGS" />
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
