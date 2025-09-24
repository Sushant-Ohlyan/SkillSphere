import { createContext, useEffect, useState } from "react";
import axios from 'axios'

export const AppContent =createContext();



export const AppContextProvider = (props)=>{

    axios.defaults.withCredentials=true;

    const backendUrl=import.meta.env.VITE_BACKEND_URL;
    const [isLoggedin, setIsLoggedIn]=useState(false);
    const [userData, setUserData]=useState(false);


    const getAuthState = async ()=>{
        try {
            const {data} = await axios.get(backendUrl+'/api/auth/isAuth')
            if(data.success){
                setIsLoggedIn(true)
                getUserData()
            }
        } catch (error) {
            alert(error.message)
        }
    }

    useEffect(()=>{
        getAuthState();
    },[])

    const getUserData = async()=>{
        try{
            const {data}= await axios.get(backendUrl+'/api/user/data')
            data.success ? setUserData(data.userData): alert('error')
        }catch(error){alert(error.message)}
    }

    const value={
        backendUrl,
        isLoggedin, setIsLoggedIn,
        userData, setUserData,
        getUserData
    }
    return(
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    )
}