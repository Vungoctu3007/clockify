import axios from "../configs/axios";
import { Notification } from "@/types/notification";
import { handleAxiosError } from "../helpers/axiosHelper";

const endpoint = "notifications";

export const fetchInitialNotifications = async (
    userId: number
): Promise<Notification[] | null> => {
    try {
        const response = await axios.get(`${endpoint}?user_id=${userId}`);
        return response.data; // API trả về một mảng Notification[]
    } catch (error) {
        handleAxiosError(error);
        return null;
    }
};
