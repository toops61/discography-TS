import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface formsArraysType {
    allFormats: string[];
    allStyles: string[];
}

const initialState : formsArraysType = sessionStorage.formsArrays ? JSON.parse(sessionStorage.getItem('formsArrays')!) : {
    allFormats: [],
    allStyles: []
};

const formsArraysSlice = createSlice({
    name: "formsArrays",
    initialState,
    reducers: {
        updateFormsArrays: (state,action: PayloadAction<Partial<formsArraysType>>) => {
            const newState = {...state,...action.payload};
            sessionStorage.setItem('formsArrays',JSON.stringify(newState));
            return newState;
        }
    }
})

export const {updateFormsArrays} = formsArraysSlice.actions;

export default formsArraysSlice.reducer;