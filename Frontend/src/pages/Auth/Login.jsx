import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../../context/AppContext';

const Login = () => {
    const naviggate= useNavigate();

    const {backendUrl, setIsLoggedIn, getUserData} =useContext(AppContent)

    const [state, setState]=useState('Sign Up')
    const [name, setName]=useState('');
    const [email, setEmail]=useState('');
    const [password, setPassword]=useState('');
    const onSubmitHandler = async (e)=>{
        try{
            e.preventDefault();
            axios.defaults.withCredentials=true

            if(state === 'Sign Up'){
                const {data} = await axios.post(backendUrl+ '/api/auth/register',{name,email,password})
                
                if(data.success){
                    setIsLoggedIn(true)
                    getUserData()
                    naviggate('/')
                }else{
                    alert(data.message)
                }

            }else{
                const {data} = await axios.post(backendUrl+ '/api/auth/login',{email,password})
                
                if(data.success){
                    setIsLoggedIn(true)
                    getUserData()
                    naviggate('/')
                }else{
                    alert(data.message)
                }
            }
        }catch(error){
            alert(error.message)
        }
    }
  
  
    return (
    <div>
        <h1 onClick={()=>naviggate('/')}>
            SkillSphere
        </h1>
        Login
        <h2>{state === 'Sign Up' ? 'Create Account': 'Login'}</h2>
        <h2>{state === 'Sign Up' ? 'Create your account': 'Login to your account!'}</h2>
        <form onSubmit={onSubmitHandler()}>
            {state === 'Sign Up' && (
<div>
                <input onChange={e=> setName(e.target.value)} value={name} type="text" placeholder='Full name' required />
            </div>
            )}
            
            <div>
            <input onChange={e=> setEmail(e.target.value)} value={email} type="email" placeholder='email' required />
            </div>
            <div>
                <input onChange={e=> setPassword(e.target.value)} value={password} type="password" placeholder='Password' required />
            </div>
            <p onClick={()=> naviggate('/reset-password')}>
                Forgot Password?
                <button >{state}</button>
            </p></form>
            {state === 'Sign Up' ? (<p>
                Already have and account?{' '}
                <span onClick={()=>setState('Login')}>Login here</span>
            </p>):(<p>
                No account <span onClick={()=>setState('Sign Up')}>signup</span> 
            </p>)}
            
            
        
    </div>
  )
}

export default Login