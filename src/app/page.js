import Image from "next/image";
import styles from "./page.module.css";
import Navbar from "@/app/components/navbar.js";
import Dropbox from "@/app/components/dropbox.js";

export default function Home() {
    return (
        <div className={styles.page}>
            <Navbar />
            <main className={styles.main}>
                <div className={styles.welcome}>
                    <h1>UP WITH GUARD DOWN WITH TRASH</h1>
                </div>
                <div className={styles["dropbox-container"]}>
                    <Dropbox />
                </div>
            </main>
            <footer className={styles.footer}>
                <a
                    href="https://nextjs.org/learn"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image src="/file.svg" alt="File icon" width={16} height={16} />
                    Learn
                </a>
                <a
                    href="https://vercel.com/templates?framework=next.js"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image src="/window.svg" alt="Window icon" width={16} height={16} />
                    Examples
                </a>
                <a
                    href="https://nextjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image src="/globe.svg" alt="Globe icon" width={16} height={16} />
                    Go to nextjs.org →
                </a>
            </footer>
        </div>
    );
}
