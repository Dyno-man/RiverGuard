
"use client";

import styles from "./page.module.css";
import Navbar from "@/app/components/Navbar/Navbar.js";

export default function Home() {


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
                <div className={styles.howToContainer}>

                </div>
            </main>
        </div>
    );
}
