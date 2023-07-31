import { useQuery } from "react-query";

export const getDatabaseDiscs = async querySelected => {
    const url = `https://eu-west-2.aws.data.mongodb-api.com/app/data-nkugr/endpoint/${querySelected === 'discs' ? 'displayDiscs' : 'displayWishes'}`;

    let request = {
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
        getDatabaseDiscs,
        {
            cacheTime: 7200000,
            staleTime: 7200000
    })
}

export const fetchDisc = async (endpoint,token,newDisc) => {
    let method = '';
    if (endpoint === 'updateDisc' || endpoint === 'updateWish') {
        method = 'PUT';
    } else if (endpoint === 'deleteDisc' || endpoint === 'deleteWish') {
        method = 'DELETE';
    } else {
        method = 'POST';
    };

    const updatedDisc = {...newDisc};

    if (endpoint.includes('Wish')) {
        delete updatedDisc.year;
        delete updatedDisc.digipack;
        delete updatedDisc.format;
    }

    //API fetch requete POST pour formulaire
    const url = `http://localhost:8000/${endpoint}`;
    let request = {
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
            throw new Error(`Erreur HTTP : ${response.status}`)
        }
        const json = await response.json();
        //props.showAlert(json.message,'valid');
        return json;
    } catch (error) {
        return error;
    }
}