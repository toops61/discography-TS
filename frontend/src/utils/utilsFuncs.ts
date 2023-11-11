import { NewClassDisc } from "./classes";
import { discFields, searchFieldsInterface, wishDiscFields } from "./interfaces";

const bodyDom = document.querySelector('body') as HTMLBodyElement;

export const changeBodySize = () => {
    window.innerWidth < 900 ? bodyDom.style.height = window.innerHeight + 'px' : bodyDom.style.height = '';
}

export const stringReplaceall = (text:string) => {
    let newText = text.replace(/ /gi,'%20');
    newText = text.replace(/'/gi,'%27');
    newText = text.replace(/&/gi,'%26');
    return newText;
}

//find record year
export const musicBrainzSearch = async (artistObject:wishDiscFields) => {
    const artist = stringReplaceall(artistObject.artist);
    const album = stringReplaceall(artistObject.album);
    try {
    const response = await fetch(
        `https://musicbrainz.org/ws/2/release?query=%22${album}%22%20AND%20%22${artist}%22&limit=30&fmt=json`
    );
    if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
    }
    const json = await response.json();
    const year = getDateFromQuery(json);
    return year;
    } catch (error) {
    console.error(error);
    }
}

const getDateFromQuery = (json:{releases:{date:string}[]}) => {
    try {
        const resultArray = json.releases;
        
        const datesArray : number[] = [];
        //get all releases years
        resultArray.map(release => {
            const firstRelease = release['date'] ? new Date(release['date']).getFullYear() : '';
            firstRelease && datesArray.push(firstRelease);
        });
        return datesArray.length ? Math.min(...datesArray) : 0;
    } catch {
        return 0;
    }
}

export const updateDiscs = (newData:discFields|wishDiscFields|string,array:wishDiscFields[]|discFields[],deleteDisc:string) => {
    const wanted = ('format' in array[0]) ? false : true;

    const previousArray = [...array];
    const newDiscModified = (typeof newData !== 'string') ? newData : new NewClassDisc('','',1970,'Folk Rock','cd','',false);

    const oldDiscIndex = previousArray.findIndex(disc => deleteDisc ? (disc._id === newData) : (disc._id === newDiscModified._id && disc.format === newDiscModified.format));

    oldDiscIndex === -1 ? previousArray.push(newDiscModified) : (deleteDisc ? previousArray.splice(oldDiscIndex,1) : previousArray.splice(oldDiscIndex,1,newDiscModified));

    sessionStorage.setItem((wanted ? 'wantedStorage' : 'discStorage'),JSON.stringify(previousArray));
    return previousArray;
}

export const sortDiscs = (array:discFields[],filterObject:searchFieldsInterface) => {
    const sortedArray = [...array];
    switch (filterObject.sort_category) {
        case 'artist':
            sortedArray.sort((a,b) => {
                const categoryA = a.artist.toUpperCase();
                const categoryB = b.artist.toUpperCase();
                if (categoryA < categoryB) {
                    return -1;
                } else if (categoryA === categoryB) {
                    return a.year < b.year ? -1 : 1;
                } else {
                    return 1;
                }
            });
            break;
        case 'album':
            sortedArray.sort((a,b) => {
                const categoryA = a.album.toUpperCase();
                const categoryB = b.album.toUpperCase();
                if (categoryA < categoryB) {
                    return -1;
                } else {
                    return 1;
                }
            });
            break;
        case 'year':
            sortedArray.sort((a,b) => {
                const categoryA = a.year;
                const categoryB = b.year;
                if (categoryA < categoryB) {
                    return -1;
                } else {
                    return 1;
                }
            });
            break;
        case 'genre':
            sortedArray.sort((a,b) => {
                const categoryA = a.genre;
                const categoryB = b.genre;
                if (categoryA < categoryB) {
                    return -1;
                } else if (categoryA === categoryB) {
                    const artistA = a.artist.toUpperCase();
                    const artistB = b.artist.toUpperCase();
                    return artistA < artistB ? -1 : 1;
                } else {
                    return 1;
                }
            });
            break;
        case 'format':
            sortedArray.sort((a,b) => {
                const categoryA = a.format;
                const categoryB = b.format;
                if (categoryA < categoryB && filterObject.sort_up) {
                    return -1;
                } else if (categoryA === categoryB) {
                    const artistA = a.artist.toUpperCase();
                    const artistB = b.artist.toUpperCase();
                    return artistA < artistB ? -1 : 1;
                } else {
                    return 1;
                }
            });
            break;
        default:
            break;
    }
    return sortedArray;
}

export const transformString : ((value:string|number|boolean|undefined) => string) = text => {
    let newString = text ? text.toString() : '';
    newString = newString.toLowerCase();
    newString = newString.replace(/[éèêë]/ig,'e');
    newString = newString.replace(/[âáàåäã]/ig,'a');
    newString = newString.replace(/[îìïí]/ig,'i');
    newString = newString.replace(/[ôóòõøö]/ig,'o');
    newString = newString.replace(/[-]/ig,' ');
    return newString;
}