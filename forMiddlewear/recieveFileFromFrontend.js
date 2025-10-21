import express from 'express';
import cors from 'cors';
import multer from 'multer';
import os from 'node:os';
import fs from 'node:fs/promises';

const app = express();

// loosen origin for testing; set to your real origin later
app.use(cors({ origin: true, methods: ['POST','OPTIONS'], allowedHeaders: ['Content-Type'] }));

// handle preflight only for this route (not '*')
app.options('/ingest-file', cors());

const upload = multer({ dest: os.tmpdir() });

app.post('/ingest-file', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ ok: false, error: 'No file received' });

  const { originalname, mimetype, size, path } = req.file;
  await fs.rm(path, { force: true }); // optional cleanup

  return res.json({
    ok: true,
    message: 'File received successfully!',
    file: { name: originalname, type: mimetype, size_bytes: size, size_kb: Math.round(size / 1024) }
  });
});

app.listen(4000, () => console.log('Middleware listening on port 4000'));

app.get('/ping', (req, res) => res.json({ ok: true }));
