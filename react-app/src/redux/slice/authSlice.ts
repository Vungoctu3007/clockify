import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../store"
import { ToastType } from "../../contexts/toastContext"
import { User } from "@/types/User"

// Define a type for the slice state
export interface AuthState {
    isAuthenticated: boolean,
    user: User | null
}

// Define the initial state using that type
const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
};

export const authSlice = createSlice({
    name: "toast",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setAuthLogin: (state, action: PayloadAction<User | null>) => {
            state.isAuthenticated = true
            state.user = action.payload
        },

        setAuthLogout: (state) => {
            state.isAuthenticated = false
            state.user = null
        }
    },
});

export const { setAuthLogin, setAuthLogout } = authSlice.actions
export default authSlice.reducer
