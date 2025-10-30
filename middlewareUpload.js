// middlewareUpload.js
import express from 'express'
import cors from 'cors'
import multer from 'multer'
import FormData from 'form-data'
import fetch from 'node-fetch'

const app = express()

// Allow your Vercel site (replace with your domain in prod)
app.use(cors({
    origin: ['http://localhost:3000', 'https://your-vercel-app.vercel.app'],
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }))
// Keep memory only (no temp files)
const upload = multer({ storage: multer.memoryStorage() })

/**
 * POST /api/fileUpload
 * Expects:
 *   - file_<n>: file(s) from the browser (we'll forward the first one as video_file)
 *   - url_<n>: optional URLs (ignored by FastAPI right now)
 *   - duration: optional (ignored by FastAPI right now)
 *   - userId: optional; if not provided, we derive one from filename
 */
app.post('/api/fileUpload', upload.any(), async (req, res) => {
  try {
    // Pick the first file_* entry to forward
    const file = (req.files || []).find(f => f.fieldname.startsWith('file_'))
    if (!file) {
      return res.status(400).json({ success: false, error: 'No file provided' })
    }

    const userId =
      typeof req.body.userId === 'string' && req.body.userId.trim()
        ? req.body.userId.trim()
        : (file.originalname || 'anon').replace(/\W+/g, '-').slice(0, 50)

    // Build multipart body for FastAPI
    const form = new FormData()
    // FastAPI expects these exact field names:
    //   video_file (File(...)), userId (Form(...))
    form.append('video_file', file.buffer, {
      filename: file.originalname || 'upload.mp4',
      contentType: file.mimetype || 'application/octet-stream',
    })
    form.append('userId', userId)

    // Forward to your FastAPI service
    // If Express is on the same host (outside Docker), use http://127.0.0.1:8000
    // If Express is in a Docker container on the same user-defined network, use the service/container name, e.g. http://api-server:8000
    const FASTAPI_URL = process.env.FASTAPI_URL || 'http://127.0.0.1:8000/api/analyze-video'

    const fastapiResp = await fetch(FASTAPI_URL, {
      method: 'POST',
      headers: form.getHeaders(),
      body: form,
    })

    // Pass FastAPI response back to the browser
    const text = await fastapiResp.text()
    res.status(fastapiResp.status).type(fastapiResp.headers.get('content-type') || 'application/json').send(text)
  } catch (err) {
    console.error('Upload proxy error:', err)
    res.status(500).json({ success: false, error: 'Upload forwarding failed' })
  }
})

const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`Upload middleware listening on :${port}`)
})