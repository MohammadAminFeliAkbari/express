# Use Node.js LTS as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port your Express app runs on
EXPOSE 3000

# Command to start the app
CMD ["node", "index.js"]
