import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { discFields } from "../utils/interfaces";

interface displayedSliceTypes {
    maxPerPage: number,
    pageSelected: number,
    displayedDiscs: discFields[],
    pagesDisplayed: discFields[][]
}

const initialState : displayedSliceTypes = {
    maxPerPage: 50,
    pageSelected: 1,
    displayedDiscs: [],
    pagesDisplayed: [],
}

const displayedSlice = createSlice({
    name: "displayedDiscs",
    initialState,
    reducers: {
        updateDisplayed: (state,action: PayloadAction<{[key:string]:number|discFields[]|discFields[][]}>) => {
            state = {...state,...action.payload};
            return state;
        }
    }
})

export const {updateDisplayed} = displayedSlice.actions;

export default displayedSlice.reducer;