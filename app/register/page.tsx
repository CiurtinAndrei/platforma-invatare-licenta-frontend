'use client'

import {useState} from 'react'

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import Link from 'next/link';
import styles from './Register.module.css'
import RegProfesor from './RegProfesor'
import RegElev from './RegElev'


export default function Register(){

    const [accType, changeAccType] = useState<string>('profesor')

    return(
        <>
        <div className = {styles.page_container}>
          <div className = {styles.login_window}>
        <div className = {styles.account_radio}>



        <FormControl>
        <FormLabel id="demo-row-radio-buttons-group-label">Înregistrare ca:</FormLabel>
        <RadioGroup
        defaultValue = 'profesor'
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value = {accType}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => changeAccType(event.currentTarget.value)}>
        <FormControlLabel value="profesor" control={<Radio />} label="Profesor" />
        <FormControlLabel value="elev" control={<Radio />} label="Elev" />
        </RadioGroup>
        </FormControl>


        </div>

        <div className = {styles.center_screen}>

          {accType == 'profesor'? <RegProfesor/>: accType == 'elev'? <RegElev/>: <h1>Eroare!</h1>}

        </div>




        </div>
        </div>


        <h1><Link href={'/'}>Inapoi</Link></h1> 
        </>
    );


}