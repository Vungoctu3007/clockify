import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { ToastType } from "../../contexts/toastContext";

// Define a type for the slice state
export interface ToastState {
    message: string;
    type: ToastType
}

// Define the initial state using that type
const initialState: ToastState = {
    message: "",
    type: null,
};

export const toastSlice = createSlice({
    name: "toast",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setToast: (state, action: PayloadAction<{message: string, type: ToastType}>) => {
            state.message = action.payload.message
            state.type = action.payload.type
        },

        clearToast:(state) => {
            state.message = ''
            state.type = null
        }
    },
});

export const { setToast, clearToast } = toastSlice.actions;
export default toastSlice.reducer;
