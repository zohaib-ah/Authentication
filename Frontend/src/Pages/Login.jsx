import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../Context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'


const Login = () => {

  const navigate = useNavigate();
  
  const {backendUrl, setIsloggedIn, getUserData} = useContext(AppContent)
  const [state, setState] = useState("Sign Up")

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');




  const submitHandler = async (event) =>{
    try {
      event.preventDefault();

    axios.defaults.withCredentials = true;
    if(state === "Sign Up"){
      const {data} = await axios.post(backendUrl + "api/auth/register", {name, email, password})
      if(data.success){
        setIsloggedIn(true)
        getUserData()
        navigate('/')
      }
      else{
        toast.error(data.message)
      }
    }else{

      const {data} = await axios.post(backendUrl + "api/auth/login", {email, password})
      if(data.success){
        setIsloggedIn(true)
        getUserData()
        navigate('/')
      }
      else{
        toast.error(data.message)
      }

    }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Something went wrong")
    }
  }

  return (
    <div className='flex  items-center justify-center min-h-screen px-6 sm:px-0
    bg-gradient-to-br from-gray-200 to-yellow-200'>

      <img onClick={()=> navigate('/')} src={assets.logo} alt="" className='absolute left-5 sm:left-20 w-15 sm:w-20 top-5 cursor-pointer'/>

      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-90 mt-20
      text-indigo-300 text-sm'>

      <h1 className='text-3xl font-semibold text-white text-center mb-3' >{state=== "Sign Up" ? "Create Account": "Login"}</h1>

      <p className='text-center text-sm mb-6'>{state=== "Sign Up" ? "Create your Account": "Login to your account"}</p>

      <form onSubmit={submitHandler}>
        {state === "Sign Up" && (
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5c]'>
          <img src={assets.person_icon} alt="" />
          <input className='bg-transparent outline-none text-white' 
          type='text' 
          placeholder='Username' 
          required
          value={name}
          onChange={event => setName(event.target.value)}
          />
        </div>)}

        <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5c]'>
          <img src={assets.mail_icon} alt="" />
          <input className='bg-transparent outline-none text-white' 
          type='email' 
          placeholder='Email' 
          required
          value={email}
          onChange={event => setEmail(event.target.value)}
          />
        </div>

        <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5c]'>
          <img src={assets.lock_icon} alt="" />
          <input className='bg-transparent outline-none text-white' 
          type='password' 
          placeholder='Password' 
          required
          value={password}
          onChange={event=>setPassword(event.target.value)}
          />
        </div>

        <p  onClick={()=> navigate('/ResetPassword')} className='mb-4 cursor-pointer text-white-800'>Forgot Password?</p>

        <button  className='w-full py-2.5 rounded-full bg-gradient-to-br 
        from-indigo-400 to-indigo-800 text-white font-medium'>{state}</button>
      </form>

      {state === "Sign Up" ? (
        <p className='text-grey-400 text-center text-ms mt-4'>Already have an account?{""}
        <span className='text-white underline cursor-pointer' onClick={()=>setState("Login")}> Login here</span>
      </p>
      ):(<p className='text-grey-400 text-center text-ms mt-4'>Do not have an account?{""}
        <span className='text-white underline cursor-pointer' onClick={()=>setState("Sign Up")}> Sign up</span>
      </p>
      )}
      
      
      </div>
    </div>
  )
}

export default Login