# Use a Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json
COPY package.json ./

# Copy yarn.lock
COPY yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the server code
COPY . .

# Expose the port your Node.js server runs on (default: 5000)
EXPOSE 3001

# Command to start the Node.js server
CMD [ "yarn", "dev" ]
