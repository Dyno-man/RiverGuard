"use client"

import styles from "./donateoption.module.css";

export default function DonateOption(props){

    return(
        <div>
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.text}>
                        <div className={styles.tier}>
                            <h1>{props.tier}</h1>
                        </div>
                        <div className={styles.price}>
                            <h1>${props.price}</h1><p>/month</p>
                        </div>
                    </div>
                    <div className={styles.button}>
                        <h3>Donate</h3>
                    </div>
                </div>

            </main>
        </div>


    );
}