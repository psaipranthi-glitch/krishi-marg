import * as React from 'react';
export function Card({className='',...props}:any){return <div className={`glass ${className}`} {...props}/>}
export function CardHeader({className='',...props}:any){return <div className={`card-head ${className}`} {...props}/>}
export function CardTitle({className='',...props}:any){return <h3 className={className} {...props}/>}
export function CardContent({className='',...props}:any){return <div className={className} {...props}/>}
