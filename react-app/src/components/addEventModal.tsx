import React, { useState, useEffect } from "react";
import { getAllProjectsByUserId } from "@/services/projectService";
import BasicSelect from "./basicSelect";
import { createNewTimeEntry, updateTimeEntry, deleteTimeEntry } from "@/services/timeEntryService";
import { TimeEntry } from "@/types/timeEntry";
import { useDispatch } from "react-redux";
import { setToast } from "@/redux/slice/toastSlice";

interface Task {
    task_id: number;
    title: string;
}

interface Project {
    id: number;
    name: string;
    user_id: number;
    tasks: Task[];
    color: string;
}

interface AddEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    startTime: Date | null;
    endTime: Date | null;
    onEventAdded: (event: CalendarEvent) => void;
    onEventDeleted?: (timeEntryId: number) => void; // Thêm prop để thông báo xóa
    selectedEvent?: CalendarEvent | null;
}

interface CalendarEvent {
    time_entry_id?: number;
    title: string;
    start: string;
    end: string;
    borderColor: string;
    textColor: string;
    extendedProps?: {
        description: string;
        project_id: number;
        task_id: number;
    };
}

const AddEventModal: React.FC<AddEventModalProps> = ({
    isOpen,
    onClose,
    startTime: initialStartTime,
    endTime: initialEndTime,
    onEventAdded,
    onEventDeleted,
    selectedEvent,
}) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [formData, setFormData] = useState({
        description: "",
        project_id: 0,
        task_id: 0,
    });
    const [localStartTime, setLocalStartTime] = useState<Date | null>(initialStartTime);
    const [localEndTime, setLocalEndTime] = useState<Date | null>(initialEndTime);
    const dispatch = useDispatch();

    useEffect(() => {
        if (isOpen) {
            const loadData = async () => {
                try {
                    const projectsData = await getAllProjectsByUserId();
                    setProjects(projectsData.data);
                    const offsetVN = 7 * 60 * 60 * 1000; // UTC+7 offset in milliseconds

                    if (selectedEvent && selectedEvent.extendedProps) {
                        const startDateUtc = new Date(selectedEvent.start);
                        const endDateUtc = selectedEvent.end ? new Date(selectedEvent.end) : null;

                        const localStart = new Date(startDateUtc.getTime() - offsetVN);
                        const localEnd = endDateUtc ? new Date(endDateUtc.getTime() - offsetVN) : null;

                        setFormData({
                            description: selectedEvent.extendedProps.description || "",
                            project_id: selectedEvent.extendedProps.project_id || 0,
                            task_id: selectedEvent.extendedProps.task_id || 0,
                        });
                        setLocalStartTime(localStart);
                        setLocalEndTime(localEnd);
                    } else {
                        setFormData({
                            description: "",
                            project_id: 0,
                            task_id: 0,
                        });
                        setLocalStartTime(initialStartTime);
                        setLocalEndTime(initialEndTime);
                    }
                } catch (error) {
                    console.error("Error loading data:", error);
                }
            };
            loadData();
        } else {
            setProjects([]);
            setFormData({
                description: "",
                project_id: 0,
                task_id: 0,
            });
            setLocalStartTime(null);
            setLocalEndTime(null);
        }
    }, [isOpen, initialStartTime, initialEndTime, selectedEvent]);

    const selectedProject = projects.find((project) => project.id === formData.project_id);
    const tasks = formData.project_id !== 0 && selectedProject
        ? selectedProject.tasks
        : projects.flatMap((project) => project.tasks);

    const handleSubmit = async () => {
        if (!localStartTime || !localEndTime) return;

        const offsetVN = 7 * 60 * 60 * 1000;
        const startTime = new Date(localStartTime.getTime() + offsetVN).toISOString();
        const endTime = new Date(localEndTime.getTime() + offsetVN).toISOString();

        const newEvent: TimeEntry = {
            start_time: startTime,
            end_time: endTime,
            description: formData.description,
            project_id: formData.project_id || null,
            task_id: formData.task_id || null,
        };

        try {
            let response;
            if (selectedEvent?.time_entry_id) {
                response = await updateTimeEntry(selectedEvent.time_entry_id, newEvent);
                dispatch(setToast({ message: "Time entry updated successfully", type: "success" }));
            } else {
                response = await createNewTimeEntry(newEvent);
                dispatch(setToast({ message: "Time entry created successfully", type: "success" }));
            }

            if (response.success && response.data) {
                const calendarEvent: CalendarEvent = {
                    time_entry_id: selectedEvent?.time_entry_id || response.data.id,
                    title: selectedProject?.name || "New Event",
                    start: startTime,
                    end: endTime,
                    borderColor: selectedProject?.color || "gray",
                    textColor: selectedProject?.color || "black",
                    extendedProps: {
                        description: formData.description,
                        project_id: formData.project_id,
                        task_id: formData.task_id,
                    },
                };
                onEventAdded(calendarEvent);
                onClose();
            } else {
                console.error("Failed to save time entry:", response.message);
                dispatch(setToast({ message: "Failed to save time entry", type: "error" }));
            }
        } catch (error: any) {
            console.error("Error:", error.message || "Something went wrong");
            dispatch(setToast({ message: "Error saving time entry", type: "error" }));
        }
    };

    const handleDelete = async () => {
        if (!selectedEvent?.time_entry_id) return;

        try {
            const response = await deleteTimeEntry(selectedEvent.time_entry_id);
            if (response.success) {
                dispatch(setToast({ message: "Time entry deleted successfully", type: "success" }));
                onEventDeleted?.(selectedEvent.time_entry_id); 
                onClose();
            } else {
                dispatch(setToast({ message: "Failed to delete time entry", type: "error" }));
                console.error("Failed to delete time entry:", response.message);
            }
        } catch (error: any) {
            console.error("Error deleting time entry:", error);
            dispatch(setToast({ message: "Error deleting time entry", type: "error" }));
        }
    };

    const formatTimeForInput = (date: Date | null) => {
        if (!date) return "00:00";
        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    };

    const formatDateForInput = (date: Date | null) => {
        if (!date) return "";
        return date.toISOString().split("T")[0];
    };

    const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const [hours, minutes] = e.target.value.split(":");
        const newStartTime = new Date(localStartTime || new Date());
        newStartTime.setHours(parseInt(hours), parseInt(minutes), 0);
        setLocalStartTime(newStartTime);
    };

    const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const [hours, minutes] = e.target.value.split(":");
        const newEndTime = new Date(localEndTime || new Date());
        newEndTime.setHours(parseInt(hours), parseInt(minutes), 0);
        setLocalEndTime(newEndTime);
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = new Date(e.target.value);
        if (localStartTime) {
            const updatedStartTime = new Date(localStartTime);
            updatedStartTime.setFullYear(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
            setLocalStartTime(updatedStartTime);
        }
        if (localEndTime) {
            const updatedEndTime = new Date(localEndTime);
            updatedEndTime.setFullYear(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
            setLocalEndTime(updatedEndTime);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[32rem] relative">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">
                        {selectedEvent?.time_entry_id ? "Edit Time Entry" : "Add Time Entry"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <form className="max-w-[28rem] mx-auto grid grid-cols-3 gap-4 mb-4">
                    <div>
                        <label
                            htmlFor="start-time"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Start time:
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                                <svg
                                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <input
                                type="time"
                                id="start-time"
                                className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                min="00:00"
                                max="23:59"
                                value={formatTimeForInput(localStartTime)}
                                onChange={handleStartTimeChange}
                            />
                        </div>
                    </div>
                    <div>
                        <label
                            htmlFor="end-time"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            End time:
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                                <svg
                                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <input
                                type="time"
                                id="end-time"
                                className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                min="00:00"
                                max="23:59"
                                value={formatTimeForInput(localEndTime)}
                                onChange={handleEndTimeChange}
                            />
                        </div>
                    </div>
                    <div>
                        <label
                            htmlFor="event-date"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Date:
                        </label>
                        <input
                            type="date"
                            id="event-date"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={formatDateForInput(localStartTime)}
                            onChange={handleDateChange}
                        />
                    </div>
                </form>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        placeholder="What have you worked on?"
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                description: e.target.value,
                            })
                        }
                        className="w-full p-2 border rounded-lg mt-1"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Project
                    </label>
                    <BasicSelect
                        placeholder="Select Project"
                        options={projects.map((project) => project.name)}
                        value={
                            formData.project_id
                                ? projects.find((p) => p.id === formData.project_id)?.name || ""
                                : ""
                        }
                        onChange={(value) => {
                            const selectedProject = projects.find((p) => p.name === value);
                            setFormData({
                                ...formData,
                                project_id: selectedProject ? selectedProject.id : 0,
                                task_id: 0,
                            });
                        }}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Task
                    </label>
                    <BasicSelect
                        placeholder="Select Task"
                        options={tasks.map((task) => task.title || `Task ID: ${task.task_id}`)}
                        value={
                            formData.task_id
                                ? tasks.find((t) => t.task_id === formData.task_id)?.title || ""
                                : ""
                        }
                        onChange={(value) => {
                            const selectedTask = tasks.find(
                                (t) => (t.title || `Task ID: ${t.task_id}`) === value
                            );
                            setFormData({
                                ...formData,
                                task_id: selectedTask ? selectedTask.task_id : 0,
                            });
                        }}
                    />
                </div>

                <div className="flex justify-end gap-2">
                    {selectedEvent?.time_entry_id && (
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                            DELETE
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        {selectedEvent?.time_entry_id ? "UPDATE" : "ADD"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddEventModal;
