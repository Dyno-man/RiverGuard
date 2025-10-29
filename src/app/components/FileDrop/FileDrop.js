"use client";

import { useState, useEffect } from "react";
import styles from "@/app/components/FileDrop/filedrop.module.css";

export default function FileDrop() {
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [url, setUrl] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [items, setItems] = useState([]);
    const [streamName, setStreamName] = useState("");

    useEffect(() => {
        let dragCounter = 0;

        const handleDragEnter = (e) => { e.preventDefault(); dragCounter++; setIsDragging(true); };
        const handleDragLeave = (e) => { e.preventDefault(); dragCounter--; if (dragCounter === 0) setIsDragging(false); };
        const handleDrop = (e) => {
            e.preventDefault();
            dragCounter = 0;
            setIsDragging(false);
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                const filesArray = Array.from(e.dataTransfer.files).map(file => ({ name: file.name, file }));
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
        const filesArray = Array.from(e.target.files).map(file => ({ name: file.name, file }));
        setItems(prev => [...prev, ...filesArray]);
    };

    const handleUrlSubmit = (e) => {
        e.preventDefault();
        if (url.trim()) {
            setItems(prev => [...prev, { name: url, url }]);
            setUrl("");
            setShowUrlInput(false);
        }
    };

    const handleCancel = () => { setShowUrlInput(false); setUrl(""); };
    const handleDelete = (index) => { setItems(prev => prev.filter((_, i) => i !== index)); };

    const handleSubmit = () => {
        if (!streamName.trim()) {
            alert("Please enter a stream name.");
            return;
        }

        // Send to backend (mocked)
        console.log("Submitted:", { streamName, items });

        // Reset everything
        setItems([]);
        setStreamName("");
    };

    return (
        <>
            {isDragging && <div className={styles.dragOverlay}>Drop file anywhere to upload</div>}

            <div className={styles.container}>
                <div className={styles.dropbox}>
                    {/* Upload section */}
                    {items.length === 0 && !showUrlInput && (
                        <div className={styles.content}>
                            <label className={styles.selectBtn}>
                                Upload Stream
                                <input type="file" className={styles.hiddenInput} onChange={handleFileChange} />
                            </label>
                            <p className={styles.text}>
                                or drop a file below, paste a URL{" "}
                                <button type="button" className={styles.linkBtn} onClick={() => setShowUrlInput(true)}>here</button>
                            </p>
                        </div>
                    )}

                    <div className={`${styles.popupBox} ${showUrlInput ? styles.show : styles.hide}`}>
                        <form onSubmit={handleUrlSubmit} className={styles.popupForm}>
                            <input
                                type="text"
                                className={styles.urlInput}
                                placeholder="Enter stream link"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                autoFocus
                            />
                            <div className={styles.buttonGroup}>
                                <button type="button" className={styles.cancelBtn} onClick={handleCancel}>Cancel</button>
                                <button type="submit" className={styles.submitBtn}>Add</button>
                            </div>
                        </form>
                    </div>

                    {/* Display added files/URLs */}
                    {items.length > 0 && (
                        <div className={styles.addedItems}>
                            {items.map((item, index) => (
                                <div key={index} className={styles.itemRow}>
                                    <span className={styles.itemName}>{item.name}</span>
                                    <button className={styles.deleteBtn} onClick={() => handleDelete(index)}>×</button>
                                </div>
                            ))}

                            {/* Stream Name input */}
                            <input
                                type="text"
                                placeholder="Enter Stream Name"
                                value={streamName}
                                onChange={(e) => setStreamName(e.target.value)}
                                required
                                className={styles.inputBox}
                            />

                            <button className={styles.submitBtnBottom} onClick={handleSubmit}>Submit</button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
