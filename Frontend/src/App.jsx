import './App.css'
import {Routes , Route } from 'react-router-dom'
import Login from './pages/Auth/Login'
import Home from './pages/Home'
import ResetPassword from './pages/Auth/ResetPassword'
import EmailVerify from './pages/Auth/EmailVerify'

function App() {
  return (
    <>
      APP
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/reset-password' element={<ResetPassword/>}/>
      <Route path='/email-verify' element={<EmailVerify/>}/>
      <Route path='/' element={<Home/>}/>
      

    </Routes>
    </>
  )
}

export default App
