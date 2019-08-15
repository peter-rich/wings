#!/bin/bash
# Ubuntu 18.04 LTS Minimal - amd64 bionic minimal image built on 2019-07-23
# Access scopes: Allow full access to all Cloud APIs
# Node version: v8.16.0
cd ~
mkdir projects
cd projects
# sudo apt install virtualenv
# wget https://github.com/DataBiosphere/dsub/archive/master.zip
# unzip master.zip
# rm master.zip
# cd dsub-master
# virtualenv --python=python2.7 dsub_libs
# source dsub_libs/bin/activate
# Install python2.7 first if it is not installed: sudo apt install python2.7
apt install python-pip
pip install dsub
sudo apt install unzip
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
cd ~/projects/wings-lek
wget https://github.com/StanfordBioinformatics/wings/archive/lek.zip
unzip lek.zip
rm lek.zip
npm install forever -g
cd new/js
npm i
npm run build
cd ../
npm i
sudo forever start server.js
