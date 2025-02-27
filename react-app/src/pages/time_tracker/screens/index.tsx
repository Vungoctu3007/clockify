import TimeTrackerEntry from "@/components/timeTakerEntry";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Calendar,
    Tags,
    DollarSign,
    Play,
    MoreHorizontal,
    CirclePlus,
} from "lucide-react";
import { useState } from "react";

const TimeTracking = () => {
    const [tasks, setTasks] = useState([
        {
            date: "Today",
            total: "01:30:00",
            items: [
                {
                    description: "Learn English",
                    time: "17:15 - 18:45",
                    duration: "01:30:00",
                },
            ],
        },
        {
            date: "Yesterday",
            total: "06:30:00",
            items: [
                {
                    description: "GIT",
                    time: "12:15 - 14:00",
                    duration: "01:45:00",
                },
                {
                    description: "OOP",
                    time: "03:45 - 07:00",
                    duration: "03:15:00",
                },
                {
                    description: "personal project",
                    time: "01:15 - 02:45",
                    duration: "01:30:00",
                },
            ],
        },
    ]);

    return (
        <div className="p-8 min-h-screen">
            <TimeTrackerEntry />
            <div className="mt-6">
                {tasks.map((task, index) => (
                    <TimeTrackerEntry />
                ))}
            </div>
        </div>
    );
};

export default TimeTracking;
