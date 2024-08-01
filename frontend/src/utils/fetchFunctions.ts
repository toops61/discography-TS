import { useQuery } from "react-query";
import { wishDiscFields } from "./interfaces";
import { getAllFormats, getAllStyles } from "./utilsFuncs";

export const getDatabaseDiscs = async (querySelected:string) => {
    const url = `https://eu-west-2.aws.data.mongodb-api.com/app/data-nkugr/endpoint/${querySelected === 'discs' ? 'displayDiscs' : 'displayWishes'}`;

    const request = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Request-Headers': '*'
        }
    };
    try {
        const response = await fetch(url,request);
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }
        const json = await response.json();
        //!discs && props.showAlert('Disques chargés','valid');
        try {
            json && getAllFormats(json);
            json && getAllStyles(json);
        } catch (error) {
            console.log(error);
        }
        return json;
    }
    catch(error) {
      console.error(error);
  }
}

export const useGetDiscs = () => {
    return useQuery(['discs'],
    () => getDatabaseDiscs('discs'),
    {
        cacheTime: 7200000,
        staleTime: 7200000
    });
}

export const useGetWantlist = () => {
    return useQuery(['wantlist'],
        () => getDatabaseDiscs(''),
        {
            cacheTime: 7200000,
            staleTime: 7200000
    })
}

export const fetchDisc = async (endpoint:string,token:string,newDisc:wishDiscFields) => {
    let method = '';
    if (endpoint === 'updateDisc' || endpoint === 'updateWish') {
        method = 'PUT';
    } else if (endpoint === 'deleteDisc' || endpoint === 'deleteWish') {
        method = 'DELETE';
    } else {
        method = 'POST';
    }

    const updatedDisc : wishDiscFields = {...newDisc};

    if (endpoint.includes('Wish')) {
        delete updatedDisc.year;
        delete updatedDisc.digipack;
        delete updatedDisc.format;
    }

    //API fetch requete POST pour formulaire
    const url = `http://localhost:8000/${endpoint}`;
    const request = {
        method,
        body: JSON.stringify(updatedDisc),
        headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + token
        }
    };
    try {
        const response = await fetch(url, request);
        if (!response.ok) {
            const json : {message:string;} = await response.json();
            throw new Error(`Erreur HTTP : ${response.status}${json?.message ? (', ' + json.message) : ''}`)
        }
        const json = await response.json();
        
        return json;
    } catch (error) {
        return error;
    }
}