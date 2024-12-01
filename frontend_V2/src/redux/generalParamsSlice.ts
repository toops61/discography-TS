import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
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
        updateGeneralParams: (state,action: PayloadAction<{[key:string]:string|boolean}>) => {
            state = {...state,...action.payload};
            return state;
        }
    }
})

export const {updateGeneralParams} = generalParamsSlice.actions;

export default generalParamsSlice.reducer;