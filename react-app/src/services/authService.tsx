import { Dispatch } from "@reduxjs/toolkit"
import axios from "../configs/axios"
import { handleAxiosError } from "../helpers/axiosHelper"
import { useDispatch } from "react-redux"
import { setAuthLogin } from "@/redux/slice/authSlice"
import { User } from "@/types/User"

type LoginPayload = {
    email: string,
    password: string
}

const login = async (payload:LoginPayload): Promise<User | null> => {
    try {
        const response = await axios.post('/auth/login', {
            email: payload.email,
            password: payload.password
        })

        return response.data.user
    } catch (error) {
        handleAxiosError(error)
        return null
    }
}

const fetchUser = async(): Promise<User | null> => {
    try {
        const response = await axios.get('/auth/me')
        return response.data.user
    } catch (error) {
        handleAxiosError(error)
        return null
    }
}

const logout = () => {

}

export { login, logout, fetchUser }
