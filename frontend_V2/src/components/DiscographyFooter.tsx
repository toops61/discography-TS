import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { updateDisplayed } from "../redux/displayedSlice";
import { nanoid } from "@reduxjs/toolkit";

export default function DiscographyFooter({tableScrollTop}:{tableScrollTop:()=>void}) {
    const [pageIdVisible, setPageIdVisible] = useState<number[]>([]);

    const pageSelected = useAppSelector(state => state.displayedSlice.pageSelected);
    const displayedDiscs = useAppSelector(state => state.displayedSlice.displayedDiscs);
    const pagesDisplayed = useAppSelector(state => state.displayedSlice.pagesDisplayed);

    const dispatch = useAppDispatch();

    const changePageSelected = (page:number) => dispatch(updateDisplayed({pageSelected:page}));

    //set Id visibles in footer
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
            pagesDisplayed.map((_page,index) => {array.push(index+1)});
        }
        array.sort((a,b) => a - b);
        setPageIdVisible([...array]);
    }

    useEffect(() => {
        if (displayedDiscs.length) {
            fillPagesVisibles();
        }
    }, [pagesDisplayed,pageSelected])

    //condition for pages displayed
    const dotsCondition : ((index:number) => boolean) = index => {
        const condition = (pagesDisplayed.length > 5 && !pageIdVisible.includes(3) && index + 1 === 3) || (pagesDisplayed.length > 5 && !pageIdVisible.includes(pagesDisplayed.length - 2) && index + 1 === pagesDisplayed.length - 2) ? true : false;
        return condition;
    }

  return (
    <footer className="footer-marge">
        <p className="legend" tabIndex={0}>* digipack</p>
        {pagesDisplayed.length > 1 ? <div className="page-displayed">
            <form>
                <label htmlFor="select-page">page</label>
                <select name="select-page" id="select-page" onChange={e => changePageSelected(parseInt(e.target.value))} value={pageSelected}>
                    {pagesDisplayed.map((_page,index) => <option value={index+1} key={nanoid()}>{index+1}</option>)}
                </select>
            </form>
            <div className="pages-updown-container">
                <button onClick={() => pageSelected > 1 && changePageSelected(pageSelected-1)} className="pages-updown"></button>
                <div className="pages-container">
                    {pagesDisplayed.map((_page,index) => {
                        let classP = pageIdVisible.includes(index+1) ? "" : "hide";
                        pageSelected === index + 1 && (classP = "page-selected");
                        return (
                            dotsCondition(index) ? <p className="dots" key={nanoid()} tabIndex={0}>...</p> :
                                <p className={classP} key={nanoid()} onClick={() => changePageSelected(index + 1)} tabIndex={0}>{index+1}</p>
                        )
                    })}
                </div>
                <button onClick={() => pageSelected < pagesDisplayed.length && changePageSelected(pageSelected+1)} className="pages-updown up"></button>
            </div>
        </div> : null}
        <div className="arrow-up" tabIndex={0} onClick={tableScrollTop}></div>
    </footer>
  )
}