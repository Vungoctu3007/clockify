import axios from "axios";
import { ITask } from "@/interfaces/type/task";

const endpoint = 'tasks'

export const pagination = async(
    queryString: string
) => {
    try {
        const response = await axios.get(`/${endpoint}/index?${queryString}`);
        return response.data;
    } catch (error) {
        console.error("Error paginate tasks", error);
        throw error;
    }
}

export const save = async(
    payload: ITask,
    updateParams: {action: string, id: string | undefined}
) => {
    try {
        const urlApi = updateParams.action === "update" && updateParams.id
            ? `/tasks/${updateParams.id}`
            : "/tasks";

        const response = await axios.post(urlApi, payload);
        console.log("save successfully");
        return response.data;
    } catch (error) {
        console.error("Error saving task:", error);
        throw error;
    }
}
