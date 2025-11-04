"use client"

import {useState ,useRef, useEffect} from "react";
import styles from "./contactus.module.css"


export default function ContactUs({onClose}){

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Sending to placeholder@email.com:", formData);
        alert("Your message has been sent!");
        setFormData({ name: "", email: "", message: "" });
        onClose();
    };

    return(
        <div className={styles.container}>
            <div className={styles.wrapper}>
            <div ref={modalRef} className={styles.contactUs}>
                <div className={styles.headerText}>
                    <h1>Contact Us</h1>
                    <h2>We’d love to hear from you</h2>
                </div>

                <div className={styles.divider}></div>

                <form className={styles.content} onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className={styles.searchInput}
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={styles.searchInput}
                    />

                    <textarea
                        name="message"
                        placeholder="Your Message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className={styles.textareaInput}
                    />

                    <div className={styles.buttonRow}>
                        <button type="submit" className={styles.action}>
                            Submit
                        </button>
                    </div>
                </form>
            </div>
            </div>
        </div>
    );
}