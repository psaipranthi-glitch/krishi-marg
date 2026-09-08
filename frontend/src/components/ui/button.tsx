import * as React from 'react';
export function Button({className='',variant='default',...props}:any){return <button className={`km-btn km-btn-${variant} ${className}`} {...props}/>}
