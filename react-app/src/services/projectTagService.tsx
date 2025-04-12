import axios from "axios";

const endpoint = "project-tag";

export const getTagsByProjectId = async(projectId: number) => {
    try {
        const response = await axios.get(`/${endpoint}/get-all-tags-by-projectId`, {
            params: {projectId}
        });
        return response.data;
    } catch (error) {
        console.error("Error paginate projects", error);
        throw error;
    }
}

