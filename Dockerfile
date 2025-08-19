# Multi-stage build for React + Vite application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install all dependencies (including dev dependencies for build)
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Production stage with Node.js
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install only production dependencies
RUN yarn install --frozen-lockfile --production

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Copy server.js file
COPY server.js ./

# Copy any additional static assets that might be needed
COPY --from=builder /app/public ./public

# Expose port (Railway will override this with PORT env var)
EXPOSE 3000

# Start the application
CMD ["yarn", "start"]
