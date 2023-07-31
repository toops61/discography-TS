import { discFields, searchFieldsInterface } from "./interfaces";

const bodyDom = document.querySelector('body') as HTMLBodyElement;

export  const changeBodySize = () => {
    window.innerWidth < 900 ? bodyDom.style.height = window.innerHeight + 'px' : bodyDom.style.height = '';
}

//find record year
export const musicBrainzSearch = async artistObject => {
    let artist = artistObject.artist;
    artist.replaceAll(' ','%20');
    artist.replaceAll("'",'%27');
    artist.replaceAll('&','%26');
    let album = artistObject.album;
    album.replaceAll(' ','%20');
    album.replaceAll("'",'%27');
    album.replaceAll('&','%26');
    try {
    const response = await fetch(
        `https://musicbrainz.org/ws/2/release?query=%22${artistObject.album}%22%20AND%20%22${artistObject.artist}%22&limit=30&fmt=json`
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

const getDateFromQuery = json => {
    try {
        const resultArray = json.releases;
        const datesArray = [];
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

export const updateDiscs = (newData,array,deleteDisc) => {
    const previousArray = [...array];
    const newDiscModified = newData.data;
    const oldDiscIndex = previousArray.findIndex(disc => deleteDisc ? (disc._id === newData.data) : (disc._id === newDiscModified._id && disc.format === newDiscModified.format));
    oldDiscIndex === -1 ? previousArray.push(newData.data) : (deleteDisc ? previousArray.splice(oldDiscIndex,1) : previousArray.splice(oldDiscIndex,1,newDiscModified));
    sessionStorage.setItem('discStorage',JSON.stringify(previousArray));
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

export const transformToLowerString : ((value:string|number|boolean|undefined) => string) = value => {
    let lowString = value && Number.isInteger(value) ? value.toString() : '';
    lowString =  lowString?.toLowerCase();
    return lowString;
}