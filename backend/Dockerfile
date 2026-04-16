# Build Stage
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install --production

# Production Stage
FROM node:18-alpine

WORKDIR /app

# Copy built node_modules and source
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Expose port (Google Cloud Run / Hetzner often use 8080 or allow config)
ENV PORT=5000
EXPOSE 5000

# Start server
CMD ["node", "server.js"]
