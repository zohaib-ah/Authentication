import { createContext, useEffect, useState } from "react";
import axios from "axios";


export const AppContent = createContext();

export const AppContextProvider = (props) =>{

    axios.defaults.withCredentials = true;


    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [isLoggedIn , setIsloggedIn] = useState(false);
    const [userData, setUserData] = useState(false)

    const getAuthState =  async () => {
        try {
            const {data} = await axios.get(backendUrl + 'api/auth/is-auth')
            if(data.success){
                setIsloggedIn(true)
                getUserData()
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Something went wrong")
        }
    }


    const getUserData = async () =>{
        try {
            const {data} = await axios.get(backendUrl + 'api/users/user')
            data.success ? setUserData(data.userData) : toast.error(data.message)
            console.log(user);  
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Something went wrong")
        }
    }

    useEffect(()=>{
        getAuthState()
    },[])


    const value={
        backendUrl,
        isLoggedIn,
        setIsloggedIn,
        userData,
        setUserData,
        getUserData,

    }

    

    return(
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    )
}