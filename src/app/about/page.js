"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";

export default function About() {
    const [openFile, setOpenFile] = useState(null);

    const teamMembers = [
        { src: "/Grant.jpeg", file: "/Grant.pdf", name: "Grant" },
        { src: "/Collin.jpeg", file: "/Collin.pdf", name: "Collin" },
        { src: "/Wyatt.jpeg", file: "/Wyatt.pdf", name: "Wyatt" },
        { src: "/Pedro.jpeg", file: "/Pedro.pdf", name: "Pedro" },
        { src: "/GRG.jpg", file: "/Geshlee.pdf", name: "Geshlee" },
    ];

    const toggleFile = (name) => {
        setOpenFile(openFile === name ? null : name);
    };

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <h1 className={styles.header}>Who are we?</h1>

                {/* --- Mission Section --- */}
                <section className={styles.section}>
                    <h2>Our Mission</h2>
                    <div className={styles.sectionContent}>
                        <p>
                            Trash is lame...and it&#39;s in our rivers!!! Our mission is to help
                            address the issue. With <strong>RiverGuard</strong>, we can help
                            non-profits and pollution control address the severity of pollution
                            in rivers across the world. We wish to create a community that works
                            together to clean up our rivers!
                        </p>

                        <div className={styles.sectionImageWrapper}>
                            <Image
                                src="/River.webp"
                                alt="River cleanup mission"
                                width={600}
                                height={350}
                                className={styles.sectionImage}
                            />
                        </div>
                    </div>
                </section>

                {/* --- Team Section --- */}
                <section className={`${styles.section} ${styles.teamSection}`}>
                    <h2>Our Team</h2>
                    <div className={styles.teamContainer}>
                        <div className={styles.teamGrid}>
                            <div className={styles.topRow}>
                                {teamMembers.slice(0, 3).map((member, idx) => (
                                    <div
                                        key={idx}
                                        className={styles.teamItem}
                                        onClick={() => toggleFile(member.name)}
                                    >
                                        <div className={styles.teamImageWrapper}>
                                            <Image
                                                src={member.src}
                                                alt={member.name}
                                                width={300}
                                                height={280}
                                                style={{
                                                    objectFit: "contain",
                                                    borderRadius: "10px",
                                                }}
                                            />
                                        </div>
                                        <p className={styles.memberName}>{member.name}</p>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.bottomRow}>
                                {teamMembers.slice(3, 5).map((member, idx) => (
                                    <div
                                        key={idx}
                                        className={styles.teamItem}
                                        onClick={() => toggleFile(member.name)}
                                    >
                                        <div className={styles.teamImageWrapper}>
                                            <Image
                                                src={member.src}
                                                alt={member.name}
                                                width={300}
                                                height={280}
                                                style={{
                                                    objectFit: "contain",
                                                    borderRadius: "10px",
                                                }}
                                            />
                                        </div>
                                        <p className={styles.memberName}>{member.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.teamDescription}>
                            <p>
                                Our team is made up of creative, driven individuals who bring
                                diverse skills and perspectives to every project. We collaborate
                                closely to design, develop, and deliver innovative digital
                                experiences with precision and care.
                            </p>

                            {openFile && (
                                <iframe
                                    src={teamMembers.find((m) => m.name === openFile).file}
                                    title={`${openFile}'s file`}
                                    className={styles.overlayFrame}
                                />
                            )}
                        </div>
                    </div>
                </section>

                {/* --- Method Section --- */}
                <section className={styles.section}>
                    <h2>Our Method</h2>
                    <div className={styles.sectionContent}>
                        <p>
                            We utilize a computer vision model, YOLOv12n to monitor footage. This fast and lightweight model helps us pick out trash from your videos and keep track of how polluted these rivers are. Trained on two whole datasets, it is built to scan video frames and point out that pesky trash!!!
                        </p>

                        <div className={styles.sectionImageWrapper}>
                            <Image
                                src="/Model.png"
                                alt="RiverGuard AI method"
                                width={600}
                                height={350}
                                className={styles.sectionImage}
                            />
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
