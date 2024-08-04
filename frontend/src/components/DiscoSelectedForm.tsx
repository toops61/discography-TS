import { ChangeEvent } from "react";
import { filterFormProps } from "../utils/interfaces";
import { useAppSelector } from "../redux/hooks";

export default function DiscoSelectedForm({filterObject,changeFilterObject}:filterFormProps) {
    const { allFormats,allStyles } = useAppSelector(state => state.formsArraysSlice);

    const handleChange : ((e:ChangeEvent) => void) = e => {
        const tempFilterObject = {...filterObject};
        const filter_selected = tempFilterObject.filter_selected;
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
        changeFilterObject({...tempFilterObject});
    }
    
  return (
    <form className="filter-nav">
        {filterObject.filter_category !== 'format' && allFormats.length ? <div className="filter-field" tabIndex={0}>
            <label htmlFor="format">format</label>
            <select name="format" id="format" onChange={handleChange} >
                <option value=''></option>
                {allFormats.map((format,ind) => <option value={format} key={format+ind}>{format}</option>)}   
            </select>
        </div> : <></>}
        {filterObject.filter_category !== 'genre' && allStyles.length ? <div className="filter-field" tabIndex={0}>
            <label htmlFor="genre">genre</label>
            <select name="genre" id="genre" onChange={handleChange} >
                <option value=''></option>
                {allStyles.map((style,ind) => <option value={style} key={style+ind}>{style}</option>)}   
            </select>
        </div> : <></>}
    </form>
  )
}