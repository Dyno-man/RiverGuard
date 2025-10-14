"use client";
import { useState } from "react";
import styles from "@/app/components/login.module.css";

export default function Login({ onLoginSuccess }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        // 🔹 Example static check (replace with your backend call)
        // if (username === "admin" && password === "password123") {
        //     localStorage.setItem("authToken", "mockToken123");
        //     onLoginSuccess?.();
        // } else {
        //     setError("Invalid credentials. Please try again.");
        // }
        // 🔹 TEMPORARY TEST LOGIN (accepts any credentials)
        localStorage.setItem("abc", "123");
        onLoginSuccess?.();

    };

    return (
        <div className={styles.container}>
            <div className={styles.loginBox}>
                <h2 className={styles.title}>Login</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        type="text"
                        placeholder="Username"
                        className={styles.input}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className={styles.input}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && <p className={styles.error}>{error}</p>}
                    <button type="submit" className={styles.loginBtn}>
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}
