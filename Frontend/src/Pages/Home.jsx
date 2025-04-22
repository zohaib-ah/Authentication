import React from 'react'
import Navbar from '../Components/navBar'
import Header from '../Components/Header'


const Home = () => {
  return (
    <div className='bg-[url("/bg_img.png")] bg-cover bg-center bg-no-repeat min-h-screen flex items-center justify-center'>
     <Navbar/>
     <Header/>
    </div>
  )
}

export default Home