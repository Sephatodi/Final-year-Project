FROM node:18-alpine

WORKDIR /app

# Install curl for healthchecks
RUN apk add --no-cache curl

# Copy package files first for layer caching
COPY Backend/package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy source
COPY Backend/ ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 5000

ENV NODE_ENV=production

CMD ["node", "server.js"]