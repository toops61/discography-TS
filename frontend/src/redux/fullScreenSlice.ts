import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
    fullScreen:false,
    idShown: -1
}

const fullScreenSlice = createSlice({
    name: "discShown",
    initialState,
    reducers: {
        updateFullscreen: (state,action: PayloadAction<{[key:string]:number|boolean}>) => {
            state = {...state,...action.payload};
            return state;
        }
    }
})

export const {updateFullscreen} = fullScreenSlice.actions;

export default fullScreenSlice.reducer;