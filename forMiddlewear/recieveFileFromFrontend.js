// middleware/server.js
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import os from 'node:os';
import fs from 'node:fs/promises';

const app = express();
app.use(cors({
    origin: 'http://localhost:3000', // your Next app
    methods: ['POST','OPTIONS'],
    allowedHeaders: ['Content-Type']
}));
app.options('*', cors());

const upload = multer({ dest: os.tmpdir() });

app.post('/ingest-file', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ ok: false, error: 'No file received' });
    }

    // Multer puts file metadata in req.file
    const { originalname, mimetype, size, path } = req.file;

    // Optional: delete the temp file after confirming receipt
    await fs.rm(path, { force: true });

    return res.json({
        ok: true,
        message: 'File received successfully!',
        file: {
            name: originalname,
            type: mimetype,
            size_bytes: size,
            size_kb: Math.round(size / 1024)
        }
    });
});

app.listen(4000, () => console.log('Middleware listening on port 4000'));