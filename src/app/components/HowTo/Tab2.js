"use client";

import styles from "./howto.module.css";

export default function Tab2() {
    return (
        <main className={styles.content}>

            {/* Header */}
            <div className={styles.header}>
                <h2 className={styles.title}>Head to our Dashboard</h2>
            </div>

            {/* Subtext */}
            <div className={styles.textBlock}>
                <p>Here you can submit files or links</p>
            </div>

            {/* GIF Placeholder */}
            <div className={styles.gifPlaceholder}>
                <p>GIF goes here</p>
            </div>

            {/* Instructional Text */}
            <div className={styles.textBlock}>
                <p>Attach a file/link in our drop box and give it a name</p>
            </div>
        </main>
    );
}
