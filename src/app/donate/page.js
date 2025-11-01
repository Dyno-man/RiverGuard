
import styles from "./page.module.css";
import DonateOption from "@/app/components/DonateOption/DonateOption.js";

export default function Donate(){
    return(
        <div className="page">
            <main className={styles.main}>
                <div className={styles.text}>
                    <h1>SUPPORT THE GUARD</h1>
                </div>
                <div className={styles.options}>
                    <DonateOption tier = "Patron" price = "50"/>
                    <DonateOption tier = "Guardian" price = "100"/>
                    <DonateOption tier = "Comrade" price = "500"/>
                </div>
            </main>

        </div>

    );
}