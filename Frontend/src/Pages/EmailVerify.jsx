import React, { useContext, useEffect, useRef } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AppContent } from '../Context/AppContext'
import { toast } from 'react-toastify'

const EmailVerify = () => {


  axios.defaults.withCredentials =true;
  const navigate = useNavigate()

  const inputRefs = useRef([])

  const {backendUrl,isLoggedIn , userData, getUserData} = useContext(AppContent);

  const handleInput = (e, index) =>{
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
    if(e.target.value.length > 0 && index < inputRefs.current.length -1 ){
      inputRefs.current[index+1].focus();
    }
  }

  const handlePaste = (e) =>{
    const  paste = e.clipboardData.getData('text')
    const dataArray = paste.split('')
    dataArray.forEach((char,index)=> {
      if(inputRefs.current[index]){
        inputRefs.current[index].value = char
      }
      
    });
  }

  const handleDeleteInput = (e, index) =>{
    if(e.key==='Backspace' && e.target.value==='' && index>0){
      inputRefs.current[index-1].focus();
    }
  }

  const submitHandler = async (e) =>{
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map(e=> e.value)
      const otp = otpArray.join('')

      const {data} = await axios.post(backendUrl + 'api/auth/verify-email', {otp})
      if(data.success){
        toast.success(data.message)
        getUserData();
        navigate('/')
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{

    isLoggedIn && userData && userData.isAccountVerified && navigate('/')
  },[isLoggedIn, userData])



  return (
    <div className='flex  items-center justify-center min-h-screen px-6 sm:px-0
    bg-gradient-to-br from-gray-200 to-yellow-200'>
    <img onClick={()=> navigate('/')} src={assets.logo} alt="" className='absolute left-5 sm:left-20 w-15 sm:w-20 top-5 cursor-pointer'/>

    <form className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm' onSubmit={submitHandler}>
      <h1 className='text-white text-2xl font-semibold text-center mb-4 '>Email Verify OTP</h1>
      <p className='text-gray-400 text-center mb-6'>Enter the 6-digit code sent to your email id</p>
      <div className='flex justify-between  mb-8' onPaste={handlePaste}>
        {Array(6).fill(0).map((_, index)=>(
          <input type='text' maxLength='1' key={index} required
          autoFocus={index===0}
          className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md' 
          ref={(e)=> inputRefs.current[index] = e}
          onKeyDown={(e)=> handleDeleteInput(e, index)}
          onInput={(e)=> handleInput(e, index)}/>
          
        ))}
      </div>
      <button  className='w-full py-2.5 rounded-full bg-gradient-to-br 
        from-indigo-400 to-indigo-800 text-white font-medium'>Verify Email</button>
    </form>
    </div>
  )
}

export default EmailVerify