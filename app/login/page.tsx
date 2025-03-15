'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import styles from './Login.module.css';

export default function Login() {
    
    const router = useRouter();  

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);  // Loading state to prevent rendering login page briefly

    useEffect(() => {
        // Check if there is an existing JWT token on page load to avoid rendering the login page
        const checkAuthStatus = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/auth/check', { withCredentials: true });
                
                // If the user is authenticated, redirect based on their role
                if (response.data.role === 'profesor') {
                    router.push('/profesor'); // Redirect to professor dashboard
                } else if (response.data.role === 'elev') {
                    router.push('/dashboard'); // Redirect to student dashboard
                }


            } catch (error) {
                // If there's no valid token or token expired, continue with login page
                console.log("User is not authenticated or token expired");
            } finally {
                setLoading(false); // After the check is done, set loading to false to render the login form
            }
        };

        checkAuthStatus(); // Call the function to check auth status as soon as the page is loaded
    }, [router]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/api/auth/login', { email, password }, { withCredentials: true });

            // Handle successful login
            console.log(response.data.message); // Log the success message
            
            const { role } = response.data;  // Get the role from the API response

            // Redirect based on the role
            if (role === 'profesor') {
                router.push('/profesor');  // Redirect to professor dashboard
            } else if (role === 'elev') {
                router.push('/dashboard');  // Redirect to student dashboard
            }
        } catch (error: any) {
            if (error.response) {
                setError(error.response.data.message); // Set error message
            } else {
                setError("An error occurred during login.");
            }
        }
    };


    return (
        <>
        
        
        
        {loading === true ? <div className={styles.loading}>Loading...</div>: 
        <div className={styles.page_container}>
            <div className={styles.login_window}>
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.input_group}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>
                    <div className={styles.input_group}>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>
                    {error && <div className={styles.error_message}>{error}</div>}
                    <button type="submit" className={styles.login_button}>Login</button>
                </form>
            </div>
        </div>
        }
        
        
        
        
        
        
        
        
        </>
        
    );
}
