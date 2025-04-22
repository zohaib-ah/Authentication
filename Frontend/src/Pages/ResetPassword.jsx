import  { useState , useRef, useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { AppContent } from '../Context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'


const ResetPassword = () => {

  axios.defaults.withCredentials=true;
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const inputRefs = useRef([])

  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState(0);
  const [isOtpSubmited, setIsOtpSubmited] = useState(0);



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
 
   const onSubmitEmail = async (e) =>{
     try {
       e.preventDefault();
 
       const {data} = await axios.post(backendUrl + 'api/auth/send-reset-otp', {email})
       data.success ? toast.success(data.message) : toast.error(data.message)
       data.success && setIsEmailSent(true)
     } catch (error) {
       toast.error(error.message)
     }
   }


   const onSubmitOtp = async (e) => {
    e.preventDefault()
    const otpArray = inputRefs.current.map(e=>e.value)
    setOtp(otpArray.join(''))
    setIsOtpSubmited(true)
   }


   const onSubmitNewPassword = async (e) =>{
    try {
      e.preventDefault();
      

      const {data} = await axios.post(backendUrl + 'api/auth/resetPassword', {email,otp, newPassword})
      data.success ? toast.success(data.message) : toast.error(data.message)
      data.success && navigate('/login')
    } catch (error) {
      toast.error(error.message)
    }
  }


  return (

    <div className='flex  items-center justify-center min-h-screen px-6 sm:px-0
    bg-gradient-to-br from-gray-200 to-yellow-200'>
    <img onClick={()=> navigate('/')} src={assets.logo} alt="" className='absolute left-5 sm:left-20 w-15 sm:w-20 top-5 cursor-pointer'/>

    {!isEmailSent && <form onSubmit={onSubmitEmail} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
    <h1 className='text-white text-2xl font-semibold text-center mb-4 '>Reset Password </h1>
    <p className='text-gray-400 text-center mb-6'>Enter your registered email address</p>
    <div className='flex  mb-4 items-center  gap-3  w-full  px-5  py-2.5 rounded-full bg-[#333A5C] '>
      <img src={assets.mail_icon} alt="" />
      <input type="email" placeholder='Enter your email' 
      className='bg-transparent outline-none text-white'
      value={email}
      onChange={e=> setEmail(e.target.value)}
      required/>
    </div>
    <button  className='w-full py-2.5 rounded-full bg-gradient-to-br mt-2
        from-indigo-400 to-indigo-800 text-white font-medium'>Send OTP</button>
    </form>
  }


  {!isOtpSubmited && isEmailSent &&
    <form onSubmit={onSubmitOtp} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm' >
      <h1 className='text-white text-2xl font-semibold text-center mb-4 '>Reset Password OTP</h1>
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
        from-indigo-400 to-indigo-800 text-white font-medium'>Submit</button>
    </form>
}

{isEmailSent && isOtpSubmited &&

    <form onSubmit={onSubmitNewPassword} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
    <h1 className='text-white text-2xl font-semibold text-center mb-4 '>New Password </h1>
    <p className='text-gray-400 text-center mb-6'>Enter your new password</p>
    <div className='flex  mb-4 items-center  gap-3  w-full  px-5  py-2.5 rounded-full bg-[#333A5C] '>
      <img src={assets.lock_icon} alt="" />
      <input type="password" placeholder='Enter your new password' 
      className='bg-transparent outline-none text-white'
      value={newPassword}
      onChange={e=> setNewPassword(e.target.value)}
      required/>
    </div>
    <button  className='w-full py-2.5 rounded-full bg-gradient-to-br mt-2
        from-indigo-400 to-indigo-800 text-white font-medium'>Send OTP</button>
    </form>
}


    </div>
  )
}

export default ResetPassword