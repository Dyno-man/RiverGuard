import styles from "@/app/components/navbar.module.css";
import Link from "next/link";
export default function navbar(){
    return (
       <div className={styles.navbar}>
           <div className={styles.logo}>
               <h1>RiverGuard</h1>
           </div>
           <div className={styles.list}>
               <nav className={"navbar"}>
                   <ul>
                       <li>
                           <Link href={"/about"}>About Us</Link>
                       </li>
                       <li>
                           <Link href={"/stats"}>Stats</Link>
                       </li>
                       <li>
                           <Link href={"/donate"}>Donate</Link>
                       </li>
                   </ul>
               </nav>
           </div>
           <div className={styles.contact}>
               <h1>Contact Us</h1>
           </div>
</div>

    );
}