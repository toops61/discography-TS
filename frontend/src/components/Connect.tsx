import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { useAppDispatch } from "../redux/hooks";
import { alertProps, backendResultUser, connectedFields, userFields } from "../utils/interfaces";
import { updateGeneralParams } from "../redux/generalParamsSlice";

export default function CreateUser({showAlert}:{showAlert:alertProps}) {
    const [userObject, setUserObject] = useState<userFields>({
        email:'',
        password:''
    })
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleChange = (e:ChangeEvent) => {
        const object = {...userObject};
        const target = e.target as HTMLInputElement;
        object[target.name] = target.value;
        setUserObject({...object});
    };

    const fetchPost = async () => {
        const url = 'http://localhost:8000/login';

        const request = {
            method: 'POST',
            body: JSON.stringify(userObject),
            headers: {
            "Content-Type": "application/json"
            }
        };
        try {
            const response = await fetch(url, request);
            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`)
            }
            const json : backendResultUser = await response.json();
            if (json.data && json.token) {
                const userLogged:connectedFields = {
                    id: json.data._id,
                    email: json.data.email,
                    token: json.token
                }
                dispatch(updateGeneralParams({connected:true}));
                showAlert(json.message,'valid');
                return userLogged;
            } else {
                showAlert('la connexion a échoué, réessayez','alert');
            }
        } catch (error) {
            console.log(error);
            const message = error instanceof Error ? error.message : '';
            showAlert(message,'alert');
        }
    };
  
    const { isLoading,refetch,data } = useQuery(['user'],
    fetchPost,{
        enabled: false,
        cacheTime: 1800000,
        staleTime: 1800000
    });

    data?.token && sessionStorage.setItem('userStored',JSON.stringify(data));

    data?.token && setTimeout(() => {
        navigate("/NewDisc");
    }, 1000);

    //API fetch requete POST pour formulaire
    const connectSubmit : ((e:FormEvent) => void) = e => {
        e.preventDefault();
        if (userObject.email && userObject.password) refetch();
    }

    useEffect(() => {
        dispatch(updateGeneralParams({isLoading}));
    }, [isLoading]);

  return (
    <>
    <Link className="back" to="/"></Link>
        <form className='connect-container'>
            <div className='user-inputs' tabIndex={0}>
                <label htmlFor='email'>Mail</label>
                <input type='text' name='email' max='50' onChange={handleChange} value={userObject.email} required />
            </div>
            <div className='user-inputs' tabIndex={0}>
                <label htmlFor='password'>Mot de passe</label>
                <input type='password' name='password' max='50' onChange={handleChange} value={userObject.password} required />
            </div>
            <div className="buttons-container">
                {/* <button onClick={subscribeSubmit}>Créer</button> */}
                <button onClick={connectSubmit}>Connecter</button>
            </div>
        </form>
    </>
  )
}
