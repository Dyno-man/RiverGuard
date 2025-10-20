# FFmpeg Worker (Docker)

A lightweight Express + FFmpeg service for extracting frames from videos.

Supports:
- GET /frame?url=...&t=5 → extract a frame from a remote video URL
- POST /frame (multipart: file + t) → upload a video file and extract a frame
- GET /health → basic health check

---

## Prerequisites
- Docker Desktop (macOS/Windows) or Docker Engine (Linux)
- Internet connection if fetching remote video URLs

---

## Quick Start

# 1. Build the Docker image
docker build -t ffmpeg-worker:latest .

# 2. Run the container
docker run --name ffmpeg-worker \
-p 8080:8080 \
-e API_KEY=dev123 \
-d ffmpeg-worker:latest

# 3. Check health
curl -H "x-api-key: dev123" http://localhost:8080/health
# Expected: {"ok":true}

# 4. Stop and remove the container
docker rm -f ffmpeg-worker

---

## Endpoints

### 1. GET /health
Simple liveness check.
- Header: x-api-key: <API_KEY>
- Response: {"ok":true}

---

### 2. GET /frame
Extract one frame from a remote video.

Query Parameters:
- url → direct video URL (.mp4, .m3u8, .rtsp)
- t → timestamp in seconds (default 5)

Headers:
- x-api-key: <API_KEY>

Response:
- Content-Type: image/jpeg

Example:
curl -H "x-api-key: dev123" \
"http://localhost:8080/frame?url=https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4&t=5" \
--output frame.jpg

---

### 3. POST /frame
Upload a video file and extract one frame.

Form Fields:
- file=@path/to/video.mp4
- t=timestamp (default 5)

Headers:
- x-api-key: <API_KEY>

Response:
- Content-Type: image/jpeg

Example:
curl -H "x-api-key: dev123" \
-F "file=@/path/to/video.mp4" \
-F "t=5" \
http://localhost:8080/frame \
--output frame.jpg

---

## Environment Variables

API_KEY      → Required if you want to protect your endpoints (example: dev123)
PORT         → Optional. Defaults to 8080 inside the container.

Example run:
docker run -p 8080:8080 -e API_KEY=dev123 ffmpeg-worker

---

## CORS (For local browser access)

If you want to call the worker directly from your local Next.js app (http://localhost:3000),
make sure server.js includes:

import cors from 'cors';
app.use(cors({
origin: 'http://localhost:3000',
methods: ['GET','POST','OPTIONS'],
allowedHeaders: ['Content-Type','x-api-key']
}));
app.options('*', cors());

Rebuild the container after adding this.

---

## Rebuilding the Worker

# After making code changes or installing new dependencies
docker build -t ffmpeg-worker:latest .
docker rm -f ffmpeg-worker
docker run --name ffmpeg-worker -p 8080:8080 -e API_KEY=dev123 -d ffmpeg-worker:latest

# Check logs
docker logs -f ffmpeg-worker

---

## Adding New Dependencies

# Inside ffmpeg-worker folder
npm install <package> --save
# Commit package.json and package-lock.json, then rebuild the Docker image.

---

## Troubleshooting

Cannot connect to Docker daemon  
→ Start Docker Desktop or switch to the correct context:
docker context ls
docker context use desktop-linux

"failed to read Dockerfile"  
→ Run docker build inside the ffmpeg-worker folder.

"pull access denied for ffmpeg-worker"  
→ Rebuild the image with:
docker build -t ffmpeg-worker:latest .

CORS errors in browser  
→ Ensure cors() middleware is in server.js and origin matches your Next app (http://localhost:3000).

401 Unauthorized  
→ Missing or incorrect x-api-key header.

500 Error with ffmpeg logs  
→ Usually an invalid URL, unsupported format, or timestamp (t) beyond video duration.
Check logs:
docker logs -f ffmpeg-worker

---

## Optional: Docker Compose (local multi-service dev)

If you also run your Next.js frontend locally, create docker-compose.yml in your project root:

services:
worker:
build: ./ffmpeg-worker
container_name: ffmpeg-worker
environment:
- API_KEY=dev123
ports:
- "8080:8080"

web:
build: ./web
ports:
- "3000:3000"
environment:
- NEXT_PUBLIC_WORKER_URL=http://localhost:8080
- NEXT_PUBLIC_WORKER_API_KEY=dev123
depends_on:
- worker

Then start both:
docker compose up -d --build

---

## Security Notes
- Do not expose your API_KEY to browsers in production. Use a server-side proxy.
- Always validate input (allow only http/https/rtsp URLs).
- Limit file size and request rate if you open this to the public.

---

## Example Workflow

# Build + run worker
docker build -t ffmpeg-worker .
docker run -p 8080:8080 -e API_KEY=dev123 ffmpeg-worker

# Grab a test frame from a public video
curl -H "x-api-key: dev123" \
"http://localhost:8080/frame?url=https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4&t=5" \
--output frame.jpg
open frame.jpg  # macOS