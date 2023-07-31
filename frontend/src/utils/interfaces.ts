export interface discFields {
    [key:string]:string|boolean|number|undefined;
    artist:string;
    album:string;
    year:number;
    genre:string;
    format:string;
    cover:string;
    digipack:boolean;
    _id?:string;
}

export interface queryResultFields {
    data:[],
    message:string,
    token?:string
}

export interface objectResultFields {
    data:discFields,
    message:string
}

export interface searchFieldsInterface {
    [key:string]:string|boolean;

    sort_up: boolean;
    sort_category: string;
    filter: string;
    filter_category: string;
}
export interface alertProps {
    showAlert:(message:string,type:string) => void;
}