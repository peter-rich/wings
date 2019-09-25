## Not working yet ...
# Dockerfile References: https://docs.docker.com/engine/reference/builder/
# FROM ubuntu:18.04
FROM node:8.16-alpine

# Add Maintainer Info
LABEL maintainer="Lek Tin <lektin@stanford.com>"

# Install python2.7 first
USER root
# RUN apt-get update
# RUN apt-get update -y --fix-missing
RUN apk add --update python
RUN apk add --update python-dev
RUN apk add --update py-pip
RUN apk add --update build-base
# Install dsub
RUN pip install dsub==0.3.2
RUN pip install --upgrade pyasn1-modules

# Set the Current Working Directory inside the container, it affects commands that come later
WORKDIR /app
# Pull project

# Copy the source from the current directory to the Working Directory inside the container
COPY ./app .

# Build app
## Install frontend dependencies
RUN npm install cjs-to-es6 -g
RUN sh scripts/server-init.sh
WORKDIR /app/js
RUN rm -rf node_modules/
RUN npm install
RUN npm run build
## Install backend dependencies
WORKDIR /app
RUN rm -rf node_modules/
RUN npm install

# Expose port 8081 to the outside world
EXPOSE 8081

# Command to run the executable
CMD ["npm", "start"]