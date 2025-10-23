
import styles from "./page.module.css";
import Navbar from "@/app/components/Navbar/Navbar.js";

export default function About(){
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