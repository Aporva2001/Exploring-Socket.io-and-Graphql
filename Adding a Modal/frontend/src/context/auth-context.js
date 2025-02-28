import { createContext, useState } from "react";

export const AuthContext= createContext();

export const AuthProvider= ({children})=>{
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const login=  (token, userId, tokenExpiration)=>{
        setToken(token);
        setUserId(userId);
    };
    const logout= ()=>{
        setToken(null);
        setUserId(null)
    };

    return(
        <AuthContext.Provider value={{token, userId,login, logout,setToken, setUserId}}>
            {children}
        </AuthContext.Provider>
    )

}