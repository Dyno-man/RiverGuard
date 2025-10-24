"use client"

import styles from "./page.module.css"
import {useState} from "react";
import Navbar from "@/app/components/Navbar/Navbar.js";
import FileDrop from "@/app/components/FileDrop/FileDrop.js";
import ViewStats from "@/app/components/ViewStats/ViewStats.js";


export default function Dashboard(){
    const [activeTab, setActiveTab] = useState("Upload");
    return(
        <div>
            <Navbar />
            <main className={styles.main}>

                <div className={styles.tabs}>
                    {["Upload", "View"].map((tab) => (
                        <div
                            key={tab}
                            className={`${styles.tab} ${activeTab === tab ? styles.active : ""}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            <div className={styles.tabText}>{tab}</div>
                        </div>
                    ))}
                </div>

                <div className={styles.divider}></div>

                <div className={styles.boardView}>
                    {activeTab === "Upload" && <FileDrop />}
                    {activeTab === 'View' && <ViewStats />}


                </div>

            </main>

        </div>
    );
}