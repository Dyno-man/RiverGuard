"use client";

import { useState } from "react";
import styles from "@/app/components/signup.module.css";

export default function Signup() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Signup data:", formData);
        setShowPopup(false);
    };

    return (
            <div className={styles.signupBox}>
                <h2 className={styles.title}>Welcome!</h2>
                <p className={styles.text}>Create your account to get started.</p>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <input
                        className={styles.input}
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        className={styles.input}
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        className={styles.input}
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit" className={styles.signupBtn}>
                        Create Account
                    </button>
                </form>
            </div>
    );
}
