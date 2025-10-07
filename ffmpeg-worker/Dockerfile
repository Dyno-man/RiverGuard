FROM node:20-slim

# install ffmpeg and certs (https streams need certs)
RUN apt-get update && apt-get install -y ffmpeg ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .

ENV NODE_ENV=production
EXPOSE 8080
CMD ["node","server.js"]