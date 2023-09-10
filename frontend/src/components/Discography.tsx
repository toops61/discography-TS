import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { discFields, queryGetFields, searchFieldsInterface } from '../utils/interfaces';
import { getDatabaseDiscs } from '../utils/fetchFunctions';
import { sortDiscs, transformString } from '../utils/utilsFuncs';
import Discs from './Discs';
import DiscographyFooter from './DiscographyFooter';
import DiscoFilterForm from './DiscoFilterForm';
import FullScreenDisc from './FullScreenDisc';
import { updateDisplayed } from '../redux/displayedSlice';

export default function Discography() {
    const connected = useAppSelector(state => state.generalParamsSlice.connected);
    const fullScreen = useAppSelector(state => state.fullScreenSlice.fullScreen);
    const displayedParams = useAppSelector(state => state.displayedSlice);

    const dispatch = useAppDispatch();

    const [discsArray, setDiscsArray] = useState<discFields[]>([]);

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

    const tableRef = useRef<HTMLTableSectionElement>(null);

    const tableScrollTop = () => {
        const current = tableRef.current ? tableRef.current : null;
        const scrollProperty = current ? current.scrollTop : null;
        scrollProperty && (current?.scrollTo({
            top:0,
            left:0,
            behavior:'smooth'
        }));
    }

    const filterDiscs = (array:discFields[]) => {
        const tempArray = array.map(disc => {return{...disc}});
        
        const filteredArray = tempArray.filter(disc => {
            const searched = transformString(disc[filterObject.filter_category]);
            let entered = filterObject.filter;
            entered = transformString(entered);
            return searched.includes(entered);
        });
        return filteredArray;
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
        displayedParams.displayedDiscs.map((disc,index) => {
            index === pageIndex*displayedParams.maxPerPage && pageIndex++;
            tempArray[pageIndex-1].push(disc);
        })
        dispatch(updateDisplayed({pagesDisplayed:[...tempArray]}));
    }

    //const changePageSelected : ((page:number) => void) = page => setPageSelected(page);

    useEffect(() => {
        if (discsArray.length) {
            //filter discs
            const tempArray = filterObject.filter ? filterDiscs(discsArray) : [...discsArray];
            //then sort
            const sortedArray = sortDiscs(tempArray,filterObject);
            const displayed = filterObject.sort_up ? sortedArray : sortedArray.reverse();
            dispatch(updateDisplayed({displayedDiscs:displayed}));
            delete sessionStorage.searchFields;
        }
    }, [filterObject,discsArray])

    useEffect(() => {
        dispatch(updateDisplayed({pageSelected:1}));
        const totalPages = Math.ceil(displayedParams.displayedDiscs.length / displayedParams.maxPerPage);
        fillPagesArrays(totalPages);
    }, [displayedParams.displayedDiscs,displayedParams.maxPerPage])
    
    useEffect(() => {
      tableScrollTop();
    }, [displayedParams.pageSelected])
    
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
        {fullScreen ? <FullScreenDisc /> : <></>}
        <Link className="back" to="/"></Link>
        <Link to={connected ? "/NewDisc" : "/Connect"} className="new-disc">New disc</Link>
        <DiscoFilterForm 
            filterObject={filterObject}
            changeFilterObject={changeFilterObject}
        />
        <section className="title-container">
            <h1 tabIndex={0}>Discography</h1>
            <div className="max" tabIndex={0}>
                <label htmlFor='filter_max'>Max affichés : </label>
                <select name="filter_max" id="filter-max" onChange={e => dispatch(updateDisplayed({maxPerPage:parseInt(e.target.value)}))} >
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
            <tbody ref={tableRef}>
                {displayedParams.pagesDisplayed.length ? displayedParams.pagesDisplayed[displayedParams.pageSelected-1].map((disc,index) => <Discs
                  key={disc._id} 
                  disc={disc} 
                  index={index} 
                  filterObject={filterObject}
                />) : <></>}
            </tbody>
        </table>
        <DiscographyFooter
            tableScrollTop={tableScrollTop}
        />
    </main>
  )
}
