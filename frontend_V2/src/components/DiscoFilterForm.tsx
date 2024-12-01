import { ChangeEvent } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { updateFilters } from "../redux/filterSlice";

export default function DiscoFilterForm() {
    const filterObject = useAppSelector(state => state.filterSlice);

    const dispatch = useAppDispatch();

    const handleChange : ((e:ChangeEvent) => void) = e => {
        const tempObject = {...filterObject};
        const target = e.target as HTMLInputElement;
        const value = target.value;
        tempObject[target.name] = value;
        dispatch(updateFilters(tempObject));
    }    

  return (
    <form className="filter-nav">
        <div className="filter-field" tabIndex={0}>
            <label htmlFor="filter_category">filtre par</label>
            <select name="filter_category" id="filter_category" onChange={handleChange} value={filterObject.filter_category} >
                <option value="artist">artiste</option>
                <option value="album">album</option>
                <option value="year">année</option>
                <option value="genre">genre</option>
                <option value="format">format</option>
            </select>
        </div>
        <div className="filter-field" tabIndex={0}>
            <label htmlFor="filter">filtre</label>
            <div className="input-container">
                <span>{filterObject.filter || 'a'}</span>
                <input type="text" name="filter" max="50" onChange={handleChange} value={filterObject.filter} required />
            </div>
        </div>
    </form>
  )
}