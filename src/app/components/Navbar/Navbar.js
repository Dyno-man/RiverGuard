"use client"

import { useState} from "react";
import styles from "@/app/components/Navbar/navbar.module.css";
import Link from "next/link";
import ContactUs from "@/app/components/ContactUs/ContactUs.js";
import {usePathname} from "next/navigation";

export default function Navbar(){
    const pathname = usePathname();
    const [showContact, setShowContact] = useState(false);

    return (
       <div className={styles.navbar}>

           <div className={styles.logo}>
               <Link href={"/"}><h1>RiverGuard</h1></Link>
           </div>

           <div className={styles.list}>
               <nav className={"navbar"}>
                   <ul>
                       <li className={pathname === "/about" ? styles.active : ""}>
                           <Link href={"/about"}>About Us</Link>
                       </li>

                       <li className={pathname === "/dashboard" ? styles.active : ""}>
                           <Link href={"/dashboard"}>Dashboard</Link>
                       </li>

                       <li className={pathname === "/donate" ? styles.active : ""}>
                           <Link href={"/donate"}>Donate</Link>
                       </li>
                   </ul>
               </nav>
           </div>

           <div className={styles.rightButtons}>
               <div className={styles.contactButton} onClick={() => setShowContact(true)}>
                   <h1>Contact Us</h1>
               </div>
               {showContact &&  <ContactUs onClose={() => setShowContact(false)} />}
           </div>

       </div>
    );
}