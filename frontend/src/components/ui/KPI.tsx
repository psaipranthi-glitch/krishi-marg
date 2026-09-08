import{motion}from"framer-motion";import{ArrowUpRight}from"lucide-react";

type KPIProps={
 label:string;
 value:any;
 unit?:string;
 trend?:string;
 icon?:any;
 onClick?:()=>void;
 clickable?:boolean;
};

export default function KPI({
 label,
 value,
 unit="",
 trend,
 icon:Icon,
 onClick,
 clickable=false
}:KPIProps){
 return <motion.div
   className={`kpi glass ${clickable?"kpi-clickable":""}`}
   initial={{opacity:0,scale:.96}}
   animate={{opacity:1,scale:1}}
   whileHover={clickable?{y:-4,scale:1.015}:undefined}
   whileTap={clickable?{scale:.98}:undefined}
   onClick={onClick}
   role={clickable?"button":undefined}
   tabIndex={clickable?0:undefined}
   onKeyDown={e=>{
     if(clickable&&(e.key==="Enter"||e.key===" ")){
       e.preventDefault();
       onClick?.();
     }
   }}
 >
   <div className="kpi-top">
     <span>{label}</span>
     {Icon&&<div className="kpi-icon"><Icon size={18}/></div>}
   </div>

   <div className="kpi-value">
     {value}<small>{unit}</small>
   </div>

   {trend&&
     <div className="trend">
       <ArrowUpRight size={13}/>{trend}
     </div>
   }

   {clickable&&
     <div className="kpi-action">
       View details <ArrowUpRight size={12}/>
     </div>
   }
 </motion.div>
}
