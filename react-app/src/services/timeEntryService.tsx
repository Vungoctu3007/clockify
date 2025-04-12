// services/timeEntryService.ts
import axios from "axios";
import { TimeEntry, TimeEntryResponse } from "@/types/timeEntry";
const endpoint = "time-entries";

export const getAllTimeEntryByUserId = async () => {
    try {
        const response = await axios.get(`/${endpoint}`, {
            withCredentials: true,
            headers: {
                Accept: "application/json",
            },
        });

        return response.data;

    } catch (error) {
        console.error("Error fetching events:", error);
    }
};

export const createNewTimeEntry = async (timeEntryData: TimeEntry): Promise<TimeEntryResponse> => {
    try {
        const response = await axios.post<TimeEntryResponse>(
            `/${endpoint}/create-new-time-entry`,
            timeEntryData,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
            }
        );

        return response.data;
    } catch (error: any) {
        console.error("Error creating time entry:", error);
        throw error.response?.data || error;
    }
};
// timeEntryService.ts
export const updateTimeEntry = async (timeEntryId: number, timeEntryData: TimeEntry): Promise<TimeEntryResponse> => {
    try {
        const response = await axios.put<TimeEntryResponse>(
            `/time-entries/${timeEntryId}`, // Thêm time_entry_id vào URL
            timeEntryData,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
            }
        );
        return response.data;
    } catch (error: any) {
        console.error("Error updating time entry:", error);
        throw error.response?.data || error;
    }
};

export const deleteTimeEntry = async (timeEntryId: number)=> {
    try {
        const response = await axios.delete<TimeEntryResponse>(
            `/time-entries/${timeEntryId}`,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
            }
        );
        return response.data;
    } catch (error: any) {
        console.error("Error delete time entry:", error);
        throw error.response?.data || error;
    }
};
