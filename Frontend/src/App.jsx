import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Logout from './Pages/Logout';
import EmailVerify from './Pages/EmailVerify';
import ResetPassword from './Pages/ResetPassword';
import { ToastContainer } from 'react-toastify';


const App = () => {
  return (
    <div>
      <ToastContainer/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/Logout' element={<Logout/>}/>
        <Route path='/verifyEmail' element={<EmailVerify/>}/>
        <Route path='/ResetPassword' element={<ResetPassword/>}/>
      </Routes>
    </div>
  )
}

export default App;