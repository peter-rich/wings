#!/bin/bash
# Install python2.7 first if it is not installed
sudo apt install python2.7
sudo apt install git-all
# Install docker
sudo apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
sudo apt update
apt-cache policy docker-ce
sudo apt install docker-ce
sudo systemctl status docker
# Pull project
cd ~
mkdir projects
cd projects
git clone git@github.com:StanfordBioinformatics/wings.git -b wings-dev
cd wings-dev
# Build docker image
docker build .