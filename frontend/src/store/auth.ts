import{create}from'zustand';
type User={id:number;name:string;role:string;email:string};type S={user:User|null;setUser:(u:User)=>void;logout:()=>void};
export const useAuth=create<S>(set=>({user:JSON.parse(localStorage.getItem('km_user')||'null'),setUser:u=>{localStorage.setItem('km_user',JSON.stringify(u));set({user:u})},logout:()=>{localStorage.clear();set({user:null})}}));
