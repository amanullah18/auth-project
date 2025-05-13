# Step 1: Use an official Node.js image as a base image
FROM node:18-alpine

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application files
COPY . .

# Step 6: Expose the port on which your app will run
EXPOSE 3000

# Step 7: Start the application
CMD ["npm", "run", "start:dev"]
