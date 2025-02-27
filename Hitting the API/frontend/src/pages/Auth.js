import React, { useState } from 'react'
import './Auth.css'

const Auth = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin]= useState(true);

    const submitHandler= (e)=>{
        e.preventDefault();

        if(email.trim().length === 0 || password.trim().length === 0){
            return;
        }
        // console.log(email, password);
        let requestBody={
            query: `
            query {
                login(email: "${email}" password: "${password}"){
                userId
                token
                tokenExpiration
                }
            }  `
        };
        if(!isLogin){
            requestBody={
                query: `
                mutation {
                    createUser(userInput: {email:"${email}",password:"${password}" }){
                    _id
                    email
                    }
                }
                `
            };
        }
      
        fetch('http://localhost:8000/graphql',{
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res =>{
            if(res.status !== 200 && res.status !== 201){
                throw new Error('failed');
            }
            return res.json()
        })
        .then(resData =>{
            console.log(resData);
        })
        .catch(err =>{
            console.log(err);
        })
    }

    const switchModeHandler= ()=>{
        setIsLogin(!isLogin);
    }
  return (
    <form action="" className='auth-form' onSubmit={submitHandler}>
        <div className="form-control">
            <label htmlFor="email">E-Mail</label>
            <input type="email" id='email' value={email} onChange={(e)=>{ setEmail(e.target.value)}}/>
        </div>
        <div className="form-control">
            <label htmlFor="password">Password</label>
            <input type="password" id='password' value={password} onChange={(e)=> {setPassword(e.target.value)}}/>
        </div>
        <div className="form-actions">
            <button type='button' onClick={switchModeHandler}>
                {!isLogin ? "Switch to Login" : "Switch to Signup"} 
                </button>
            <button type="submit">Submit</button>
        </div>
    </form>
  )
}

export default Auth