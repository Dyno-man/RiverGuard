'use client';
import { useState } from 'react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export default function Home() {
    const [mode, setMode] = useState('file'); // 'url' | 'file'
    const [url, setUrl]   = useState('');
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [busy, setBusy] = useState(false);
    const [result, setResult] = useState(null);
    const [msg, setMsg] = useState('');

    async function onAnalyze(e) {
        e.preventDefault();
        setBusy(true); 
        setMsg('Processing video...'); 
        setResult(null);

        if (!title.trim()) {
            setMsg('Please enter a title for this analysis');
            setBusy(false);
            return;
        }

        try {
            let res;
            if (mode === 'file') {
                if (!file) { 
                    setMsg('Please choose a video file'); 
                    setBusy(false);
                    return; 
                }
                const fd = new FormData();
                fd.append('video_file', file);
                fd.append('userId', title); // Using title as userId for now
                res = await fetch(`${BACKEND_URL}/api/analyze-video`, {
                    method: 'POST',
                    body: fd
                });
            } else {
                if (!url) { 
                    setMsg('Please enter a direct .mp4 url'); 
                    setBusy(false);
                    return; 
                }
                // For URL mode, we'll need to implement a different approach
                // For now, show an error message
                setMsg('URL mode not yet implemented for full analysis');
                setBusy(false);
                return;
            }

            if (!res.ok) {
                const err = await res.text();
                setMsg(`Error: ${err}`);
                return;
            }

            const analysisResult = await res.json();
            setResult(analysisResult);
            setMsg('Analysis completed successfully!');
        } catch (err) {
            setMsg(`Error: ${String(err)}`);
        } finally {
            setBusy(false);
        }
    }

    return (
        <main style={{ maxWidth: 800, margin: '2rem auto', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif', padding: '0 1rem' }}>
            <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>
                RiverGuard Video Analysis
            </h1>

            <form onSubmit={onAnalyze} style={{ 
                display: 'grid', 
                gap: '1rem',
                background: '#f9f9f9',
                padding: '2rem',
                borderRadius: '8px',
                border: '1px solid #ddd'
            }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                        Analysis Title / User ID:
                    </label>
                    <input
                        type="text"
                        placeholder="Enter a title or user ID for this analysis"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ 
                            width: '100%', 
                            padding: '12px', 
                            border: '1px solid #ddd', 
                            borderRadius: '8px',
                            fontSize: '16px'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', gap: 16 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <input type="radio" name="mode" value="url" checked={mode === 'url'} onChange={() => setMode('url')} />
                        Use URL
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <input type="radio" name="mode" value="file" checked={mode === 'file'} onChange={() => setMode('file')} />
                        Upload file
                    </label>
                </div>

                {mode === 'url' ? (
                    <input
                        type="url"
                        placeholder="https://…/video.mp4"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        style={{ padding: 12, border: '1px solid #ddd', borderRadius: 8, fontSize: '16px' }}
                    />
                ) : (
                    <input 
                        type="file" 
                        accept="video/*" 
                        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                        style={{ padding: 12, border: '1px solid #ddd', borderRadius: 8, fontSize: '16px' }}
                    />
                )}

                <button type="submit" disabled={busy}
                        style={{ 
                            padding: '12px 24px', 
                            borderRadius: 8, 
                            border: 'none',
                            background: busy ? '#ccc' : '#007bff', 
                            color: 'white',
                            cursor: busy ? 'not-allowed' : 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold'
                        }}>
                    {busy ? 'Processing...' : 'Analyze Video'}
                </button>

                {msg && (
                    <div style={{ 
                        padding: '12px', 
                        borderRadius: '8px',
                        background: msg.includes('Error') ? '#f8d7da' : '#d4edda',
                        color: msg.includes('Error') ? '#721c24' : '#155724',
                        border: `1px solid ${msg.includes('Error') ? '#f5c6cb' : '#c3e6cb'}`
                    }}>
                        {msg}
                    </div>
                )}

                {result && (
                    <div style={{ 
                        marginTop: '1rem',
                        padding: '1rem',
                        background: '#e7f3ff',
                        borderRadius: '8px',
                        border: '1px solid #b3d9ff'
                    }}>
                        <h3 style={{ margin: '0 0 1rem 0', color: '#0066cc' }}>
                            Analysis Results
                        </h3>
                        <div style={{ display: 'grid', gap: '0.5rem' }}>
                            <div><strong>User ID:</strong> {result.userId || title}</div>
                            <div><strong>Status:</strong> {result.success ? '✓ Success' : '✗ Failed'}</div>
                        </div>
                        
                        {result.results && (
                            <div style={{ marginTop: '1rem' }}>
                                <h4 style={{ margin: '0 0 0.5rem 0' }}>Analysis Results:</h4>
                                <pre style={{ 
                                    background: 'white', 
                                    padding: '1rem', 
                                    borderRadius: '4px', 
                                    border: '1px solid #ddd',
                                    overflow: 'auto',
                                    maxHeight: '400px',
                                    fontSize: '12px'
                                }}>
                                    {JSON.stringify(result.results, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                )}
            </form>

            <div style={{ 
                marginTop: '2rem', 
                padding: '1rem', 
                background: '#f8f9fa', 
                borderRadius: '8px',
                fontSize: '14px',
                color: '#666'
            }}>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>How it works:</h4>
                <ol style={{ margin: 0, paddingLeft: '1.5rem' }}>
                    <li>Upload a video file and provide a title</li>
                    <li>The system extracts frames from your video</li>
                    <li>Each frame is analyzed for garbage objects using AI</li>
                    <li>Results are compiled and displayed</li>
                </ol>
            </div>
        </main>
    );
}