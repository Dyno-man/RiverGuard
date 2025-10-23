"use client"

import styles from "./page.module.css"
import Navbar from "@/app/components/Navbar/Navbar.js";
export default function Dashboard(){
    return(
        <div>
            <Navbar />
            <main className={styles.main}>

            </main>
        </div>
    );
}