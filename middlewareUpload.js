// middlewareUpload.js
import express from 'express'
import cors from 'cors'
import multer from 'multer'
import FormData from 'form-data'
import fetch from 'node-fetch'

const app = express()

// Allow your Vercel site (replace with your domain in prod)
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
// --- replace your existing POST handler with this one ---
let reqCounter = 0
function nowMs() { return Date.now() }
app.post('/api/fileUpload', upload.any(), async (req, res) => {
    const rid = ++reqCounter
    const t0 = nowMs()
    const fastapiUrl = process.env.FASTAPI_URL || 'http://127.0.0.1:8000/api/analyze-video'
  
    try {
      console.log(`[RID ${rid}] ↓ Incoming /api/fileUpload`)
      console.log(`[RID ${rid}] Origin: ${req.headers.origin || 'n/a'}`)
      console.log(`[RID ${rid}] IP: ${req.ip}  UA: ${req.headers['user-agent'] || 'n/a'}`)
      console.log(`[RID ${rid}] Body keys:`, Object.keys(req.body || {}))
      console.log(`[RID ${rid}] Files:`,
        (req.files || []).map(f => ({
          field: f.fieldname,
          name: f.originalname,
          size: f.size,
          type: f.mimetype
        }))
      )
      console.log(`[RID ${rid}] FASTAPI_URL: ${fastapiUrl}`)
  
      // pick first file_* as the video to forward
      const file = (req.files || []).find(f => f.fieldname.startsWith('file_'))
      if (!file) {
        console.warn(`[RID ${rid}] No file_* found`)
        return res.status(400).json({ success: false, error: 'No file provided' })
      }
  
      // derive userId if not provided
      const userId =
        typeof req.body.userId === 'string' && req.body.userId.trim()
          ? req.body.userId.trim()
          : (file.originalname || 'web-upload').replace(/\W+/g, '-').slice(0, 50)
  
      console.log(`[RID ${rid}] Final userId: ${userId}`)
  
      // build upstream multipart form
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
        upstreamResp = await fetch(fastapiUrl, {
          method: 'POST',
          headers: form.getHeaders(),
          body: form
        })
      } catch (err) {
        console.error(`[RID ${rid}] Upstream fetch error:`, err?.message || err)
        return res.status(502).json({ success: false, error: 'Upstream connection failed' })
      }
  
      const upstreamBodyText = await upstreamResp.text()
      console.log(`[RID ${rid}] ← FastAPI status=${upstreamResp.status} in ${nowMs() - upstreamT0}ms`)
      if (!upstreamResp.ok) {
        console.error(`[RID ${rid}] Upstream error body:`, upstreamBodyText?.slice(0, 2000))
        return res
          .status(upstreamResp.status)
          .type(upstreamResp.headers.get('content-type') || 'text/plain')
          .send(upstreamBodyText)
      }
  
      // success: proxy body through
      console.log(`[RID ${rid}] ✅ Success in ${nowMs() - t0}ms`)
      return res
        .status(upstreamResp.status)
        .type(upstreamResp.headers.get('content-type') || 'application/json')
        .send(upstreamBodyText)
  
    } catch (err) {
      console.error(`[RID ${rid}] Handler error:`, err?.stack || err?.message || err)
      return res.status(500).json({ success: false, error: 'Upload forwarding failed' })
    }
  })