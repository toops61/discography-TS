import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import { updateGeneralParams } from '../redux/generalParamsSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { alertProps, queryGetFields } from '../utils/interfaces';
import { RootState } from '../redux/store';
import { disconnectUser, useGetDiscs, useGetWantlist } from '../utils/fetchFunctions';
import { getAllFormats, getAllStyles } from '../utils/utilsFuncs';
import { updateFormsArrays } from '../redux/formsArraysSlice';

export default function Home({showAlert}:{showAlert:alertProps}) {
    const connected = useAppSelector((state:RootState) => state.generalParamsSlice.connected);

    const dispatch = useAppDispatch();

    const queryclient = useQueryClient();

    const handleData = (result:queryGetFields,querySelected:string) => {
        Array.isArray(result) && sessionStorage.setItem((querySelected === 'discs' ?'discStorage' : 'wantedStorage'),JSON.stringify(result));
        !result?.data.length && showAlert(result.message,'error');
        return result;
    }
    
    const { isLoading:loadingDiscs,data:discs } = useGetDiscs();

    const { isLoading:loadingWanted,data:wantlist } = useGetWantlist();

    const disconnect = async () => {
        const response = await disconnectUser(showAlert);

        if (!response.success) return showAlert('la déconnexion a échoué, réessayez. '+(response.message || ''),'alert');

        showAlert(response.message,'valid');

        delete sessionStorage.userStored;
        dispatch(updateGeneralParams({connected:false}));
        queryclient.removeQueries('user');
    }

    useEffect(() => {
        discs && handleData(discs,'discs');
        console.log('DISCS :',discs);
        
        if (discs) {
            try {
                const allFormats = getAllFormats(discs.data);
                const allStyles = getAllStyles(discs.data);
                dispatch(updateFormsArrays({allFormats,allStyles}));
            } catch (error) {
                console.log(error);
            }
        } 
    }, [discs]);

    useEffect(() => {
        wantlist && handleData(wantlist,'wantlist');
    }, [wantlist]);

    useEffect(() => {
        dispatch(updateGeneralParams({isLoading:loadingDiscs || loadingWanted ? true : false}));
    }, [loadingDiscs,loadingWanted]);    

  return (
    <section className="menu-container">
        <nav>
            <ul>
                <Link to="/Discography">
                    <li>Discs</li>
                </Link>
                <Link to="/Wantlist">
                    <li>Wantlist</li>
                </Link>
                {connected ? <Link to="/NewDisc">
                    <li>New disc</li>
                </Link> : null}
                {!connected ? <Link to="/Connect" className="connect-page">
                    <li>Se connecter</li>
                </Link> : <div className="connect-page" onClick={disconnect}>
                    <p>Se déconnecter</p></div>}
            </ul>
        </nav>
    </section>
  )
}
