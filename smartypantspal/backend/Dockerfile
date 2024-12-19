# Use the Node.js version 18 environment
FROM node:18
# Set the working directory to /usr/src/app
WORKDIR /usr/src/app
# Install python 
RUN apt-get update && \
    apt-get install -y \
    python3.11 \
    python3.11-dev \
    python3.11-venv \
    python3-pip && \
    ln -s /usr/bin/python3.11 /usr/bin/python && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* 
RUN apt-get update && \
    apt-get install nano -y 
# Create python envirments
RUN python -m venv /usr/src/app/venv
# Install python packages and avtive virtual envirments
COPY requirements.txt ./
RUN /usr/src/app/venv/bin/pip install --no-cache-dir -r requirements.txt
# Copy any JSON files in the local root directory that start with "package" to the working directory
COPY package*.json ./
# Run npm install to install the necessary packages
RUN npm install
# Install nodemon globally to automatically restart the node application when file changes in the directory are detected
RUN npm install -g nodemon
# Copy all the local files to the working directory
COPY . .
# Expose port 8888 to allow external access to this port
EXPOSE 8888
# Start the application with nodemon, specifying the entry point file
CMD ["nodemon", "./bin/www"]`