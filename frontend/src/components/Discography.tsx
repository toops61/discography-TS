import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { discFields, queryGetFields, searchFieldsInterface } from '../utils/interfaces';
import { getDatabaseDiscs } from '../utils/fetchFunctions';
import { sortDiscs, transformToLowerString } from '../utils/utilsFuncs';
import Discs from './Discs';
import DiscographyFooter from './DiscographyFooter';
import DiscoFilterForm from './DiscoFilterForm';
import FullScreenDisc from './FullScreenDisc';

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

    const queryclient = useQueryClient();

    const getStoredDiscs = () => {
        const discStorage = sessionStorage.discStorage ? JSON.parse(sessionStorage.getItem('discStorage') || '') : [];
        const discsCache = queryclient.getQueryData<queryGetFields>('discs');
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

    const idShownFunc = (index:number) => {
        setIdShown(index);
    }

    const changeFilterCategory = (category:string) => {
        const object = filterObject.sort_category === category ? {...filterObject,sort_up: !filterObject.sort_up} : {...filterObject,sort_up: true,sort_category:category};
        setFilterObject({...object});
    }

    const changeFilterObject : ((obj:searchFieldsInterface) => void) = obj => setFilterObject(obj);

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

    const changePageSelected : ((page:number) => void) = page => setPageSelected(page);

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
      bodyScrollTop();
    }, [pageSelected])
    
    useEffect(() => {
      getStoredDiscs();
    }, [])
  
    const ThComp = ({category,children}:{category:string,children:string}) => {
        return (
            <th onClick={() => changeFilterCategory(category)} className={category+"-column"} tabIndex={0}>
                <h3 tabIndex={0}>{children}</h3>
                {filterObject.sort_category === category ? <div className={filterObject.sort_up ? "selected up" : "selected down"} tabIndex={0}></div> : <></>}
            </th>
        )
    };
  
    return (
    <main className="disco-main">
        {idShown >= 0 ? <FullScreenDisc
            idShown={idShown}
            idShownFunc={idShownFunc}
            pagesDisplayed={pagesDisplayed}
            pageSelected={pageSelected}
        /> : <></>}
        <Link className="back" to="/"></Link>
        <Link to={connected ? "/NewDisc" : "/Connect"} className="new-disc">New disc</Link>
        <DiscoFilterForm 
            filterObject={filterObject}
            changeFilterObject={changeFilterObject}
            total={displayedDiscs.length}
        />
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
                    <ThComp category={'artist'}>Artiste</ThComp>
                    <ThComp category={'album'}>Album</ThComp>
                    <ThComp category={'year'}>Année</ThComp>
                    <ThComp category={'genre'}>Genre</ThComp>
                    <ThComp category={'format'}>Format</ThComp>
                </tr>
            </thead>
            <tbody ref={tbodyRef}>
                {pagesDisplayed.length ? pagesDisplayed[pageSelected-1].map((disc,index) => <Discs
                  key={uuidv4()} 
                  disc={disc} 
                  index={index} 
                  filterObject={filterObject} 
                  idShownFunc={idShownFunc} 
                />) : <></>}
            </tbody>
        </table>
        <DiscographyFooter
            pagesDisplayed={pagesDisplayed}
            pageSelected={pageSelected}
            displayedDiscs={displayedDiscs}
            changePageSelected={changePageSelected}
            bodyScrollTop={bodyScrollTop}
        />
    </main>
  )
}
