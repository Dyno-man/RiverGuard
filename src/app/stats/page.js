"use client";
import styles from "./page.module.css";
import Navbar from "@/app/components/navbar.js";
import Signup from "@/app/components/signup.js";

export default function Stats(){
    return(
        <div className={styles.page}>
            < Navbar/>
            <main>
                <div className={styles.text}>
                    <Signup />
                </div>
            </main>
        </div>
    );
}