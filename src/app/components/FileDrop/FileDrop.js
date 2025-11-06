"use client";

import { useState, useEffect } from "react";
import styles from "@/app/components/FileDrop/filedrop.module.css";

export default function FileDrop() {
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [url, setUrl] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [items, setItems] = useState([]);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [userIdInput, setUserIdInput] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);


    useEffect(() => {
        let dragCounter = 0;

        const handleDragEnter = (e) => { e.preventDefault(); dragCounter++; setIsDragging(true); };

        const handleDragLeave = (e) => { e.preventDefault(); dragCounter--; if (dragCounter === 0) setIsDragging(false); };

        const handleDrop = (e) => {
            e.preventDefault();
            dragCounter = 0;
            setIsDragging(false);

            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                const filesArray = Array.from(e.dataTransfer.files).map(file => ({
                    type: "file",
                    name: file.name,
                    file
                }));
                setItems(prev => [...prev, ...filesArray]);
                e.dataTransfer.clearData();
            }
        };

        const handleDragOver = (e) => e.preventDefault();

        window.addEventListener("dragenter", handleDragEnter);
        window.addEventListener("dragleave", handleDragLeave);
        window.addEventListener("drop", handleDrop);
        window.addEventListener("dragover", handleDragOver);

        return () => {
            window.removeEventListener("dragenter", handleDragEnter);
            window.removeEventListener("dragleave", handleDragLeave);
            window.removeEventListener("drop", handleDrop);
            window.removeEventListener("dragover", handleDragOver);
        };
    }, []);

    const handleFileChange = (e) => {
        const filesArray = Array.from(e.target.files).map(file => ({
            type: "file",
            name: file.name,
            file
        }));
        setItems(prev => [...prev, ...filesArray]);
    };

    const handleUrlSubmit = (e) => {
        e.preventDefault();
        if (url.trim()) {
            setItems(prev => [...prev, { type: "url", name: url, url }]);
            setUrl("");
            setShowUrlInput(false);
        }
    };

    const handleCancel = () => {
        setShowUrlInput(false);
        setUrl("");
    };

    const handleDelete = (index) => {
        setItems(prev => prev.filter((_, i) => i !== index));
    };

    // File Upload to Backend Computer thingy

    const handleSubmit = async () => {
        if (items.length === 0) return;
        setIsSubmitting(true);   // Start spinner
        setSubmitStatus(null);   // Clear previous status

        try {
            const formData = new FormData();
            items.forEach((item, index) => {
                if (item.type === "file" && item.file) formData.append(`file_${index}`, item.file);
                else if (item.type === "url") formData.append(`url_${index}`, item.url);
            });

            const userId = userIdInput.trim()
                ? userIdInput.trim().replace(/\W+/g, '-').slice(0, 50)
                : (items[0]?.name || "web-upload").replace(/\W+/g, '-').slice(0, 50);
            formData.append("userId", userId);

            const response = await fetch("http://192.155.92.114/api/fileUpload", {
                method: "POST",
                body: formData
            });

            if (!response.ok) throw new Error(`Upload failed: ${response.statusText}`);

            setSubmitStatus("success");

            // Clear items after success
            setTimeout(() => {
                setItems([]);
                setUserIdInput("");
                setSubmitStatus(null);
            }, 2000);
        } catch (error) {
            console.error("Upload error:", error);
            setSubmitStatus("error");

            setTimeout(() => setSubmitStatus(null), 3000);
        } finally {
            setIsSubmitting(false); // Stop spinner
        }
    };


    return (
        <>
            {isDragging && ( <div className={styles.dragOverlay}>Drop file anywhere to upload</div>)}

            <div className={styles.container}>
                <div className={styles.dropbox}>
                    {/* Only show upload section if no items */}
                    {items.length === 0 && !showUrlInput && (
                        <div className={styles.content}>
                            <label className={styles.selectBtn}>
                                Upload Stream
                                <input type="file" className={styles.hiddenInput} onChange={handleFileChange}/>
                            </label>
                            <p className={styles.text}>or drop a file anywhere{/*below, paste a URL{" "}*/}
                                {/*<button type="button" className={styles.linkBtn} onClick={() => setShowUrlInput(true)}>here</button>*/}
                            </p>
                        </div>
                    )}

                    <div className={`${styles.popupBox} ${showUrlInput ? styles.show : styles.hide}`}>
                        <form onSubmit={handleUrlSubmit} className={styles.popupForm}>
                            <input
                                type="text"
                                className={styles.inputBox}
                                placeholder="Enter stream link"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                autoFocus
                            />
                            <div className={styles.buttonGroup}>
                                <button type="button" className={styles.btn} onClick={handleCancel}>Cancel</button>
                                <button type="submit" className={styles.btn}>Add</button>
                            </div>
                        </form>
                    </div>

                    {/* Display added files/URLs */}
                    {items.length > 0 && (
                        <div className={styles.addedItems}>
                            {items.map((item, index) => (
                                <div key={index} className={styles.itemRow}>
                                    <span className={styles.itemName} style={{ fontSize: `${Math.max(12, 40 - item.name.length)}px` }}>{item.name}</span>
                                    <button className={styles.deleteBtn} onClick={() => handleDelete(index)}>×</button>
                                </div>

                            ))}
                            <input
                                type="text"
                                placeholder="Enter Location Name"
                                value={userIdInput}
                                onChange={(e) => setUserIdInput(e.target.value)}
                                required
                                className={styles.inputBox}
                            />
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "12px" }}>
                                {!isSubmitting && !submitStatus && (
                                    <button className={styles.btn} onClick={handleSubmit}>Submit</button>
                                )}

                                {isSubmitting && (
                                    <div className={styles.spinner}></div>
                                )}

                                {submitStatus && (
                                    <div className={`${styles.statusBox} ${submitStatus === "success" ? styles.success : styles.error}`}>
                                        {submitStatus === "success" ? "File submitted successfully!" : "File submission failed. Please try again."}
                                    </div>
                                )}
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

