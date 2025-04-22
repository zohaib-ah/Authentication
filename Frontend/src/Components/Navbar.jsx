import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import {useNavigate} from 'react-router-dom'
import { AppContent } from '../Context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Navbar = () => {

    const navigate = useNavigate();
    
    const {userData, backendUrl, setUserData, setIsloggedIn} = useContext(AppContent);

    const sendEmailVerifyOtp = async ()=>{
        try {
           axios.defaults.withCredentials=true;
           const {data} = await axios.post(backendUrl+ 'api/auth/send-verify-otp')
           if(data.success){
            navigate('/verifyEmail')
            toast.success(data.message)
           } 
        } catch (error) {
            toast.error(error.message)
        }
    }



    const logout = async () =>{
        axios.defaults.withCredentials=true;
        const {data} = await axios.post(backendUrl + 'api/auth/logout')
        data.success && setIsloggedIn(false);
        data.success && setUserData(false);
        navigate('/')

    }

    
  return (
    <div className='w-full flex justify-between items-center p-6 sm-p-6 sm:px-24 absolute top-0'>
        <img src={assets.logo} alt="auth logo" className='w-20 sm:w-20' />

        {userData ? <div className='w-8 h-8 flex justify-center items-center rounded-full 
        bg-black text-white  relative group'>
            {userData.name[0].toUpperCase()}
            <div className='absolute  hidden w-30  group-hover:block top-5 right-0 z-10  text-black rounded-full pt-5'>
                <ul className='list-none m-0 p-2 bg-gray-200 text-sm rounded'>
                    {!userData.isAccountVerified && 
                    <li onClick={sendEmailVerifyOtp} className='py-1 px-2 hover:bg-gray-300 cursor-pointer rounded'>
                    Verify email
                    </li>}
                    <li onClick={logout} className='py-1 px-2 hover:bg-gray-300 cursor-pointer'>
                    LogOut
                    </li>
                </ul>
            </div>
            </div> : 
        <button onClick={()=> navigate('/login')}
        className='flex items-center gap-2 border border-gray-800 rounded-lg px-4 h-4
        py-5 text-gray-800 hover:bg-gray-200 
        transition-all'>login <img src={assets.arrow_icon} alt="" /></button>
        } 
    </div>
  )
}

export default Navbar