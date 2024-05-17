# base image for our Docker image
FROM node:16

# sets the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the project dependencies specified in package.json
RUN npm install

# Copy all the remaining application files to the working directory
COPY . .

# Inform Docker that the container will listen on port 8073
EXPOSE 8078

# Define the command to run the application when the container starts
CMD ["npm", "start"]
