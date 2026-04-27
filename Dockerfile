# --- Base Stage ---
FROM node:20-alpine AS base
WORKDIR /app
ENV TZ=Asia/Phnom_Penh
RUN apk add --no-cache tzdata
COPY package*.json ./

# --- Development Stage ---
FROM base AS development
ENV NODE_ENV=development
# Install ALL dependencies (including dev)
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# --- Production Stage ---
FROM base AS production
ENV NODE_ENV=production
# Install ONLY production dependencies
RUN npm ci --omit=dev
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]