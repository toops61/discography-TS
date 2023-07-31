import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { discFields, queryResultFields, searchFieldsInterface } from '../utils/interfaces';
import { getDatabaseDiscs } from '../utils/fetchFunctions';
import { sortDiscs, transformToLowerString } from '../utils/utilsFuncs';

export default function Discography() {
    const connected = useAppSelector((state:RootState) => state.generalParamsSlice.connected);
    const [discsArray, setDiscsArray] = useState<discFields[]>([]);
    //total discs displayed depending on filter and DB
    const [displayedDiscs, setDisplayedDiscs] = useState<discFields[]>([]);
    const [filterObject, setFilterObject] = useState<searchFieldsInterface>(
        sessionStorage.searchFields ? 
        JSON.parse(sessionStorage.getItem('searchFields') || '') : 
        {
            sort_up: true,
            sort_category: 'artist',
            filter: '',
            filter_category: 'artist'
        }
    );
    const [idShown, setIdShown] = useState<number>(-1);
    const [maxPerPage, setMaxPerPage] = useState<number>(50);
    const [pagesDisplayed, setPagesDisplayed] = useState<discFields[][]>([]);
    const [pageSelected, setPageSelected] = useState<number>(1);
    const [pageIdVisible, setPageIdVisible] = useState<number[]>([]);

    const [coverFlip, setCoverFlip] = useState<boolean>(false);

    const queryclient = useQueryClient();

    const getStoredDiscs = () => {
        const discStorage = sessionStorage.discStorage ? JSON.parse(sessionStorage.getItem('discStorage') || '') : [];
        const discsCache = queryclient.getQueryData<queryResultFields>('discs');
        const newArray : discFields[] = discsCache?.data ? discsCache.data : discStorage;
        setDiscsArray(newArray);
        !discsCache && queryclient.fetchQuery(
            ['discs'],
            () => getDatabaseDiscs('discs'),
            {
                cacheTime: 7200000,
                staleTime: 7200000
            }
        );
    }

    const tbodyRef = useRef<HTMLTableSectionElement>(null);

    const bodyScrollTop = () => {
        const current = tbodyRef.current ? tbodyRef.current : null;
        let scrollProperty = current ? current.scrollTop : null;
        scrollProperty && (scrollProperty = 0);
    }

    const filterDiscs = (array:discFields[]) => {
        const tempArray = array.map(disc => {return{...disc}});
        const filteredArray = tempArray.filter(disc => {
            const searched = transformToLowerString(disc[filterObject.filter_category]);

            let entered = filterObject.filter;
            entered = entered.toLowerCase();

            return searched.includes(entered);
        });
        return filteredArray;
    }

    const handleChange : ((e:ChangeEvent) => void) = e => {
        const tempObject = {...filterObject};
        const target = e.target as HTMLInputElement;
        tempObject[target.name] = target.value;
        setFilterObject({...tempObject});
    }

    

    const changeFilterCategory = (category:string) => {
        const object = filterObject.sort_category === category ? {...filterObject,sort_up: !filterObject.sort_up} : {...filterObject,sort_up: true,sort_category:category};
        setFilterObject({...object});
    }

    const fillPagesArrays : ((total:number) => void) = total => {
        const tempArray : discFields[][] = [];
        let pageIndex = 1;
        for (let ind = 0; ind < total; ind++) {
            tempArray.push([]);
        }
        displayedDiscs.map((disc,index) => {
            index === pageIndex*maxPerPage && pageIndex++;
            tempArray[pageIndex-1].push(disc);
        })
        setPagesDisplayed([...tempArray]);
    }

    const fillPagesVisibles = () => {
        let array : number[] = [];
        if (pagesDisplayed.length > 5) {
            array = [1,2];
            array.push(pagesDisplayed.length-1);
            array.push(pagesDisplayed.length);
            !array.includes(pageSelected) && array.push(pageSelected);
            if (pageSelected > 3 && !array.includes(pageSelected - 1)) array.push(pageSelected - 1);
            if (pageSelected > 4 && !array.includes(pageSelected - 2)) array.push(pageSelected - 2);
            if (pageSelected < (pagesDisplayed.length-2) && !array.includes(pageSelected + 1)) array.push(pageSelected + 1);
            if (pageSelected < (pagesDisplayed.length-3) && !array.includes(pageSelected + 2)) array.push(pageSelected + 2);
        } else {
            pagesDisplayed.map((page,index) => {array.push(index+1)});
        }
        array.sort((a,b) => a - b);
        setPageIdVisible([...array]);
    }

    useEffect(() => {
        if (discsArray.length) {
            //filter discs
            const tempArray = filterObject.filter ? filterDiscs(discsArray) : [...discsArray];
            //then sort
            const sortedArray = sortDiscs(tempArray,filterObject);
            const displayed = filterObject.sort_up ? sortedArray : sortedArray.reverse();
            setDisplayedDiscs(displayed);
            delete sessionStorage.searchFields;
        }
    }, [filterObject,discsArray])

    useEffect(() => {
        setPageSelected(1);
      const totalPages = Math.ceil(displayedDiscs.length / maxPerPage);
      fillPagesArrays(totalPages);
    }, [displayedDiscs,maxPerPage])

    useEffect(() => {
      if (displayedDiscs.length) {
        fillPagesVisibles();
      }
    }, [pagesDisplayed,pageSelected])
    
    
    useEffect(() => {
      bodyScrollTop();
    }, [pageSelected])
    
    useEffect(() => {
      getStoredDiscs();
    }, [])
    

    const Discs = pagesDisplayed.length ? pagesDisplayed[pageSelected-1].map((disc,index) => {
        return (
            <tr className={index%2 === 0 ? "light-row" : ''} key={uuidv4()}>
                <td className="disc-actions">
                    <div className="show-disc" onClick={() => setIdShown(index)} tabIndex={0}>
                        <p className="label">Details</p>
                    </div>
                    {connected ? <Link to="/NewDisc" className="modify-disc" onClick={() => {
                        sessionStorage.setItem('modifiedDisc',JSON.stringify(disc));
                        sessionStorage.setItem('searchFields',JSON.stringify(filterObject));
                    }
                    }>
                        <p className="label">Modifier</p>
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
    }) : null;
  return (
    <main className="disco-main">
        {idShown >= 0 ? <div className="disc-full">
            <div className="close-disc" onClick={() => setIdShown(-1)}>X</div>
            <div className={idShown > 0 ? "cover-previous" : "cover-previous unclick"} onClick={() => idShown > 0 && setIdShown(idShown-1)}></div>
            <div className={`cover${coverFlip && ' flip'}`} onClick={() => setCoverFlip(!coverFlip)}>
                <div className="cover-front">
                    <img src={pagesDisplayed[pageSelected-1][idShown].cover} alt="cover" />
                </div>
                <div className="cover-back">
                    <p>{pagesDisplayed[pageSelected-1][idShown].artist}</p>
                    <p>{pagesDisplayed[pageSelected-1][idShown].album}</p>
                    <p>{pagesDisplayed[pageSelected-1][idShown].year}</p>
                    <p>{pagesDisplayed[pageSelected-1][idShown].genre}</p>
                    <p>{pagesDisplayed[pageSelected-1][idShown].format}</p>
                </div>
            </div>
            <div className={idShown < (pagesDisplayed[pageSelected-1].length-1) ? "cover-next" : "cover-next unclick"} onClick={() => idShown < (pagesDisplayed[pageSelected-1].length-1) && setIdShown(idShown+1)}></div>
        </div> : null}
        <Link className="back" to="/"></Link>
        <Link to={connected ? "/NewDisc" : "/Connect"} className="new-disc">New disc</Link>
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
                <label htmlFor="filter">Filtre</label>
                <input type="text" name="filter" max="50" onChange={handleChange} value={filterObject.filter} required />
            </div>
            <h2 tabIndex={0}>total : {displayedDiscs.length}</h2>
        </form>
        <section className="title-container">
            <h1 tabIndex={0}>Discography</h1>
            <div className="max" tabIndex={0}>
                <label htmlFor='filter_max'>Max affichés : </label>
                <select name="filter_max" id="filter-max" onChange={e => setMaxPerPage(parseInt(e.target.value))} >
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="200">200</option>
                </select>
            </div>
        </section>
        <table className="discs-container">
            <thead>
                <tr>
                    <th onClick={() => changeFilterCategory('artist')} className="artist-column" tabIndex={0}>
                        <h3 tabIndex={0}>Artiste</h3>
                        {filterObject.sort_category === 'artist' ? <div className={filterObject.sort_up ? "selected up" : "selected down"} tabIndex={0}></div> : null}
                    </th>
                    <th onClick={() => changeFilterCategory('album')} className="album-column" tabIndex={0}>
                        <h3 tabIndex={0}>Album</h3>
                        {filterObject.sort_category === 'album' ? <div className={filterObject.sort_up ? "selected up" : "selected down"} tabIndex={0}></div> : null}
                    </th>
                    <th onClick={() => changeFilterCategory('year')} className="year-column" tabIndex={0}>
                        <h3 tabIndex={0}>Année</h3>
                        {filterObject.sort_category === 'year' ? <div className={filterObject.sort_up ? "selected up" : "selected down"} tabIndex={0}></div> : null}
                    </th>
                    <th onClick={() => changeFilterCategory('genre')} className="genre-column" tabIndex={0}>
                        <h3 tabIndex={0}>Genre</h3>
                        {filterObject.sort_category === 'genre' ? <div className={filterObject.sort_up ? "selected up" : "selected down"} tabIndex={0}></div> : null}
                    </th>
                    <th onClick={() => changeFilterCategory('format')} className="format-column" tabIndex={0}>
                        <h3 tabIndex={0}>Format</h3>
                        {filterObject.sort_category === 'format' ? <div className={filterObject.sort_up ? "selected up" : "selected down"} tabIndex={0}></div> : null}
                    </th>
                </tr>
            </thead>
            <tbody ref={tbodyRef}>
                {Discs}
            </tbody>
        </table>
        <div className="footer-marge">
            <p className="legend" tabIndex={0}>* digipack</p>
            {pagesDisplayed.length > 1 ? <div className="page-displayed">
                <form>
                    <label htmlFor="select-page">page</label>
                    <select name="select-page" id="select-page" onChange={e => setPageSelected(parseInt(e.target.value))} value={pageSelected}>
                        {pagesDisplayed.map((page,index) => {
                            return (
                                <option value={index+1} key={uuidv4()}>{index+1}</option>
                            )
                        })}
                    </select>
                </form>
                <h3>pages : </h3>
                <p onClick={() => pageSelected > 1 && setPageSelected(pageSelected-1)} tabIndex={0}>précédent</p>
                <div className="pages-container">
                    {pagesDisplayed.map((_page,index) => {
                        let classP = pageIdVisible.includes(index+1) ? "" : "hide";
                        pageSelected === index + 1 && (classP = "page-selected");
                        return (
                            (pagesDisplayed.length > 5 && !pageIdVisible.includes(3) && index + 1 === 3) || (pagesDisplayed.length > 5 && !pageIdVisible.includes(pagesDisplayed.length - 2) && index + 1 === pagesDisplayed.length - 2) ? <p className="dots" key={uuidv4()} tabIndex={0}>...</p> :
                             <p className={classP} key={uuidv4()} onClick={() => setPageSelected(index + 1)} tabIndex={0}>{index+1}</p>
                        )
                    })}
                </div>
                <p onClick={() => pageSelected < pagesDisplayed.length && setPageSelected(pageSelected+1)} tabIndex={0}>suivant</p>
            </div> : null}
            <div className="arrow-up" tabIndex={0} onClick={bodyScrollTop}></div>
        </div>
    </main>
  )
}
