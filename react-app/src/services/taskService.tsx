import axios from "axios";

const endpoint = "tasks";

export const getAllTaskByProjectId = async (queryString: any) => {
    try {
        const response = await axios.get(`/${endpoint}/index`, {
            params: queryString,
        });
        return response.data;
    } catch (error) {
        console.error("Error paginate projects", error);
        throw error;
    }
};

export const createTask = async (taskData: {
    title: string;
    description: string;
    project_id: number;
    user_id: number | null
}) => {
    try {
        const response = await axios.post(`/${endpoint}/create`, taskData);
        return response.data;
    } catch (error) {
        console.error("Error creating task", error);
        throw error;
    }
};

export const updateTask = async (taskId: number, taskData: {
    title: string;
    description: string;
}) => {
    try {
        const response = await axios.put(`/${endpoint}/${taskId}`, taskData);
        return response.data;
    } catch (error) {
        console.error("Error updating task", error);
        throw error;
    }
};

export const deleteTask = async (taskId: number) => {
    try {
        const response = await axios.delete(`/${endpoint}/${taskId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting task", error);
        throw error;
    }
};
