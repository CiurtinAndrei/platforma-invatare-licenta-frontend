'use client'

import { useState } from 'react'

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import styles from './Register.module.css'
import RegProfesor from './RegProfesor'
import RegElev from './RegElev'

export default function Register() {
    const [accType, changeAccType] = useState<string>('profesor')

    return (
        <>
            <div className={styles.page_container}>
                <div className={styles.login_window}>
                    {/* Title and radio buttons container */}
                    <div className={styles.header_container}>
                        <h2 className={styles.page_title}>
                            <span className={styles.title_part}>Creează</span> <span className={styles.title_part}>cont</span>
                        </h2>
                        <div className={styles.account_radio}>
                            <FormControl>
                                <FormLabel id="demo-row-radio-buttons-group-label">Înregistrare ca:</FormLabel>
                                <RadioGroup
                                    defaultValue='profesor'
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    value={accType}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => changeAccType(event.currentTarget.value)} >
                                    <FormControlLabel value="profesor" control={<Radio />} label="Profesor" />
                                    <FormControlLabel value="elev" control={<Radio />} label="Elev" />
                                </RadioGroup>
                            </FormControl>
                        </div>
                    </div>

                    <div className={styles.center_screen}>
                        {accType === 'profesor' ? <RegProfesor /> : accType === 'elev' ? <RegElev /> : <h1>Eroare!</h1>}
                    </div>

                </div>
            </div>
        </>
    );
}
