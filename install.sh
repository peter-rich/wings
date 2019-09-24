# !/bin/bash
#!/bin/bash
# Ubuntu 18.04 LTS Minimal - amd64 bionic minimal image built on 2019-07-23
# Access scopes: Allow full access to all Cloud APIs
# Node version: v8.16.0
# Install python2.7 first if it is not installed: sudo apt install python2.7
sudo apt install python-pip -yq
# Install dsub
sudo pip install dsub==0.3.2
sudo pip install --upgrade pyasn1-modules
sudo apt install unzip
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
# Install project
cd ~
mkdir projects
cd projects
wget https://github.com/StanfordBioinformatics/wings/archive/dev.zip
unzip dev.zip
rm dev.zip
## Install frontend dependencies
cd wings-dev/new
sudo npm install cjs-to-es6 -g
sh scripts/server-init.sh
cd js
npm i
npm run build
## Install backend dependencies
cd ../
npm i
npm start
## Use forever to run server as a daemon
# npm install forever -g
# sudo forever start server.js