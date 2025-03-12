'use client';

import {useRouter} from 'next/navigation'

import styles from './Home.module.css'

export default function Home() {

  const router = useRouter();

  const handleRedirect = () =>{
        router.push(`/test`)

}


  return (

    <>

    
    <div className = {styles.page_container}>

    <div className = {styles.login_window}>

    <span className = "styles.tile"><b>Bine ati venit pe platforma MateMAX!</b></span>
    
    <div className = {styles.button_group}> 

    <button className = {styles.action_button}>Login</button> <button className = {styles.action_button}> Inregistrare</button>

    </div>
    
    </div>

    </div>
    

    </>

  );
}
