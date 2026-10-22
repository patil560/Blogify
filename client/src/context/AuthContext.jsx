import { createContext, useContext, useEffect, useState } from "react";
import { api, getCsrf } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({children}){
  const [user,setUser]=useState(null); 
  const [loading,setLoading]=useState(true);

  useEffect(()=>{(
    async()=>{
      try{
        await getCsrf(); 
        const r=await api("/auth/me"); 
        setUser(r.user)
      }
    catch{}
    finally{
      setLoading(false)
    }
  })()},[]);

  const signIn =  async(data) => {
    const r = await api("/auth/signin",{method:"POST",body:JSON.stringify(data)});
    setUser(r.user);
    return r
  };

  const signUp = async(data) => {
    const r=await api("/auth/signup",{method:"POST",body:JSON.stringify(data)});
    setUser(r.user);
    return r
  };

  const signOut = async() => { 
    await api("/auth/logout",{method:"POST"});
    setUser(null)
  };
  
  return <AuthContext.Provider value={{user,loading,signIn,signUp,signOut}}>{children}</AuthContext.Provider>
}

export function useAuth(){
  return useContext(AuthContext)
}
