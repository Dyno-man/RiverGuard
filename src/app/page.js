
"use client";

import {useState, useEffect} from "react";
import styles from "./page.module.css";
import Navbar from "@/app/components/navbar.js";
import Dropbox from "@/app/components/dropbox.js";
import User from "@/app/components/userState.js";
import Login from "@/app/components/login.js";
import Signup from "@/app/components/signup.js";

export default function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [activeModal, setActiveModal] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) setIsLoggedIn(true);
    }, []);

    const handleAuthClick = () => {
        if (isLoggedIn) {
            setIsLoggedIn(false);
            localStorage.removeItem("authToken");
        } else {
            setActiveModal("login");
        }
    };

    const closeModal = () => setActiveModal(null);

    return (
        <div className={styles.page}>
            <Navbar isLoggedIn={isLoggedIn} onAuthClick={handleAuthClick}/>
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
                             onLogin={handleAuthClick}
                             onSignup={() => setActiveModal("signup")}
                        />
                    )}
                    {activeModal === 'login' && (
                        <div className={styles.overlay} onClick={closeModal}>
                           <div onClick={(e) => e.stopPropagation()} className={styles.modalWrapper}>
                                <Login onLoginSuccess={() => { closeModal(); setIsLoggedIn(true); }} />
                            </div>
                        </div>
                    )}

                    {activeModal === 'signup' && (
                        <div className={styles.overlay} onClick={closeModal}>
                            <div onClick={(e) => e.stopPropagation()} className={styles.modalWrapper}>
                                <Signup onSignupSuccess={closeModal} />
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
