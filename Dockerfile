# FROM node

# WORKDIR /app
# # Copy package.json and lock file from the app folder
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Stage 2: Create the production image

# COPY . .

# RUN npm run build

# EXPOSE 3000

# CMD [ "npm", "start" ]



## you can modify your Dockerfile to create a more lightweight image:
# # Stage 1: Build the application
FROM node:18 AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Create a production image
FROM node:18-slim AS production

WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Install a simple HTTP server to serve the static files
RUN npm install -g serve

# Expose the application port
EXPOSE 3000

# Serve the built application
CMD ["serve", "-s", "dist"]


