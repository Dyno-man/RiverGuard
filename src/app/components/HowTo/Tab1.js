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
                    <h2 className={styles.title}>Go Find Trash</h2>
                </div>
            </div>

            <div className={styles.step}>
                <div className={styles.row}>
                    <Video className={styles.icon} />
                    <div className={styles.textBlock}>
                        <p>Found a video?</p>
                        <p>Already have your own?</p>
                    </div>
                </div>
            </div>

            <div className={styles.step}>
                <div className={styles.row}>
                    <Camera className={styles.icon} />
                    <p>Send them all</p>
                    <Link href="/dashboard">
                        <button className={styles.action}>here!</button>
                    </Link>
                </div>

            </div>


        </main>
    );
}
