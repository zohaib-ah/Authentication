import React, { useContext } from 'react'
import { AppContent } from '../Context/AppContext'

const Header = () => {
  const {userData} = useContext(AppContent);

  return (
    <div className='flex items-center flex-col '>
      {userData ? (<>
      <h1>{userData.name}</h1>
      <h1 className='text-2xl font-medium mb-6'>Welcome To</h1></>) : 
      (<><h1 className='text-2xl font-medium mb-6'>Welcome To</h1></>) }
        
        
        <h1 className='text-4xl font-large underline'>Authentication</h1>
    </div>
  )
}

export default Header