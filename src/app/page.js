
"use client";

import {useState, useEffect} from "react";
import Image from "next/image";
import styles from "./page.module.css";
import Navbar from "@/app/components/navbar.js";
import Dropbox from "@/app/components/dropbox.js";
import User from "@/app/components/userState.js";
import Login from "@/app/components/login.js";
import Signup from "@/app/components/signup.js";

export default function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [activeModal, setActiveModal] = useState(null); // null | 'login' | 'signup'

    const handleLoginClick = () => setActiveModal('login');
    const handleSignupClick = () => setActiveModal('signup');
    const handleCloseOverlay = () => setActiveModal(null);

    useEffect(() => {
        // Check if a token exists in localStorage
        const token = localStorage.getItem("authToken");
        if (token) setIsLoggedIn(true);
    }, []);

    return (
        <div className={styles.page}>
            <Navbar />
            <main className={styles.main}>
                <div className={styles.welcome}>
                    <h1>UP WITH GUARD <br />DOWN WITH TRASH</h1>
                    <div className={styles.welcomeText}>
                        Text here
                    </div>
                </div>
                <div className={styles["dropbox-container"]}>
                    {isLoggedIn ? (
                        <Dropbox />
                    ) : (
                        <User
                             onLogin={handleLoginClick}
                             onSignup={handleSignupClick}
                        />
                    )}
                    {activeModal === 'login' && (
                    <div className={styles.overlay} onClick={handleCloseOverlay}>
                        <div onClick={(e) => e.stopPropagation()} className={styles.modalWrapper}>
                            <Login onLoginSuccess={() => { setActiveModal(null); setIsLoggedIn(true); }} />
                        </div>
                    </div>
                )}

                    {activeModal === 'signup' && (
                        <div className={styles.overlay} onClick={handleCloseOverlay}>
                            <div onClick={(e) => e.stopPropagation()} className={styles.modalWrapper}>
                                <Signup onSignupSuccess={() => setActiveModal(null)} />
                            </div>
                        </div>
                    )}



                </div>
            </main>
            <footer className={styles.footer}>
                <a
                    href="https://nextjs.org/learn"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image src="/file.svg" alt="File icon" width={16} height={16} />
                    Learn
                </a>
                <a
                    href="https://vercel.com/templates?framework=next.js"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image src="/window.svg" alt="Window icon" width={16} height={16} />
                    Examples
                </a>
                <a
                    href="https://nextjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image src="/globe.svg" alt="Globe icon" width={16} height={16} />
                    Go to nextjs.org →
                </a>
            </footer>
        </div>
    );
}
