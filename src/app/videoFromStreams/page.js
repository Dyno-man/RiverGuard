'use client';
import { useState } from 'react';

const WORKER = process.env.NEXT_PUBLIC_WORKER_URL || 'http://192.155.92.114:80';
const KEY    = process.env.NEXT_PUBLIC_WORKER_API_KEY || '';

export default function Home() {
    const [mode, setMode] = useState('url'); // 'url' | 'file'
    const [url, setUrl]   = useState('');
    const [file, setFile] = useState(null);
    const [t, setT]       = useState(5);
    const [busy, setBusy] = useState(false);
    const [img, setImg]   = useState(null);
    const [msg, setMsg]   = useState('');

    async function onExtract(e) {
        e.preventDefault();
        setBusy(true); setMsg('working…'); setImg(null);

        try {
            let res;
            if (mode === 'file') {
                if (!file) { setMsg('please choose a video file'); return; }
                const fd = new FormData();
                fd.append('file', file);
                fd.append('t', String(t));
                res = await fetch(`${WORKER}/frame`, {
                    method: 'POST',
                    headers: { 'x-api-key': KEY },      // include dev key
                    body: fd
                });
            } else {
                if (!url) { setMsg('please enter a direct .mp4 url'); return; }
                const qs = new URLSearchParams({ url, t: String(t) }).toString();
                res = await fetch(`${WORKER}/frame?${qs}`, {
                    headers: { 'x-api-key': KEY }       // include dev key
                });
            }

            if (!res.ok) {
                const err = await res.text();
                setMsg(`error: ${err}`);
                return;
            }

            const blob = await res.blob();
            setImg(URL.createObjectURL(blob));
            setMsg('done');
        } catch (err) {
            setMsg(`error: ${String(err)}`);
        } finally {
            setBusy(false);
        }
    }

    return (
        <main style={{ maxWidth: 560, margin: '2rem auto', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif' }}>
            <h1 style={{ marginBottom: 12 }}>Grab a frame (local, API key, no proxy)</h1>

            <form onSubmit={onExtract} style={{ display: 'grid', gap: 12 }}>
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
                        style={{ padding: 8, border: '1px solid #ddd', borderRadius: 8 }}
                    />
                ) : (
                    <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                )}

                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    Timestamp (seconds):
                    <input
                        type="number" min="0" step="0.001" value={t}
                        onChange={(e) => setT(e.target.value)}
                        style={{ width: 120, padding: 6, border: '1px solid #ddd', borderRadius: 8 }}
                    />
                </label>

                <button type="submit" disabled={busy}
                        style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #444',
                            background: busy ? '#eee' : '#111', color: busy ? '#666' : '#fff',
                            cursor: busy ? 'not-allowed' : 'pointer' }}>
                    {busy ? 'Working…' : 'Extract frame'}
                </button>

                <div>{msg}</div>

                {img && (
                    <div style={{ display: 'grid', gap: 8 }}>
                        <img src={img} alt="extracted frame" style={{ maxWidth: '100%', border: '1px solid #eee', borderRadius: 8 }} />
                        <a href={img} download="frame.jpg">download frame.jpg</a>
                    </div>
                )}
            </form>

            <hr style={{ margin: '24px 0' }} />
            <details>
                <summary>Need a test URL?</summary>
                <div style={{ marginTop: 8 }}>
                    https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4
                </div>
            </details>
        </main>
    );
}