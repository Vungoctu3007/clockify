import axios from "axios"
import { toast } from "react-toastify"

const handleAxiosError = (error:unknown):void => {
    if(axios.isAxiosError(error)) {
        if(error.response && error.response.data) {
            toast.error(error.response.data.error)
        } else {
            toast.error('Network Error')
        }
    } else {
        toast.error('Đã xảy ra lỗi không xác định')
    }
}

export { handleAxiosError }
