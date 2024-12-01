import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { searchFieldsInterface } from "../utils/interfaces";

const initialState : searchFieldsInterface = sessionStorage.filters ? JSON.parse(sessionStorage.getItem('filters')!) : {
    sort_up: true,
    sort_category: 'artist',
    filter: '',
    filter_category: 'artist',
    filter_selected: []
}

const filterSlice = createSlice({
    name: "filters",
    initialState,
    reducers: {
        updateFilters: (state,action: PayloadAction<searchFieldsInterface>) => {
            const newState = {...state,...action.payload};
            sessionStorage.setItem('filters',JSON.stringify(newState));
            return newState;
        }
    }
})

export const {updateFilters} = filterSlice.actions;

export default filterSlice.reducer;