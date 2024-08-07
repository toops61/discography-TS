import { ChangeEvent, useState } from "react";
import { filterFormProps } from "../utils/interfaces";

export default function DiscoFilterForm({filterObject,changeFilterObject}:filterFormProps) {
    const [inputValue, setInputValue] = useState('a');

    const handleChange : ((e:ChangeEvent) => void) = e => {
        const tempObject = {...filterObject};
        const target = e.target as HTMLInputElement;
        const value = target.value;
        setInputValue(value || 'a');
        tempObject[target.name] = value;
        changeFilterObject({...tempObject});
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
                <span>{inputValue}</span>
                <input type="text" name="filter" max="50" onChange={handleChange} value={filterObject.filter} required />
            </div>
        </div>
    </form>
  )
}