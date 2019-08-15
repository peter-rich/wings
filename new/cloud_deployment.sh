#!/bin/bash
# Ubuntu 18.04 LTS Minimal - amd64 bionic minimal image built on 2019-07-23
# Access scopes: Allow full access to all Cloud APIs
# Node version: v8.16.0
cd ~
mkdir projects
cd projects
sudo apt install virtualenv
wget https://github.com/DataBiosphere/dsub/archive/master.zip
unzip master.zip
rm master.zip
cd dsub-master
virtualenv --python=python2.7 dsub_libs
source dsub_libs/bin/activate
pip install dsub
sudo apt install unzip
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
cd ~/projects/wings-lek
wget https://github.com/StanfordBioinformatics/wings/archive/lek.zip
unzip lek.zip
rm lek.zip
cd wing-lek/new/js
npm i
npm run build
cd ../
npm i
npm run start
