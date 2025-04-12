import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { createTask, getAllTaskByProjectId, updateTask, deleteTask } from "@/services/taskService";
import { setToast } from "@/redux/slice/toastSlice";
import { useDispatch } from "react-redux";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { fetchUser } from "@/services/authService";
import { User } from "@/types/User";

interface Task {
    task_id: number;
    project_id: number;
    title: string;
    description: string;
}

const Task: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [newTaskTitle, setNewTaskTitle] = useState<string>("");
    const [newTaskDescription, setNewTaskDescription] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [editTitle, setEditTitle] = useState<string>("");
    const [editDescription, setEditDescription] = useState<string>("");
    const dispatch = useDispatch();
    const [userId, setUserId] = useState<number | null>(null);

    const filteredTasks: Task[] = tasks.filter((task: Task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

    // Hàm lấy danh sách task
    const fetchTasks = async () => {
        if (!projectId) return;

        try {
            setLoading(true);
            setError(null);
            const queryString = { project_id: projectId };
            const data = await getAllTaskByProjectId(queryString);
            setTasks(data.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Lỗi khi lấy danh sách task");
            console.error("Fetch tasks error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [projectId]);

    const handleAddTask = async () => {
        if (newTaskTitle.trim() === "") return;
        const taskData = {
            title: newTaskTitle.trim(),
            description: newTaskDescription.trim(),
            project_id: projectId ? parseInt(projectId) : 0,
            user_id: userId
        };

        try {
            setLoading(true);
            setError(null);
            const response = await createTask(taskData);
            if(response) {
                dispatch(
                    setToast({
                        message: "Thêm task thành công",
                        type: "success",
                    })
                );
                setNewTaskTitle("");
                setNewTaskDescription("");
                await fetchTasks();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Lỗi khi thêm task");
            console.error("Add task error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setEditTitle(task.title);
        setEditDescription(task.description || "");
    };

    const handleSaveEdit = async () => {
        if (!editingTask || editTitle.trim() === "") return;

        const taskData = {
            title: editTitle.trim(),
            description: editDescription.trim(),
        };

        try {
            setLoading(true);
            setError(null);
            await updateTask(editingTask.task_id, taskData);
            dispatch(
                setToast({
                    message: "Cập nhật task thành công",
                    type: "success",
                })
            );
            setEditingTask(null);
            await fetchTasks(); // Cập nhật lại danh sách sau khi sửa
        } catch (err) {
            setError(err instanceof Error ? err.message : "Lỗi khi cập nhật task");
            console.error("Update task error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTask = async (taskId: number) => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa task này?");
        if (!confirmDelete) return;

        try {
            setLoading(true);
            setError(null);
            await deleteTask(taskId);
            dispatch(
                setToast({
                    message: "Xóa task thành công",
                    type: "success",
                })
            );
            await fetchTasks();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Lỗi khi xóa task");
            console.error("Delete task error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            {loading && <p>Đang tải tasks...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {/* Filter and Add new task */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by title"
                            value={searchTerm}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setSearchTerm(e.target.value)
                            }
                            className="border border-gray-300 rounded px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg
                                className="h-5 w-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="flex space-x-2">
                    <input
                        type="text"
                        placeholder="Task title"
                        value={newTaskTitle}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setNewTaskTitle(e.target.value)
                        }
                        className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    />
                    <input
                        type="text"
                        placeholder="description"
                        value={newTaskDescription}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setNewTaskDescription(e.target.value)
                        }
                        className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    />
                    <button
                        onClick={handleAddTask}
                        className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 disabled:bg-gray-400"
                        disabled={loading}
                    >
                        ADD
                    </button>
                </div>
            </div>

            {/* Tasks Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b border-gray-300">
                            <th className="text-left p-3 font-medium">TITLE</th>
                            <th className="text-left p-3 font-medium">DESCRIPTION</th>
                            <th className="text-left p-3 font-medium">TASK ID</th>
                            <th className="text-left p-3 font-medium">PROJECT ID</th>
                            <th className="text-left p-3 font-medium">OPERATION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTasks.map((task: Task) => (
                            <tr
                                key={task.task_id}
                                className="border-b border-gray-200 hover:bg-gray-50"
                            >
                                <td className="p-3">{task.title}</td>
                                <td className="p-3">{task.description || "-"}</td>
                                <td className="p-3">{task.task_id}</td>
                                <td className="p-3">{task.project_id}</td>
                                <td className="p-3 text-center space-x-2">
                                    <button
                                        onClick={() => handleEditTask(task)}
                                        className="text-blue-500 hover:text-blue-700"
                                        disabled={loading}
                                        title="Sửa"
                                    >
                                        <PencilIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteTask(task.task_id)}
                                        className="text-red-500 hover:text-red-700"
                                        disabled={loading}
                                        title="Xóa"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal chỉnh sửa task */}
            {editingTask && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-semibold mb-4">Chỉnh sửa Task</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Tiêu đề</label>
                            <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={loading}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                            <input
                                type="text"
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={loading}
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setEditingTask(null)}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                disabled={loading}
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
                                disabled={loading}
                            >
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Task;
