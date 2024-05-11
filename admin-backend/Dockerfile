FROM node:20-buster


WORKDIR /usr/src/app

# Copy everything
COPY . .

# Install dependencies
RUN npm install && npm rebuild

# Expose the port the app runs on
EXPOSE 8071

# Command to run your app
CMD ["npm", "start"]
