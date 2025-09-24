import axios from 'axios';
import React, { useContext, useEffect } from 'react'
import { AppContent } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';


const EmailVerify = () => {
    axios.defaults.withCredentials=true
    const navigate= useNavigate();

    const {backendUrl, isLoggedIn, userData,getUserData}=useContext(AppContent)

    const inputRefs =React.useRef([])
  const handleInput=(e,index)=>{
    if(e.target.value.length > 0 && index < inputRefs.current.length-1){
        inputRefs.current[index+1].focus();
    }
  }  
  
  const handleKeyDown=(e,index)=>{
    if(e.key === 'Backspace' && e.target.value===' ' && index >0){
        inputRefs.current[index - 1].focus();
    }
  }
  const handlePaste= (e)=>{
    const paste = e.clipboardData.getData('text')
    const pasteArray = paste.split('');
    pasteArrayforEach(element => {
        if(inputRefs.current[index]){
            inputRefs.current[index-1].focus();
        }
    });
  }

  const onSubmitHandler= async(e)=>{
    try {
        e.preventDefault();
        const otpArray= inputRefs.current.map(e=> e.value)
        const otp= otpArray.join('')
        const {data} = await axios.post(backendUrl+'/api/auth/send-reset-otp', {otp})
        if (data.success){
            alert('success')
            getUserData()
            navigate('/')
        }else{
            alert('error')
        }
    } catch (error) {
        alert(error.message)
    }
  }

    useEffect(()=>{
        isLoggedIn && userData && userData.isVerified && navigate('/')
    },[isLoggedIn,userData])

  return (
    
    <div>EmailVerify
        <form onSubmit={onSubmitHandler}>
            <p>6 digit code</p>
            <div onPaste={handlePaste}>
            {Array(6).fill(0).map((_,index)=>
            (
                <input type="text" maxLength='1' key={index} required ref={(e)=>inputRefs.current[index]=e} onInput={(e)=>handleInput(e,index)} onKeyDown={(e)=>handleKeyDown(e,index)}/>
            ))}</div>
            <button >verify</button>
        </form>
    </div>
  )
}

export default EmailVerify