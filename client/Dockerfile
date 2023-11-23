# Use a Node.js base image
FROM node:19

# Set working directory
WORKDIR /react

# Copy package.json and package-lock.json
COPY package.json ./

# Copy yarn.lock
# COPY yarn.lock ./

# Install dependencies
RUN yarn

# Copy the rest of the client code
COPY . .

# Build the React app
RUN yarn run build

# Expose the port React app runs on (default: 3000)
EXPOSE 3000

# Command to start the React app
CMD [ "yarn", "docker" ]
