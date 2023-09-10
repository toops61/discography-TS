import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import discsCase from '../assets/wanted_1.webp';
import discsCase2 from '../assets/wanted_2.webp';
import { useQueryClient } from "react-query";
import { alertProps, queryGetFields, wishDiscFields } from "../utils/interfaces";
import { useAppSelector } from "../redux/hooks";
import DiscShown from "./DiscShown";
import { getDatabaseDiscs } from "../utils/fetchFunctions";

export default function Wantlist(props:alertProps) {
    const connected = useAppSelector(state => state.generalParamsSlice.connected);

    const [wantlistArray, setWantlistArray] = useState<wishDiscFields[]>([]);
    const [stylesArray, setStylesArray] = useState<string []>([]);
    const [categoryShown, setCategoryShown] = useState<wishDiscFields[]>([]);

    const queryclient = useQueryClient();

    const mainRef = useRef<HTMLElement>(null);

    const showCategory = (style:string) => {
        const tempArray = wantlistArray.filter(disc => disc.genre === style);
        tempArray.sort((a,b) => a.artist < b.artist ? -1 : 1);
        setCategoryShown([...tempArray]);
    }

    /* const bodyScrollTop = () => {
        mainRef?.current && console.log(mainRef.current);
        //mainRef.scrollTop = 0;
    } */

    const getStoredWanted = () => {
        const discStorage = sessionStorage.wantedStorage ? JSON.parse(sessionStorage.getItem('wantedStorage') || '') : [];
        /* const discsCache = queryclient.getQueryData('wantlist') ? queryclient.getQueryData('wantlist') : ''; */
        const discsCache = queryclient.getQueryData<queryGetFields>('wantlist');
        const newArray : wishDiscFields[] = discsCache?.data ? discsCache.data : discStorage;
        setWantlistArray(newArray);
        !discsCache && queryclient.fetchQuery(
            ['wantlist'],
            () => getDatabaseDiscs(''),
            {
                cacheTime: 7200000,
                staleTime: 7200000
            }
        );
    }

    useEffect(() => {
      if (wantlistArray.length) {
        const stylesTemp = [...stylesArray];
        wantlistArray.map((wanted:wishDiscFields) => {
            const genre = wanted.genre;
            !stylesTemp.includes(genre) && stylesTemp.push(genre);
        })
        setStylesArray([...stylesTemp]);
      }
    }, [wantlistArray])

    const Categorie = ({style,index}:{style:string;index:number;}) => {
        return (
            <div className="categorie" onClick={() => showCategory(style)}>
                <div className="image-discs">
                    <img src={index%2 === 0 ? discsCase : discsCase2} alt="wishes container" />
                </div>
                <h2>{style}</h2>
            </div>
        )
    }

    //update discs shown when deleted
    const updateShown = (id:string) => {
        const tempArray : wishDiscFields[] = [...categoryShown];
        const indexDeleted = tempArray.findIndex(disc => disc._id === id);
        indexDeleted && tempArray.splice(indexDeleted,1);
        setCategoryShown(tempArray);
    }

    useEffect(() => {   
        getStoredWanted();
    }, [])
    
  return (
    <main className="wantlist-main" ref={mainRef}>
        <Link className="back" to="/"></Link>
        <h1>Wantlist</h1>
        {categoryShown.length ? 
        <section className="shown-discs">
            <button className="close-window" onClick={() => setCategoryShown([])}></button>
            {categoryShown.map(disc => {
            return <DiscShown 
                disc={disc} 
                updateShown={updateShown}
                showAlert={props.showAlert} 
                key={uuidv4()} />
            })}
        </section> : 
        <div className="categories-container">
            {stylesArray.map((style,index) => <Categorie style={style} index={index} key={uuidv4()} />)}
        </div>}
        <section className="links-container">
            <Link to="/Discography" className="disco-link"><p>Discographie</p></Link>
            {connected ? <Link className="add-new" to="/NewDisc"><p>Ajouter disque</p></Link> : <></>}
        </section>
        {/* <div className="arrow-up" tabIndex={0} onClick={bodyScrollTop}></div> */}
    </main>
  )
}
