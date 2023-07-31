import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface ParamsState {
    isLoading: boolean;
    connected: boolean;
    alertVisible: boolean;
    alertMessage: string;
    alertType: string;
}

const initialState: ParamsState = {
    isLoading: false,
    connected: false,
    alertVisible: false,
    alertMessage: '',
    alertType: ''
}

const generalParamsSlice = createSlice({
    name: "generalParams",
    initialState,
    reducers: {
        updateGeneralParams: (state,action: PayloadAction<object>) => {
            state = {...state,...action.payload};
            return state;
        }
    }
})

export const {updateGeneralParams} = generalParamsSlice.actions;

export default generalParamsSlice.reducer;