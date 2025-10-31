"use client"

import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import styles from "./viewstats.module.css";

// Dynamically import chart to avoid SSR issues with Recharts
const GarbageChart = dynamic(() => import('./GarbageChart'), { 
    ssr: false,
    loading: () => <div className={styles.placeholderText}>Loading chart...</div>
});

export default function ViewStats(){
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [latest, setLatest] = useState(null);
    
    // For testing - using the userId from the provided data
    const testUserId = "SeniorProjectTestVideo-mp4";

    useEffect(() => {
        let cancelled = false;
        async function fetchLatest() {
            try {
                setLoading(true);
                setError("");
                // Fetch video by userId from videos collection
                const res = await fetch(`/api/videos/${encodeURIComponent(testUserId)}`, { cache: "no-store" });
                if (cancelled) return;
                
                if (!res.ok) {
                    if (res.status === 404) {
                        throw new Error('Video not found for this userId');
                    }
                    throw new Error(`Failed to fetch video information (${res.status})`);
                }
                const json = await res.json();
                if (!cancelled && json?.data !== undefined) {
                    setLatest(json.data);
                }
            } catch (e) {
                if (!cancelled) {
                    setError(e?.message || "Failed to load stats");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }
        fetchLatest();
        return () => { 
            cancelled = true;
        };
    }, [testUserId]);

    const framesProcessed = latest?.framesProcessed ?? null;
    const totalGarbageCount = latest?.totalGarbageCount ?? null;
    const garbageCounts = Array.isArray(latest?.garbageCountPerFrame) ? latest.garbageCountPerFrame : [];
    const avgGarbage = garbageCounts.length
        ? (garbageCounts.reduce((a, b) => a + (typeof b === "number" ? b : 0), 0) / garbageCounts.length)
        : null;
    
    // Prepare chart data
    const chartData = garbageCounts.map((count, index) => ({
        frame: index,
        garbage: typeof count === "number" ? count : 0
    }));
    // Handle Firestore timestamp conversion - with safe null checks
    let uploadDate = null;
    try {
        if (latest?.uploadDate) {
            if (typeof latest.uploadDate.toDate === 'function') {
                uploadDate = latest.uploadDate.toDate();
            } else if (latest.uploadDate.seconds) {
                uploadDate = new Date(latest.uploadDate.seconds * 1000);
            } else if (latest.uploadDate instanceof Date) {
                uploadDate = latest.uploadDate;
            } else {
                uploadDate = latest.uploadDate;
            }
        } else if (latest?.createdAt) {
            if (typeof latest.createdAt.toDate === 'function') {
                uploadDate = latest.createdAt.toDate();
            } else if (latest.createdAt.seconds) {
                uploadDate = new Date(latest.createdAt.seconds * 1000);
            } else {
                uploadDate = latest.createdAt;
            }
        }
    } catch (err) {
        console.error('Error converting timestamp:', err);
        uploadDate = null;
    }
    
    const userId = latest?.userId || latest?.streamID || "";
    const videoFilename = latest?.videoFilename || latest?.url || "";

    return(
        <div className={styles.container}>
            <main className={styles.main}>
                {/* Top Section - Info Boxes */}
                <div className={styles.topSection}>
                    <div className={styles.infoBox}>
                        <span className={styles.infoLabel}>Uploaded</span>
                        {latest && uploadDate && (
                            <div className={styles.infoValue}>{new Date(uploadDate).toLocaleString()}</div>
                        )}
                    </div>
                    <div className={styles.infoBox}>
                        <span className={styles.infoLabel}>Location</span>
                        {latest && userId && (
                            <div className={styles.infoValue}>{userId}</div>
                        )}
                    </div>
                </div>

                {/* Center Section - Graph Area */}
                <div className={styles.graphArea}>
                    {loading && <div className={styles.placeholderText}>Loading...</div>}
                    {!loading && error && <div className={styles.placeholderText}>{error}</div>}
                    {!loading && !error && latest && chartData.length > 0 && (
                        <GarbageChart data={chartData} />
                    )}
                    {!loading && !error && latest && chartData.length === 0 && (
                        <div className={styles.placeholderText}>No frame data available</div>
                    )}
                    {!loading && !error && !latest && (
                        <div className={styles.placeholderText}>No data available</div>
                    )}
                </div>

                {/* Bottom Section - Detailed Stats */}
                <div className={styles.statsSection}>
                    {loading && <div className={styles.loadingMessage}>Loading...</div>}
                    {!loading && error && <div className={styles.errorMessage}>{error}</div>}
                    {!loading && !error && latest && (
                        <div className={styles.statsContent}>
                            <div className={styles.leftColumn}>
                                <div className={styles.statRow}><strong>Location:</strong> {userId}</div>
                                <div className={styles.statRow}><strong>Video:</strong> {String(videoFilename)}</div>
                                <div className={styles.statRow}><strong>Uploaded:</strong> {uploadDate ? new Date(uploadDate).toLocaleString() : "-"}</div>
                                <div className={styles.statRow}><strong>Seconds processed:</strong> {framesProcessed ?? "-"}</div>
                                <div className={styles.statRow}><strong>Total garbage count:</strong> {totalGarbageCount ?? "-"}</div>
                                <div className={styles.statRow}><strong>Avg garbage/frame:</strong> {avgGarbage !== null ? avgGarbage.toFixed(2) : "-"}</div>
                            </div>
                        </div>
                    )}
                    {!loading && !error && !latest && (
                        <div className={styles.noDataMessage}>No information found for userId: {testUserId}</div>
                    )}
                </div>
            </main>
        </div>
    );
}