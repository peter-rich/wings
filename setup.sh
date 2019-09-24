#!/bin/bash
# Install python2.7 first if it is not installed
sudo apt install python2.7
# Install docker
sudo apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
sudo apt update
apt-cache policy docker-ce
sudo apt install docker-ce
sudo systemctl status docker
# Build image and run it as a container
docker build -t wings_scgpm .
docker run --rm -d -p <PORT_ON_HOST>:8081 --name wings_web wings_scgpm