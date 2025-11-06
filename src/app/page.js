"use client";

import styles from "./page.module.css";
import HowTo from "@/app/components/HowTo/HowTo.js";

export default function Home() {

    return (
        <div className="page">
            <main className={styles.main}>
                <div className={styles.welcome}>
                    <h1 className={styles.welcomeHeader}>UP WITH GUARD <br />DOWN WITH TRASH</h1>
                    <div className={styles.welcomeText}>
                        <p>RiverGuard leverages AI-driven object detection to identify and classify river trash in real time, helping to reduce pollution and improve waterway health. Our system processes video and image data to automatically detect waste without manual monitoring. By providing accessible, actionable data, RiverGuard empowers communities and researchers to respond faster and build long-term sustainability efforts.</p>
                    </div>
                </div>
                <div className={styles.howToContainer}>

                    <HowTo />
                </div>
            </main>
        </div>
    );
}
