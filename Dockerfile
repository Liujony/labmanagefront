# Base image
FROM node:14-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN NODE_ENV=development npm install

# Copy the rest of the project files to the working directory
COPY . .

# Build the Vue project
RUN npm run build

# Expose the port that the Vue app is running on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]

