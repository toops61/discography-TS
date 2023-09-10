import { alertProps, connectedFields, discFields, discogsQuery, wishDiscFields } from "../utils/interfaces";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { updateGeneralParams } from "../redux/generalParamsSlice";
import { useAppDispatch } from "../redux/hooks";
import { fetchDisc } from "../utils/fetchFunctions";
import { musicBrainzSearch, updateDiscs } from "../utils/utilsFuncs";
import { NewClassDisc } from "../utils/classes";

export default function NewDisc(props:alertProps) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const initDisc = new NewClassDisc('','',1970,'Folk Rock','cd','',false);

    const [newDisc, setNewDisc] = useState(initDisc);

    const [idDiscogs, setIdDiscogs] = useState('');

    const discogRef = useRef<HTMLInputElement>(null);

    const queryclient = useQueryClient();
    const user = queryclient.getQueryData<connectedFields>('user');
    const previousArray = queryclient.getQueryData<discFields[]>('discs');
    const previousWanted = queryclient.getQueryData<wishDiscFields[]>('wantlist');

    const handleChange = (e:ChangeEvent) => {
        const tempObject = {...newDisc};
        const target = e.target as HTMLInputElement;
        tempObject[target.name] = target.name !== 'digipack' ? target.value : target.checked;
        tempObject['format'] === 'vinyl' && (tempObject['digipack'] = false);
        setNewDisc(tempObject);
    }    

    //fetch call to discogs API
    const getDiscogs = async () => {
        try {
            const response = await fetch(
                `https://api.discogs.com/releases/${idDiscogs}`
            );
            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }
            const json = await response.json();
            fillFields(json);
            setIdDiscogs('');
        } catch (error) {
            console.error(error);
            props.showAlert('Appel discogs échoué','error');
        }
    }

    //query discogs
    const { isLoading,refetch } = useQuery(
        ['discogs'],
        getDiscogs,
        {enabled: false}
    )

    const discogValid = () => {
        let id : string = discogRef.current?.value ? discogRef.current.value : '';
        id.includes('[r') && (id = id.split('[r')[1].split(']')[0]);
        setIdDiscogs(id);
    }

    const fillFields = async (json:discogsQuery) => {
        let name = json.artists[0].name;
        name.includes(' (') && (name = name.split(' (')[0]);
        let format = json.formats[0].name.toLowerCase();
        (format !== 'cd' && format !== 'vinyl') && (format = 'cd');
        const newObject = new NewClassDisc(name,json.title,1970,'Folk Rock',format,'',false);      
        const year = await musicBrainzSearch(newObject);
        newObject.year = (year && year > 1900 && year < 3000) ? year : json.year;
        setNewDisc({...newObject});
    }
    
    const { mutate:updateDiscMutation,isLoading:discLoading } = useMutation(
        () => {
            const updateDisc = previousArray ? previousArray.find(e => e._id === newDisc._id && e.format === newDisc.format) : null;
            const token = user?.token ? user.token : '';
            return fetchDisc(updateDisc ? 'updateDisc' : 'newDisc',token,newDisc);
        }, 
        {
            onSuccess: data => {
                const previous = previousArray ? previousArray : [];
                data.data && queryclient.setQueryData('discs',() => updateDiscs(data,previous,''));
                props.showAlert(data.message,data.data ? 'valid' : 'error');
                setNewDisc({...data.data});
            }
        }
    );

    const { mutate:deleteDiscMutation,isLoading:deleteLoading } = useMutation(
        () => {
            const token = user?.token ? user.token : '';
            return fetchDisc('deleteDisc',token,newDisc);
        }, 
        {
            onSuccess: data => {
                const previous = previousArray ? previousArray : [];
                data.data === newDisc._id && queryclient.setQueryData('discs',() => updateDiscs(data,previous,'delete'));
                props.showAlert(data.message,data.data === newDisc._id ? 'valid' : 'error');
                data.data && setTimeout(() => {
                    navigate("/Discography");
                }, 1500);
            }
        }
    );

    const { mutate:updateWantedMutation,isLoading:wantedLoading } = useMutation(
        () => {
            const updateDisc = previousWanted?.find(e => e._id === newDisc._id);
            const token = user?.token ? user.token : '';
            return fetchDisc(updateDisc ? 'updateWish' : 'newWish',token,newDisc);
        }, 
        {
            onSuccess: data => {
                const previous = previousWanted ? previousWanted : [];
                data.data && queryclient.setQueryData('wantlist',() => updateDiscs(data,previous,''));
                props.showAlert(data.message,data.data ? 'valid' : 'error');
                data.data && setTimeout(() => {
                    navigate("/Wantlist");
                }, 1500);
            }
        }
    );

    const submitDelete = (e:FormEvent) => {
        e.preventDefault();
        if (newDisc.artist && newDisc.album && window.confirm('Effacer le disque ?')) deleteDiscMutation();
    }

    const submitWanted = (e:FormEvent) => {
        e.preventDefault();
        (newDisc.artist && newDisc.album) ? updateWantedMutation() : props.showAlert('Remplir les champs','error');
    }

    const handleSubmit = (e:FormEvent) => {
        e.preventDefault();
        (newDisc.artist && newDisc.album) ? updateDiscMutation() : props.showAlert('Remplir les champs','error');
    }

    useEffect(() => {
        const modified : discFields = sessionStorage.modifiedDisc ? JSON.parse(sessionStorage.getItem('modifiedDisc') || '') : null;
        if (modified) {
            const tempObject = new NewClassDisc('','',1970,'','','',false);
            const keysArray:string[] = Object.keys(modified);
            keysArray.map(key => tempObject[key] = modified[key]);
            setNewDisc({...tempObject});
        }
        delete sessionStorage.modifiedDisc;
    }, []);

    useEffect(() => {
        dispatch(updateGeneralParams({isLoading: (isLoading || discLoading || deleteLoading || wantedLoading) ? true : false}));
    }, [isLoading,discLoading,deleteLoading,wantedLoading]);

    useEffect(() => {
        idDiscogs && refetch();
    }, [idDiscogs]);
    

  return (
    <section className='form-page'>
        <Link className="back" to="/"></Link>
        <nav className="nav-pages">
            <Link className="discs" to="/Wantlist">Wantlist</Link>
            <Link className="discs" to="/Discography">Discography</Link>
        </nav>
        <h1>Nouvel album</h1>
        <form>
            <div className='disc-inputs' tabIndex={0}>
                <label htmlFor='artist'>Artiste</label>
                <input type='text' name='artist' max='50' value={newDisc.artist} onChange={handleChange} required />
            </div>
            <div className='disc-inputs' tabIndex={0}>
                <label htmlFor='album'>Album</label>
                <input type='text' name='album' max='50' value={newDisc.album} onChange={handleChange} required />
            </div>
            {!newDisc.wanted ? <div className='disc-inputs' tabIndex={0}>
                <label htmlFor='year'>Année</label>
                <input type='number' name='year' min='1900' max='2024' maxLength={4} value={newDisc.year} onChange={handleChange} />
            </div> : <></>}
            <div className='disc-inputs' tabIndex={0}>
                <label htmlFor='genre'>Genre</label>
                <select name="genre" id="genre" onChange={handleChange} value={newDisc.genre} >
                    <option value="Folk Rock">Folk Rock</option>
                    <option value="Metal">Metal</option>
                    <option value="Punk">Punk</option>
                    <option value="Electro">Electro</option>
                    <option value="Jazz">Jazz</option>
                    <option value="Blues">Blues</option>
                    <option value="Soul">Soul</option>
                    <option value="Groove">Groove</option>
                    <option value="B.O.">B.O.</option>
                    <option value="Rap">Rap</option>
                    <option value="Pop">Pop</option>
                    <option value="Reggae">Reggae</option>
                    <option value="Francophone">Francophone</option>
                    <option value="R'n'B">R'n'B</option>
                    <option value="Traditionnel">Traditionnel</option>
                    <option value="Classique">Classique</option>
                </select>
            </div>
            {!newDisc.wanted ? <div className='disc-inputs' tabIndex={0}>
                <label htmlFor='format'>Format</label>
                <select name="format" id="format" onChange={handleChange} value={newDisc.format} >
                    <option value="cd">Cd</option>
                    <option value="vinyl">Vinyl</option>
                    <option value="DVD">DVD</option>
                    <option value="VHS">VHS</option>
                </select>
            </div> : <></>}
            <div className='disc-inputs' tabIndex={0}>
                <label htmlFor='cover'>Cover</label>
                <input type='text' name='cover' max='100' value={newDisc.cover} onChange={handleChange} required />
            </div>
            {newDisc.format === 'cd' ? <div className='disc-inputs checkbox' tabIndex={0}>
                <label htmlFor='digipack'>digipack</label>
                <input type='checkbox' name='digipack' checked={newDisc.digipack} onChange={handleChange} />
            </div> : null}
            {!newDisc.wanted ? <div className='disc-inputs discog' tabIndex={0}>
                <label htmlFor='discog'>Discog id</label>
                <input type='text' name='discog' id='discog' max='20'ref={discogRef} />
                <div className="valid-arrow" onClick={discogValid}></div>
            </div> : <></>}
            <div className="buttons-container">
                {!newDisc.wanted ? <>
                    <button onClick={handleSubmit}>{newDisc._id ? 'Modifier' : 'Enregistrer'}</button>
                    <button onClick={submitDelete}>Effacer</button>
                    <button onClick={submitWanted}>Créer wanted</button>
                </> : <button onClick={submitWanted}>Modifier</button>}
            </div>
        </form>
    </section>
  )
}