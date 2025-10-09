import Image from "next/image";
import styles from "./page.module.css";
import Navbar from "@/app/components/navbar.js";

export default function About(){
    return(
        <div className={styles.page}>
            <div className={styles.text}>

            </div>
            < Navbar/>
        </div>
    );
}