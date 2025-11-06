"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";

export default function About() {
    const [openFile, setOpenFile] = useState(null);

    const teamMembers = [
        { src: "/IMG_9760.JPG", file: "/Grant.pdf", name: "Grant" },
        { src: "/IMG_9761.PNG", file: "/Collin.pdf", name: "Collin" },
        { src: "/IMG_9760.JPG", file: "/Wyatt.pdf", name: "Wyatt" },
        { src: "/IMG_9761.PNG", file: "/Pedro.pdf", name: "Pedro" },
        { src: "/GRG.jpg", file: "/files/Team5_Portfolio.pdf", name: "Geshlee" },
    ];

    const toggleFile = (name) => {
        setOpenFile(openFile === name ? null : name);
    };

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <h1 className={styles.header}>Who are we?</h1>

                <section className={styles.section}>
                    <h2>Our Mission</h2>
                    <p>
                        We aim to deliver innovative, high-quality digital solutions that combine
                        creativity, collaboration, and technology to exceed client expectations.
                    </p>
                </section>

                <section className={`${styles.section} ${styles.teamSection}`}>
                    <h2>Our Team</h2>
                    <div className={styles.teamContainer}>
                        {/* LEFT: team grid */}


                        <div className={styles.teamGrid}>
                            {/* Top row: 3 images */}
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
                                                width={300}       // image width
                                                height={280}      // image height
                                                style={{ objectFit: "contain", borderRadius: "10px" }}
                                            />
                                        </div>
                                        <p className={styles.memberName}>{member.name}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Bottom row: 2 images centered */}
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
                                                style={{ objectFit: "contain", borderRadius: "10px" }}
                                            />
                                        </div>
                                        <p className={styles.memberName}>{member.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>



                        {/* RIGHT: text area + overlay resume */}
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

                <section className={styles.section}>
                    <h2>Our Method</h2>
                    <p>
                        Our process emphasizes communication, adaptability, and continuous
                        improvement — ensuring that every project is refined, scalable, and
                        purpose-driven.
                    </p>
                </section>
            </main>
        </div>
    );
}

