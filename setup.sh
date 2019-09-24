#!/bin/bash
# Install python2.7 first if it is not installed
sudo apt install python2.7 -yq
# Install docker
sudo apt install apt-transport-https ca-certificates curl software-properties-common -yq
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
sudo apt update
apt-cache policy docker-ce
sudo apt install docker-ce -yq
# sudo systemctl status docker
sudo systemctl enable docker
# Build image and run it as a container
sudo docker build -t wings_scgpm .