import { useState } from "react";
import { fullScreenProps } from "../utils/interfaces";

export default function FullScreenDisc({idShown,idShownFunc,pagesDisplayed,pageSelected}:fullScreenProps) {
    const [coverFlip, setCoverFlip] = useState<boolean>(false);

  return (
    <div className="disc-full">
        <div className="close-disc" onClick={() => idShownFunc(-1)}>X</div>
        <div className={idShown > 0 ? "cover-previous" : "cover-previous unclick"} onClick={() => idShown > 0 && idShownFunc(idShown-1)}></div>
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
        <div className={idShown < (pagesDisplayed[pageSelected-1].length-1) ? "cover-next" : "cover-next unclick"} onClick={() => idShown < (pagesDisplayed[pageSelected-1].length-1) && idShownFunc(idShown+1)}></div>
    </div>
  )
}