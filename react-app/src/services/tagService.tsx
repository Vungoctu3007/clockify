import axios from "axios";

const endpoint = "tags";

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

interface ITag {
    tag_id?: number;
    creator_id?: number;
    name: string;
    created_at?: string;
}


export const create = async (
    payload: ITag,
) => {
    try {
        const response = await axios.post(`/${endpoint}/create`, payload);
        console.log("save successfully");
        return response.data;
    } catch (error) {
        console.error("Error saving project:", error);
        throw error;
    }
};

export const update = async (
    tagId: number,
    payload: ITag,
) => {
    try {
        const response = await axios.put(`/${endpoint}/update/${tagId}`, payload);
        if(response.data.success) {
            return response.data;
        }
    } catch (error) {
        console.error("Error saving project:", error);
        throw error;
    }
};

export const deleteTag = async (tagId: number) => {
    try {
        const response = await axios.delete(`/${endpoint}/${tagId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting tag", error);
        throw error;
    }
};

