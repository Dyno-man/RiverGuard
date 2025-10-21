"use client";
import styles from "./page.module.css";
import Navbar from "@/app/components/navbar.js";

export default function Stats(){
    return(
        <div className={styles.page}>
            < Navbar/>
            <main>
                <div className={styles.text}>
                    <div className={styles.statBox}>

                    </div>
                    <div className={styles.streamBox}>
                        <iframe
                            width="100%"
                            height="100%"
                            src="https://www.youtube.com/embed/1Onr4z2fdDM"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title="Dracula Flow: The Official Saga"
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}