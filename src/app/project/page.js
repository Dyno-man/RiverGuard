"use client"

import styles from "./page.module.css"
import Image from "next/image.d.ts";

export default function Project(){

    return(
        <div className="page">
            <main className={styles.main}>
                <h1>INDY 500 - RiverGuard</h1>
                <h2>CS 4850: Fall 2025</h2>
                <br/><br/>
                <div className={styles.team}>
                    <div className={styles.teamMember}>
                        <div className={styles.headshot}>
                    <Image
                        src={"/Grant.jpeg"}
                        alt={"member.name"}
                        width={300}
                        height={280}
                        style={{
                            objectFit: "contain",
                            borderRadius: "10px",
                        }}
                    />
                        </div>
                        <div className={styles.bio}>
                            <h3>Grant Versluis - Software Architect</h3>
                            <pre>I’m Grant Versluis Interning at Assurant,
                            Current Senior at KSU for CS, and into embedded Systems.</pre></div>
                    </div>
                    <div className={styles.teamMember}>
                        <div className={styles.headshot}>
                            <Image
                                src={"/GRG.JPG"}
                                alt={"member.name"}
                                width={300}
                                height={280}
                                style={{
                                    objectFit: "contain",
                                    borderRadius: "10px",
                                }}
                            />
                        </div>

                        <div className={styles.bio}>
                            <h3>Geshlee Ruiz - Software Engineer</h3>
                            <pre>I&#39;m Geshlee Ruiz, graduating senior at
                            KSU, and I&#39;m interested in frontend development</pre></div>
                    </div>
                    <div className={styles.teamMember}>
                        <div className={styles.headshot}>
                            <Image
                                src={"/Pedro.jpeg"}
                                alt={"member.name"}
                                width={300}
                                height={280}
                                style={{
                                    objectFit: "contain",
                                    borderRadius: "10px",
                                }}
                            />
                        </div>
                        <div className={styles.bio}>
                            <h3>Pedro Pinto - Information Architect & Software Engineer</h3>
                            <pre>I&#39;m Pedro Pinto and I&#39;m senior student at KSU for CS</pre></div>
                    </div>

                </div>
                <br/>
                <div className={styles.team}>
                    <div className={styles.teamMember}>
                        <div className={styles.headshot}>
                            <Image
                                src={"/Collin.jpeg"}
                                alt={"member.name"}
                                width={300}
                                height={280}
                                style={{
                                    objectFit: "contain",
                                    borderRadius: "10px",
                                }}
                            />
                        </div>
                        <div className={styles.bio}>
                            <h3>Collin Tucker - Team Lead</h3>
                            <pre>I&#39;m Collin Tucker interning at Start Day One, Current Senior at KSU for CS, and interested in AI and Automation.</pre></div>
                    </div>
                    <div className={styles.teamMember}>
                        <div className={styles.headshot}>
                            <Image
                                src={"/Wyatt.jpeg"}
                                alt={"member.name"}
                                width={300}
                                height={280}
                                style={{
                                    objectFit: "contain",
                                    borderRadius: "10px",
                                }}
                            />
                        </div>

                        <div className={styles.bio}>
                            <h3>Wyatt Bramlett - Agile Project Coordinator</h3>
                            <pre>My name is Wyatt and I am a Cs student at KSU</pre></div>
                    </div>

                </div>
                <br/><br/>
                <h2>Project Report</h2>
                <iframe
                    src={"/Indy500-RiverGuard-FinalReport.pdf"}
                    title={`Final Report`}
                    className={styles.report}
                />
                <br/><br/>
                <h2>Github</h2>
                <h3>

                    <a
                        href="https://github.com/CollinT123/RiverGuard"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#359ca8", textDecoration: "underline" }}
                    >
                        RiverGuard GitHub
                    </a>
                </h3>
                <br/><br/>

                <h2>

                    <a
                        href="https://www.youtube.com/watch?v=QTQ2G76Oi5I&t=3s"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#359ca8", textDecoration: "underline" }}
                    >
                       Demo Video
                    </a>
                </h2>
                <br/><br/>
                <div className={styles.space}>
                    <pre>


                    </pre>
                </div>
            </main>

        </div>
    );
}