import express from 'express';
import { spawn } from 'node:child_process';
import multer from 'multer';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

const app = express();
app.use(express.json({ limit: '1mb' }));

import cors from 'cors';

// …after app = express();
app.use(cors({
    origin: 'http://localhost:3000',             // your Next dev origin
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'x-api-key'] // allow custom auth header
}));

// simple api key guard
app.use((req, res, next) => {
    const need = process.env.API_KEY;
    if (!need) return next(); // if you didn't set one, skip
    const got = req.header('x-api-key');
    if (got !== need) return res.status(401).json({ error: 'unauthorized' });
    next();
});

app.get('/health', (_req, res) => res.json({ ok: true }));

function runFFmpegStreaming(args, res) {
    const p = spawn('ffmpeg', args);
    let err = '';

    p.stderr.on('data', (d) => (err += d.toString()));
    p.on('error', (e) => {
        if (!res.headersSent) res.status(500);
        res.end(String(e));
    });
    p.on('close', (code) => {
        if (code !== 0 && !res.headersSent) {
            res.status(500).end(err || `ffmpeg exited ${code}`);
        }
    });

    return p;
}

// GET /frame?url=...&t=5   -> returns image/jpeg
app.get('/frame', async (req, res) => {
    try {
        const url = req.query.url;
        const t = String(req.query.t ?? '5');

        if (!url) return res.status(400).json({ error: 'provide ?url=' });

        const args = [
            '-hide_banner','-loglevel','error',
            '-ss', t, '-i', url,
            '-frames:v','1','-q:v','2',
            '-f','image2pipe','-vcodec','mjpeg','pipe:1'
        ];

        // if it's RTSP, TCP is more reliable:
        if (String(url).startsWith('rtsp://')) {
            args.unshift('-rtsp_transport','tcp');
        }

        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Cache-Control', 'no-store');
        const p = runFFmpegStreaming(args, res);
        p.stdout.pipe(res);
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// POST /frame (multipart: file, optional t)
// returns image/jpeg
const upload = multer({ dest: os.tmpdir(), limits: { fileSize: 100 * 1024 * 1024 } }); // 100MB
app.post('/frame', upload.single('file'), async (req, res) => {
    const t = String(req.body?.t ?? '5');
    if (!req.file) return res.status(400).json({ error: 'attach a file field' });

    const inputPath = req.file.path; // temp file path from multer
    const args = [
        '-hide_banner','-loglevel','error',
        '-ss', t, '-i', inputPath,
        '-frames:v','1','-q:v','2',
        '-f','image2pipe','-vcodec','mjpeg','pipe:1'
    ];

    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'no-store');
    const p = runFFmpegStreaming(args, res);
    p.stdout.pipe(res);

    p.on('close', async () => {
        // cleanup temp file
        try { await fs.rm(inputPath, { force: true }); } catch {}
    });
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`ffmpeg worker listening on :${port}`));