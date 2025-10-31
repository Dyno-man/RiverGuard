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
    const [searchQuery, setSearchQuery] = useState("SeniorProjectTestVideo-mp4");
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState("SeniorProjectTestVideo-mp4");

    // Fetch video data when selectedUserId changes
    useEffect(() => {
        let cancelled = false;
        async function fetchLatest() {
            if (!selectedUserId) return;
            
            try {
                setLoading(true);
                setError("");
                // Fetch video by userId from videos collection
                const res = await fetch(`/api/videos/${encodeURIComponent(selectedUserId)}`, { cache: "no-store" });
                if (cancelled) return;
                
                if (!res.ok) {
                    if (res.status === 404) {
                        throw new Error('Video not found for this location');
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
    }, [selectedUserId]);

    // Fetch search suggestions as user types (only when they've typed at least 1 character)
    useEffect(() => {
        let cancelled = false;
        async function fetchSuggestions() {
            const trimmedQuery = searchQuery.trim();
            if (trimmedQuery.length < 1) {
                setSearchSuggestions([]);
                setShowSuggestions(false);
                return;
            }

            try {
                const res = await fetch(`/api/videos?search=${encodeURIComponent(trimmedQuery)}`, { cache: "no-store" });
                if (cancelled) return;
                
                if (res.ok) {
                    const json = await res.json();
                    if (!cancelled && json?.data) {
                        const suggestions = json.data.slice(0, 10); // Limit to 10 suggestions
                        setSearchSuggestions(suggestions);
                        // Only show suggestions if there are results
                        setShowSuggestions(suggestions.length > 0);
                    } else {
                        setSearchSuggestions([]);
                        setShowSuggestions(false);
                    }
                }
            } catch (e) {
                if (!cancelled) {
                    console.error('Error fetching suggestions:', e);
                    setSearchSuggestions([]);
                    setShowSuggestions(false);
                }
            }
        }

        const timeoutId = setTimeout(() => {
            fetchSuggestions();
        }, 300); // Debounce search

        return () => {
            cancelled = true;
            clearTimeout(timeoutId);
        };
    }, [searchQuery]);

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

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        // Only show suggestions if they've typed something
        if (value.trim().length > 0) {
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
            setSearchSuggestions([]);
        }
    };

    const handleSelectUserId = (userId) => {
        setSelectedUserId(userId);
        setSearchQuery(userId);
        setShowSuggestions(false);
        setSearchSuggestions([]);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setSelectedUserId(searchQuery.trim());
            setShowSuggestions(false);
        }
    };

    const handleSearchFocus = () => {
        // Only show suggestions if there's text and suggestions available
        if (searchQuery.trim().length > 0 && searchSuggestions.length > 0) {
            setShowSuggestions(true);
        }
    };

    return(
        <div className={styles.container}>
            <main className={styles.main}>
                {/* Top Section - Info Boxes and Search */}
                <div className={styles.topSection}>
                    <div className={styles.infoBox}>
                        <span className={styles.infoLabel}>Uploaded</span>
                        {latest && uploadDate && (
                            <div className={styles.infoValue}>{new Date(uploadDate).toLocaleString()}</div>
                        )}
                    </div>
                    <div className={styles.searchBox}>
                        <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
                            <input
                                type="text"
                                placeholder="Search by location name..."
                                className={styles.searchInput}
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onFocus={handleSearchFocus}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            />
                            {showSuggestions && searchSuggestions.length > 0 && (
                                <div className={styles.suggestionsList}>
                                    {searchSuggestions.map((item, index) => (
                                        <div
                                            key={index}
                                            className={styles.suggestionItem}
                                            onClick={() => handleSelectUserId(item.userId)}
                                            onMouseDown={(e) => e.preventDefault()}
                                        >
                                            <div className={styles.suggestionUserId}>{item.userId}</div>
                                            {item.videoFilename && (
                                                <div className={styles.suggestionFilename}>{item.videoFilename}</div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </form>
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
                        <div className={styles.noDataMessage}>No information found for location: {selectedUserId || "search for a location"}</div>
                    )}
                </div>
            </main>
        </div>
    );
}