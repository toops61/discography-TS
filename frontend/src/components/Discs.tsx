import { Link } from "react-router-dom";
import { discFields, searchFieldsInterface } from "../utils/interfaces";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { updateFullscreen } from "../redux/fullScreenSlice";

interface discsProps {
    disc : discFields;
    index : number;
    filterObject:searchFieldsInterface;
}

export default function Discs({disc,index,filterObject}:discsProps) {
    const connected = useAppSelector(state => state.generalParamsSlice.connected);

    const dispatch = useAppDispatch();

    return (
        <tr className={index%2 === 0 ? "light-row" : ''}>
            <td className="disc-actions">
                <div className="show-disc" onClick={() => dispatch(updateFullscreen({idShown:index,fullScreen:true}))} tabIndex={0}>
                    <p className="disc-label">Details</p>
                </div>
                {connected ? <Link to="/NewDisc" className="modify-disc" onClick={() => {
                    sessionStorage.setItem('modifiedDisc',JSON.stringify(disc));
                    sessionStorage.setItem('searchFields',JSON.stringify(filterObject));
                }
                }>
                    <p className="disc-label">Modifier</p>
                </Link> : null}
            </td>
            <td className="artist-column">
                <p tabIndex={0}>{disc.artist}</p>
            </td>
            <td className="album-column">
               <p tabIndex={0}>{disc.album}</p>
            </td>
            <td className="year-column">
                <p tabIndex={0}>{disc.year}</p>
            </td>
            <td className="genre-column">
                <p tabIndex={0}>{disc.genre}</p>
            </td>
            <td className="format-column">
                <p tabIndex={0}>{disc.format}</p>
            </td>
            {disc.digipack ? <td className="collector" tabIndex={0}>*</td> : null}
        </tr>
    )
}