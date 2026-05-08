import { useQuery } from "react-query";
import { alertProps, wishDiscFields } from "./interfaces";

export const getDatabaseDiscs = async (querySelected:string) => {
    const url = `https://discography-api.onrender.com/${querySelected === 'discs' ? 'displayDiscs' : 'displayWishes'}`;

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

export const fetchDisc = async (endpoint:string,newDisc:wishDiscFields) => {
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
    const url = `https://discography-api.onrender.com/${endpoint}`;
    //const url = `http://localhost:8000/${endpoint}`;

    const request = {
        method,
        body: JSON.stringify(updatedDisc),
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include" as RequestCredentials
    };
    
    try {
        let response = await fetch(url, request);
        
        // if access token checks failed
        if (response.status === 401) {
            const refreshResponse = await handleRefresh();

            if (!refreshResponse) return {success:false,message:'Vous devez vous reconnecter ...'};

            response = await fetch(url, request);
        }
        
        if (!response.ok) {
            const json : {succes:boolean;message:string;} = await response.json();
            throw new Error(`Erreur HTTP : ${response.status}${json?.message ? (', ' + json.message) : ''}`)
        }
        const json = await response.json();
        
        return json;
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Erreur inconnue"
        };
    }
}

export const disconnectUser = async (showAlert:alertProps) => {
        const url = 'https://discography-api.onrender.com/logout';
        //const url = 'http://localhost:8000/logout'

        const request = {
            method: 'POST',
            headers: {
            "Content-Type": "application/json"
            },
            credentials: "include" as RequestCredentials
        };
        try {
            const response = await fetch(url, request);
            if (!response.ok) {
                throw new Error(`Erreur de déconnexion : ${response.status}`)
            }
            const json = await response.json();            
            return json;
        } catch (error) {
            console.log(error);
            const message = error instanceof Error ? error.message : '';
            showAlert(message,'alert');
        }
    };

export const handleRefresh = async () => {
    const url = 'https://discography-api.onrender.com/refresh';
    //const url = 'http://localhost:8000/refresh'

    const request = {
        method: 'POST',
        headers: {
        "Content-Type": "application/json"
        },
        credentials: "include" as RequestCredentials
    };
    
    try {
        const response = await fetch(url, request);

        if (!response.ok) {
            throw new Error(`Erreur de reconnexion : ${response.status}`)
        }
        return response.ok;
    } catch (error) {
        console.log(error);
    }
}

export const checkConnection = async () => {
    const url = `https://discography-api.onrender.com/check`;
    //const url = `http://localhost:8000/check`;

    const request = {
        method:'POST',
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include" as RequestCredentials
    };
    try {
        const response = await fetch(url, request);
        if (!response.ok) {
            throw new Error(`Erreur de connexion : ${response.status}`)
        }
        const json = await response.json();            
        return json;
    } catch (error) {
        console.log(error);
        const message = error instanceof Error ? error.message : '';
        return { success:false,message };
    }
}