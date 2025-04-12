import React from "react";
import { Check } from "lucide-react";

interface NotificationItemProps {
    title: string;
    content: string;
    time: string;
    isRead: boolean;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
    title,
    content,
    time,
    isRead,
}) => {
    return (
        <div className="flex items-start p-4 border-b border-gray-200 hover:bg-gray-50">
            <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
                <p className="text-sm text-gray-600">{content}</p>
                <span className="text-xs text-gray-400">{time}</span>
            </div>
            {isRead && (
                <Check className="w-5 h-5 text-green-500 ml-2" />
            )}
        </div>
    );
};

export default NotificationItem;
