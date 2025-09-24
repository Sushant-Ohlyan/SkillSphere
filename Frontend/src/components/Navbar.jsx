import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Navbar = () => {
    const navigate=useNavigate();
    const {userData, backendUrl, setUserData, setIsLoggedIn} =useContext(AppContent)
    
        const sendVerificationOtp=async()=>{
            try{
                axios.defaults.withCredentials=true;
                const {data}= await axios.post(backendUrl+'/api/auth/send-verify-otp')
                if(data.success){
                    navigate('/verify-email')
                }else{
                    alert('error')
                }
            }catch(error){
                alert(error.message)
            }
        }

        const logout = async()=>{
            try {
                axios.defaults.withCredentials=true
                const {data}=await axios.post(backendUrl+'/api/auth/logout')
                data.success && setIsLoggedIn(false)
                data.success && setIsLoggedIn(false)
                navigate('/')
            } catch (error) {
                alert(error.message)
                
            }
        }
  return (
    <div>Navbar
        <Link >Home</Link>
        <Link>Login</Link>
        <Link> </Link>
        <Link></Link>
        <Link></Link>
        {userData ?
        <div>
            {userData.name[0].toUpperCase()}
            <div className='hidden group-hover:block'>
                <ul>
                    {!userData.isAccountVerified &&
                    <li onClick={sendVerificationOtp}>
                        Verify Email
                    </li>}
                    <li>
                        LogOut
                    </li>
                </ul>

            </div>
        </div>
        :
        <button onClick={()=> navigate('/login')} >login</button>    
    }
    </div>
  )
}

export default Navbar