'use client';

import {useRouter} from 'next/navigation'

import styles from './Home.module.css'

export default function Home() {

  const router = useRouter();

  const handleRedirect = () =>{
        router.push(`/register`)

}

  const goToLogin = () =>{
        router.push('/login')
  }


  return (

    <>

    
    <div className = {styles.page_container}>

    <div className = {styles.login_window}>

    <span className={styles.title}><b>Bine ați venit pe platforma MateMAX!</b></span>
    
    <div className = {styles.button_group}> 

    <button className = {styles.action_button} onClick = {goToLogin}>Login</button> <button className = {styles.action_button} onClick = {handleRedirect}> Înregistrare</button>

    </div>
    
    </div>

    </div>
    

    </>

  );
}
