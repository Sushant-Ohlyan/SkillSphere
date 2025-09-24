import React from 'react'
import Navbar from '../components/Navbar'
import { AppContent } from '../context/AppContext'

const Home = () => {
  const{userData}=userContext(AppContent)
    return (
    <div>Home
        <Navbar/>
        {userData ? userData.name : 'Developer'}
    </div>
  )
}

export default Home