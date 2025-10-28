FROM node:18-alpine

RUN apk add --no-cache ffmpeg

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

RUN mkdir -p output assets/music public

EXPOSE 3001

ENV NODE_ENV=production
ENV PORT=3001

CMD ["node", "server.js"]