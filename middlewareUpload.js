// middlewareUpload.js (CommonJS, minimal, robust)
import express from 'express'
import cors from 'cors'
import multer from 'multer'
import axios from 'axios'
import FormData from 'form-data'

const app = express()


// Memory storage (no temp files)
const upload = multer({ storage: multer.memoryStorage() })

let reqCounter = 0
function nowMs() { return Date.now() }

app.post('/api/fileUpload', upload.any(), async (req, res) => {
  const rid = ++reqCounter
  const t0 = nowMs()
  const FASTAPI_URL = process.env.FASTAPI_URL || 'http://127.0.0.1:8000/api/analyze-video'

  try {
    console.log(`[RID ${rid}] ↓ Incoming /api/fileUpload`)
    console.log(`[RID ${rid}] Origin: ${req.headers.origin || 'n/a'}`)
    console.log(`[RID ${rid}] Files:`, (req.files || []).map(f => ({
      field: f.fieldname, name: f.originalname, size: f.size, type: f.mimetype
    })))
    console.log(`[RID ${rid}] Body keys:`, Object.keys(req.body || {}))
    console.log(`[RID ${rid}] FASTAPI_URL: ${FASTAPI_URL}`)

    const file = (req.files || []).find(f => f.fieldname.startsWith('file_'))
    if (!file) return res.status(400).json({ success: false, error: 'No file provided' })

    const userId = (typeof req.body.userId === 'string' && req.body.userId.trim())
      ? req.body.userId.trim()
      : (file.originalname || 'web-upload').replace(/\W+/g, '-').slice(0, 50)

    console.log(`[RID ${rid}] Final userId: ${userId}`)

    const form = new FormData()
    form.append('video_file', file.buffer, {
      filename: file.originalname || 'upload.mp4',
      contentType: file.mimetype || 'application/octet-stream'
    })
    form.append('userId', userId)

    console.log(`[RID ${rid}] → Forwarding to FastAPI`)
    const upstreamT0 = nowMs()
    let upstreamResp
    try {
      upstreamResp = await axios.post(FASTAPI_URL, form, {
        headers: form.getHeaders(),
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
        validateStatus: () => true
      })
    } catch (err) {
      console.error(`[RID ${rid}] Upstream connection error:`, err.message)
      return res.status(502).json({ success: false, error: 'Upstream connection failed' })
    }

    console.log(`[RID ${rid}] ← FastAPI status=${upstreamResp.status} in ${nowMs() - upstreamT0}ms`)
    if (upstreamResp.status < 200 || upstreamResp.status >= 300) {
      const errBody = typeof upstreamResp.data === 'string'
        ? upstreamResp.data
        : JSON.stringify(upstreamResp.data)
      console.error(`[RID ${rid}] Upstream error body:`, errBody.slice(0, 2000))
      return res.status(upstreamResp.status).type('application/json').send(errBody)
    }

    console.log(`[RID ${rid}] ✅ Success in ${nowMs() - t0}ms`)
    return res.status(200).json(upstreamResp.data)
  } catch (err) {
    console.error(`[RID ${rid}] Handler error:`, err.stack || err.message || err)
    return res.status(500).json({ success: false, error: 'Upload forwarding failed' })
  }
})

const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`Upload middleware listening on :${port}`)
})