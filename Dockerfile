# Use Node 20 as base
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (All needed for building)
RUN npm install

# Copy all files
COPY . .

# Build the frontend
RUN npm run build

# Expose port
EXPOSE 3001

# Make startup script executable
RUN chmod +x start.sh

# Start the services
CMD ["./start.sh"]
