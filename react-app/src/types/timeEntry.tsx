// types/timeEntry.ts
export interface TimeEntry {
    start_time: string;
    end_time: string;
    description: string;
    project_id: number | null;
    task_id: number | null;
}

export interface TimeEntryResponse {
    success: boolean;
    data?: {
        id: number;
        project_id: number | null;
        task_id: number | null;
        user_id: string;
        start_time: string;
        end_time: string;
        description: string;
        created_at: string;
        updated_at: string;
    };
    message: string;
}
