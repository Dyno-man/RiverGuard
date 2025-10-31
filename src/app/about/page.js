
import styles from "./page.module.css";

export default function About(){
    return(
        <div className={styles.page}>
            <main className={styles.main}>
                    <div className={styles.header}>
                        <h1>Who are we?</h1>
                    </div>

                <div className={styles.container}>
                    <div className={styles.mission}>
                        <h2>Our Mission</h2>
                    </div>
                </div>

                <div className={styles.container}>
                    <div className={styles.team}>
                        <h2>Our Team</h2>
                    </div>
                </div>

                <div className={styles.container}>
                    <div className={styles.how}>
                        <h2>Our Method</h2>
                    </div>
                </div>

            </main>

        </div>
    );
}