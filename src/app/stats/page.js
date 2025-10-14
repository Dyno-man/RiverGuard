import Image from "next/image";
import styles from "./page.module.css";
import Navbar from "@/app/components/navbar.js";

export default function Stats(){
    return(
        <div className={styles.page}>
            < Navbar/>
            <main>
                <div className={styles.text}>

                </div>
            </main>
        </div>
    );
}