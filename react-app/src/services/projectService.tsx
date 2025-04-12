import { IProject } from "@/interfaces/type/project";
import axios from "axios";

const endpoint = "projects";

export const pagination = async (queryString: any) => {
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

export const save = async (
    payload: IProject,
    updateParams: { action: string; id: string | undefined }
) => {
    try {
        const urlApi =
            updateParams.action === "update" && updateParams.id
                ? `/projects/${updateParams.id}`
                : "/projects";

        const response = await axios.post(urlApi, payload);
        console.log("save successfully");
        return response.data;
    } catch (error) {
        console.error("Error saving project:", error);
        throw error;
    }
};

export const getAllProjectsByUserId = async(

) => {
    try {
        const response = await axios.get(`/${endpoint}/get-all-projects-and-tasks`);

        return response.data;

    } catch (error) {
        console.error("Error get all projects:", error);
        throw error;
    }
}
