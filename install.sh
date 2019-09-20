# !/bin/bash
#!/bin/bash
# Ubuntu 18.04 LTS Minimal - amd64 bionic minimal image built on 2019-07-23
# Access scopes: Allow full access to all Cloud APIs
# Node version: v8.16.0
cd ~
mkdir projects
cd projects
mkdir wings
cd wings
# Install python2.7 first if it is not installed: sudo apt install python2.7
sudo apt install python-pip
pip install dsub
sudo apt install unzip
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
cd ~/projects/wings
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
