import { useMutation, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";
import { fetchDisc } from "../utils/fetchFunctions";
import { updateDiscs } from "../utils/utilsFuncs";
import { discShownProps, queryResultWantedType } from "../utils/interfaces";

export default function DiscShown({disc,updateShown,showAlert}:discShownProps) {

        const connected = useAppSelector((state:RootState) => state.generalParamsSlice.connected);

        const queryclient = useQueryClient();
        const resultWanted = queryclient.getQueryData<queryResultWantedType>('wantlist');
        const previousWanted = resultWanted?.data ?? [];

        const { mutate:deleteWantedMutation } = useMutation(
            () => {
                return fetchDisc('deleteWish',disc);
            }, 
            {
                onSuccess: data => {
                    data.data === disc._id && queryclient.setQueryData('wantlist',() => updateDiscs(data.data,previousWanted,'delete'));
                    updateShown(data.data);
                    showAlert(data.message,data.data === disc._id ? 'valid' : 'error');
                }
            }
        );

        const wantedDelete : ((e:React.MouseEvent<HTMLDivElement>) => void) = e => {
            e.preventDefault();
            if (window.confirm('Effacer le disque ?')) deleteWantedMutation();
        }

        return (
            <div className="disc-container">
                {connected ? <>
                    <Link to="/NewDisc" >
                        <div className="modify-icon" onClick={() => sessionStorage.setItem('modifiedDisc',JSON.stringify({...disc,wanted:true}))}></div>
                    </Link>
                    <div className="delete-icon" onClick={wantedDelete}></div>
                </>  : null}
                <div className="cover-container">
                    <img src={disc.cover} alt={disc.album} />
                </div>
                <p>{disc.artist + ': ' + disc.album}</p>
            </div>
        )
    
}