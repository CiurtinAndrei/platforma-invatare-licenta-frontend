'use client'

import { useRouter } from "next/navigation";


export default function Admin(){

    const Router = useRouter()

    const handleRedirect = ()=>{
        Router.push('/admin/exercitiu')
    }


    return(<>
    
    
        Pagina adminilor!
        <button onClick = {handleRedirect}>Adauga un nou exercitiu </button>
    
    
    </>)


}