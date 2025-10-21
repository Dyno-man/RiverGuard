"use client";

import styles from "@/app/components/userState.module.css";

export default function userState({ onLogin, onSignup }) {
    return (
        <div className={styles.container}>
            <div className={styles.authBox}>

                <div className={styles.subContainer}>
                    <p className={styles.text}>Login to upload streams</p>
                    <button className={styles.btn} onClick={onLogin}>LOGIN</button>
                </div>

                <div className={styles.divider}></div>

                <div className={styles.subContainer}>
                    <p className={styles.text}>Don’t have an account?</p>
                    <button className={styles.btn} onClick={onSignup}>SIGN UP HERE</button>
                </div>

            </div>
        </div>
    );
}
