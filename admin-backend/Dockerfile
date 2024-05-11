# Using a specific version of node
FROM node:16

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy only package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies in the container
RUN npm install

# Copy the rest of your app's source code from your host to your Docker image
COPY . .

# Expose the port the app runs on
EXPOSE 8071

# Command to run your app
CMD ["npm", "start"]
