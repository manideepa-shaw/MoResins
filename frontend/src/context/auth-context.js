import { createContext } from "react";

export const AuthContext = createContext({
    userId : null,
    email:null,
    isLoggedIn:false,
    token: null,
    logging: ()=>{},
    logout:()=>{}
})