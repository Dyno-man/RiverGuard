"use client";

import styles from "./howto.module.css";

export default function Tab3() {

    return (
        <div>
            <main className={styles.content}>
                {/* Text above GIF */}
                <div className={styles.step}>
                    <div className={styles.textBlock}>
                        <p>Once we&apos;re done counting all that pesky trash...</p>
                    </div>
                </div>

                {/* GIF */}
                <div className={styles.step}>
                    <div className={styles.rightContent}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/ViewStats.gif"
                            alt="Stream Viewer animation"
                            className={styles.gifOriginal}
                        />
                    </div>
                </div>

                {/* Text below GIF */}
                <div className={styles.step}>
                    <div className={styles.textBlock}>
                        <p>...see the results in the Stream Viewer!</p>
                    </div>
                </div>
            </main>
        </div>
    );



}
