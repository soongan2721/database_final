# This Dockerfile uses a multi-stage build process to create a lightweight production image.
# By separating the build and runtime stages, we can reduce the final image size and only include the necessary files.
# Stage-A
# Pull the Node.js environment, specifying the long-term support (LTS) version based on Alpine Linux
FROM node:lts-alpine
# Set the working directory to /app
WORKDIR /app
# Copy any JSON files in the local root directory that start with "package" to the working directory
COPY package*.json ./
# Run npm install to install the necessary packages
RUN npm install
# Copy all the local files to the working directory
COPY . .
# Build Vue application
RUN npm run build
# Stage-B: 
# Use the NGINX image, we use nginx as our front server
FROM nginx
# Set the working directory to /app
WORKDIR /app
# Copy only the dist/ folder from Stage-A to the NGINX image.This folder contains files after we build Vue application.
COPY --from=0 /app/dist ./dist/
# Overwrite the default NGINX configuration file with our custom configuration
# This is done to ensure that NGINX serves our application correctly with the specific settings we need
COPY ./default.conf /etc/nginx/conf.d/
# Expose port 80 to allow web traffic
EXPOSE 80
# Start NGINX in the foreground
CMD ["nginx", "-g", "daemon off;"]