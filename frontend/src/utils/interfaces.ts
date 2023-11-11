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

export interface queryResultType {
    message:string;
    data?:discFields|wishDiscFields|string;
}
/* export interface backendResultDisc {
    message:string;
    data?:discFields;
}
export interface backendResultWanted {
    message:string;
    data?:wishDiscFields;
} */
export interface backendResultUser {
    message:string;
    data?:userFields;
    token?:string;
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
export type alertProps = (message:string,type:string) => void;
export interface filterFormProps {
    filterObject:searchFieldsInterface;
    changeFilterObject:(obj:searchFieldsInterface)=>void;
}
export interface discShownProps {
    disc:wishDiscFields;
    updateShown:(id:string) => void;
    showAlert:(message:string,type:string) => void;
}