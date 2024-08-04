import { ChangeEvent } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { updateFilters } from "../redux/filterSlice";

export default function DiscoSelectedForm() {
    const { allFormats,allStyles } = useAppSelector(state => state.formsArraysSlice);
    const filterObject = useAppSelector(state => state.filterSlice);

    const getDefaultValue = (name:'format'|'genre') => {
        const defaultValue = filterObject.filter_selected.find(filter => filter.selected_category === name);
        return defaultValue ? defaultValue.selected : '';
    }

    const dispatch = useAppDispatch();

    const handleChange : ((e:ChangeEvent) => void) = e => {
        const tempFilterObject = {...filterObject};
        const filter_selected = [...tempFilterObject.filter_selected];
        const tempObject = {
            selected_category: '',
            selected: ''
        };
        const target = e.target as HTMLInputElement;
        tempObject.selected_category = target.name;
        tempObject.selected = target.value;
        const previousId = filter_selected.findIndex(selected => selected.selected_category === tempObject.selected_category);
        previousId !== -1 ? filter_selected.splice(previousId,1,tempObject) : filter_selected.push(tempObject);
        if (!tempObject.selected && previousId !== -1) filter_selected.splice(previousId,1);
        dispatch(updateFilters({...tempFilterObject,filter_selected}));
    }
    
  return (
    <form className="filter-nav">
        {filterObject.filter_category !== 'format' && allFormats.length ? <div className="filter-field" tabIndex={0}>
            <label htmlFor="format">format</label>
            <select name="format" id="format" onChange={handleChange} defaultValue={getDefaultValue('format')} >
                <option value=''></option>
                {allFormats.map((format,ind) => <option value={format} key={format+ind}>{format}</option>)}   
            </select>
        </div> : <></>}
        {filterObject.filter_category !== 'genre' && allStyles.length ? <div className="filter-field" tabIndex={0}>
            <label htmlFor="genre">genre</label>
            <select name="genre" id="genre" onChange={handleChange} defaultValue={getDefaultValue('genre')} >
                <option value=''></option>
                {allStyles.map((style,ind) => <option value={style} key={style+ind}>{style}</option>)}   
            </select>
        </div> : <></>}
    </form>
  )
}