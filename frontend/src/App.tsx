import{useState}from'react';import{AnimatePresence,motion}from'framer-motion';import{LogOut,Menu,X}from'lucide-react';import{useAuth}from'./store/auth';import Sidebar from'./components/layout/Sidebar';import Header from'./components/layout/Header';import Login from'./pages/auth/Login';import Dashboard from'./pages/Dashboard';import RoleWorkspace from'./pages/RoleWorkspace';import ToastContainer from'./components/ui/Toast';

export default function App(){
 const{user,logout}=useAuth();
 const[active,setActive]=useState('Dashboard');
 const[open,setOpen]=useState(false);

 if(!user)return <Login/>;

 const navigate=(page:string)=>{
   setActive(page);
   setOpen(false);
 };

 return <div className="app">
   <ToastContainer/>
   <button className="mobile-menu" onClick={()=>setOpen(!open)}>
     {open?<X/>:<Menu/>}
   </button>

   <div className={open?'side-mobile open':'side-mobile'}>
     <Sidebar active={active} setActive={navigate}/>
   </div>

   <div className="desktop-side">
     <Sidebar active={active} setActive={setActive}/>
   </div>

   <main className="main">
     <Header/>

     <div className="content">
       <AnimatePresence mode="wait">
         <motion.div
           key={active}
           initial={{opacity:0,y:8}}
           animate={{opacity:1,y:0}}
           exit={{opacity:0,y:-8}}
         >
           {active==='Dashboard'
             ?<Dashboard role={user.role} onNavigate={navigate}/>
             :<RoleWorkspace role={user.role} page={active}/>
           }
         </motion.div>
       </AnimatePresence>
     </div>

     <button className="logout" onClick={logout}>
       <LogOut size={15}/> Sign out
     </button>
   </main>
 </div>
}


