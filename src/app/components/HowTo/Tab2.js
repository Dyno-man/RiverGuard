"use client";

import styles from "./howto.module.css";
import { Upload, FileText, Box } from "lucide-react";

export default function Tab2() {
    return (
        <main className={styles.content}>

            {/* Step 1: Header */}
            <div className={styles.step}>
                <div className={styles.header}>
                    <Upload className={styles.icon} />
                    <h2 className={styles.title}>Head to our Dashboard</h2>
                </div>
            </div>

            {/* Step 2: Icon above text, GIF on right */}
            <div className={`${styles.step} ${styles.tallStep}`}>
                <div className={styles.rowBetween}>
                    {/* Left side: icon above text */}
                    <div className={styles.leftContent}>
                        <FileText className={styles.iconLarge} />
                        <div className={styles.textBlock}>
                            <p>Here you can submit files or links</p>
                        </div>
                    </div>

                    {/* Right side: GIF (original size) */}
                    <div className={styles.rightContent}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/FileDrop.gif"
                            alt="File drop animation"
                            className={styles.gifOriginal}
                        />
                    </div>
                </div>
            </div>

            {/* Step 3: Instructional Text */}
            <div className={styles.step}>
                <div className={styles.header}>
                    <Box className={styles.icon} />
                    <div className={styles.textBlock}>
                        <p>Attach a file/link in our drop box and give it a name</p>
                    </div>
                </div>
            </div>

        </main>
    );
}
