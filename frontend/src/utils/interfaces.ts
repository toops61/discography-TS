export interface wishDiscFields {
    [key:string]:string|boolean|number|undefined;
    artist:string;
    album:string;
    genre:string;
    cover:string;
    _id?:string;
}
export interface discFields extends wishDiscFields {
    year:number;
    format:string;
    digipack:boolean;
}

export interface queryGetFields {
    data:wishDiscFields[];
    message:string;
    token?:string;
}
export interface queryResultFields {
    data:wishDiscFields|string;
    message:string;
    token?:string;
}

export interface objectResultFields {
    data:discFields;
    message:string;
}

export interface discogsQuery {
    artists:{name:string}[];
    formats:{name:string}[];
    title:string;
    year:number;
}

export interface searchFieldsInterface {
    [key:string]:string|boolean;

    sort_up: boolean;
    sort_category: string;
    filter: string;
    filter_category: string;
}

export interface userFields {
    [key:string]:string;
}
export interface connectedFields {
    id: string;
    email: string;
    token: string;
}
export interface alertProps {
    showAlert:(message:string,type:string) => void;
}

export interface footerProps {
    pagesDisplayed:discFields[][];
    pageSelected:number;
    displayedDiscs:discFields[];
    changePageSelected:(page:number) => void;
    bodyScrollTop:()=>void;
}
export interface filterFormProps {
    filterObject:searchFieldsInterface;
    changeFilterObject:(obj:searchFieldsInterface)=>void;
    total:number
}
export interface discShownProps {
    disc:wishDiscFields;
    updateShown:(id:string) => void;
    showAlert:(message:string,type:string) => void;
}

export interface fullScreenProps {
    idShown:number;
    idShownFunc:(id:number)=>void;
    pagesDisplayed:discFields[][];
    pageSelected:number;
}