
import styles from "./page.module.css";
import Navbar from "@/app/components/Navbar/Navbar.js";
import DonateOption from "@/app/components/DonateOption/DonateOption.js";

export default function Donate(){
    return(
        <div className={styles.page}>
            < Navbar/>

            <main className={styles.main}>
                <div className={styles.text}>
                    <DonateOption tier = "Patron" price = "50"/>
                    <DonateOption tier = "Guardian" price = "100"/>
                    <DonateOption tier = "Comrade" price = "500"/>
                </div>
            </main>

        </div>

    );
}