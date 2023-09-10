import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { updateFullscreen } from "../redux/fullScreenSlice";

export default function FullScreenDisc() {
    const [coverFlip, setCoverFlip] = useState(false);
    
    const idShown = useAppSelector(state => state.fullScreenSlice.idShown);
    const pageSelected = useAppSelector(state => state.displayedSlice.pageSelected);
    const pagesDisplayed = useAppSelector(state => state.displayedSlice.pagesDisplayed);

    const dispatch = useAppDispatch();

  return (
    <div className="disc-full">
        <div className="close-disc" onClick={() => dispatch(updateFullscreen({fullScreen:false}))}>X</div>
        <div className={idShown > 0 ? "cover-previous" : "cover-previous unclick"} onClick={() => idShown > 0 && dispatch(updateFullscreen({idShown:idShown-1}))}></div>
        <div className={`cover${coverFlip ? ' flip' : ''}`} onClick={() => setCoverFlip(!coverFlip)}>
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
        <div className={idShown < (pagesDisplayed[pageSelected-1].length-1) ? "cover-next" : "cover-next unclick"} onClick={() => idShown < (pagesDisplayed[pageSelected-1].length-1) && dispatch(updateFullscreen({idShown:idShown+1}))}></div>
    </div>
  )
}