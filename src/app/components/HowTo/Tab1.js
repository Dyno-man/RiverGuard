"use client";

import styles from "./howto.module.css";
import Link from "next/link";
import { Trash2, Video, Camera } from "lucide-react";

export default function Tab1() {
    return (
        <main className={styles.content}>

            <div className={styles.step}>
                <div className={styles.header}>
                    <Trash2 className={styles.icon} />
                    <h2 className={styles.title}>Find Trash</h2>
                </div>
            </div>

            <div className={styles.step}>
                <div className={styles.row}>
                    <Video className={styles.icon} />
                    <div className={styles.textBlock}>
                        <p>Saw a video?</p>
                        <p>Found a live stream?</p>
                    </div>
                </div>
                <Link href="/dashboard">
                    <button className={styles.action}>Send the Link!</button>
                </Link>
            </div>

            <div className={styles.step}>
                <div className={styles.row}>
                    <Camera className={styles.icon} />
                    <p>Have your own video?</p>
                </div>
                <Link href="/dashboard">
                    <button className={styles.action}>Upload it here!</button>
                </Link>
            </div>


        </main>
    );
}
