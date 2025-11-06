"use client";

import { useState } from "react";
import styles from "./howto.module.css";
import Tab1 from "./Tab1";
import Tab2 from "./Tab2";
import Tab3 from "./Tab3";

export default function HowTo() {
    const [activeTab, setActiveTab] = useState(1);

    return (
        <div>
            <main className={styles.howto}>
                <div className={styles.headerText}>
                    <h1>How Do I Start?</h1>
                    <br/>
                    <h2>It&#39;s as easy as</h2>
                    <br/>
                </div>
                <div className={styles.tabs}>
                    {[1, 2, 3].map((num) => (
                        <div
                            key={num}
                            className={`${styles.tab} ${activeTab === num ? styles.active : ""}`}
                            onClick={() => setActiveTab(num)}
                        >
                            <div className={styles.tabNumber}>{num}</div>
                        </div>
                    ))}
                </div>

                <div className={styles.divider}></div>

                <div className={styles.steps}>
                    {activeTab === 1 && <Tab1 />}
                    {activeTab === 2 && <Tab2 />}
                    {activeTab === 3 && <Tab3 />}
                </div>
            </main>
        </div>
    );
}
