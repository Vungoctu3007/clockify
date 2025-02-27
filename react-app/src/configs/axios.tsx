import axios from "axios"
export const baseUrl = 'http://localhost:8000/api/v1/'

axios.interceptors.response.use(
    response => {
        return response
    },
    error => {
        return Promise.reject(error);
    }
)

axios.defaults.withCredentials = true
axios.defaults.baseURL = baseUrl
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';

export default axios
