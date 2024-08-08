FROM node:alpine as build

WORKDIR /app
# Copy package.json and lock file from the app folder
COPY package*.json ./

# Install dependencies
RUN npm install

# Stage 2: Create the production image
FROM node:alpine 

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "build/index.js"]


