# Use an official Node.js runtime as a parent image
FROM node as frontend

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json files to the container
COPY ./client/package*.json ./client/yarn.lock ./

# Install client dependencies
RUN yarn install --production=false

# Copy the rest of the client application code to the container
COPY ./client ./

# Build the React application
RUN yarn build

# Remove all files except the static generated files (those in the 'dist' folder)
RUN find . -maxdepth 1 -type f ! -path "./dist/*" -delete

# Create a new image based on the "bff-node" project
FROM node

# Set the working directory in the container
WORKDIR /app

# Copy the compiled React build files from the builder stage to the "bff-node" project folder
COPY --from=frontend /app/dist ./src/public

COPY ./bff-node/package*.json ./bff-node/yarn.lock ./

# Install "bff-node" project dependencies (assuming you have a package.json file in "bff-node" folder)
RUN yarn install

COPY ./bff-node ./

# Start the "bff-node" server (modify the startup command as needed)
CMD ["yarn", "start"]