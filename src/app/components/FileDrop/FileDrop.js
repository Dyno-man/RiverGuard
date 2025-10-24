"use client";

import { useState, useEffect } from "react";
import styles from "@/app/components/FileDrop/filedrop.module.css";

export default function FileDrop() {
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [url, setUrl] = useState("");
    const [isDragging, setIsDragging] = useState(false); // full-page drag state

    useEffect(() => {
        let dragCounter = 0;

        const handleDragEnter = (e) => {
            e.preventDefault();
            dragCounter++;
            setIsDragging(true);
        };

        const handleDragLeave = (e) => {
            e.preventDefault();
            dragCounter--;
            if (dragCounter === 0) setIsDragging(false);
        };

        const handleDrop = (e) => {
            e.preventDefault();
            dragCounter = 0;
            setIsDragging(false);
        };

        window.addEventListener("dragenter", handleDragEnter);
        window.addEventListener("dragleave", handleDragLeave);
        window.addEventListener("drop", handleDrop);
        window.addEventListener("dragover", (e) => e.preventDefault());

        return () => {
            window.removeEventListener("dragenter", handleDragEnter);
            window.removeEventListener("dragleave", handleDragLeave);
            window.removeEventListener("drop", handleDrop);
            window.removeEventListener("dragover", (e) => e.preventDefault());
        };
    }, []);

    const handleFileChange = (e) => {
        e.preventDefault();
    };

    const handleUrlSubmit = (e) => {
        e.preventDefault();
        if (url.trim()) {
            setUrl("");
            setShowUrlInput(false);
        }
    };

    const handleCancel = () => {
        setShowUrlInput(false);
        setUrl("");
    };

    return ( <> {} {isDragging && <div className={styles.dragOverlay}>Drop file anywhere to upload</div>}

            <div className={styles.container}>
                <div className={styles.dropbox}> {} {!showUrlInput && (
                        <div className={styles.content}>
                            <label className={styles.selectBtn}>Upload Stream
                                <input type="file" className={styles.hiddenInput} onChange={handleFileChange}/>
                            </label>
                            <p className={styles.text}>or drop a file below, <br />paste a URL{" "}
                                <button type="button" className={styles.linkBtn} onClick={() => setShowUrlInput(true)}>
                                    here
                                </button>
                            </p>
                        </div>
                    )}

                    {}
                    <div className={`${styles.popupBox} ${showUrlInput ? styles.show : styles.hide}`}>
                        <form onSubmit={handleUrlSubmit} className={styles.popupForm}>
                            <input type="text" className={styles.urlInput} placeholder="Enter stream link" value={url}
                                onChange={(e) => setUrl(e.target.value)} autoFocus/>
                            <div className={styles.buttonGroup}>
                                <button type="button" className={styles.cancelBtn} onClick={handleCancel}>Cancel</button>
                                <button type="submit" className={styles.submitBtn}>Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
