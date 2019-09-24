#!/bin/bash
# Install python2.7 first if it is not installed: sudo apt install python2.7
sudo apt install python-pip -yq
sudo apt install git-all
# Install dsub
sudo pip install dsub==0.3.2
sudo pip install --upgrade pyasn1-modules
sudo apt install unzip
# Install Node.js (version: v8.16.0)
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
# Pull project
cd ~
mkdir projects
cd projects
git clone git@github.com:StanfordBioinformatics/wings.git -b wings-dev
# wget https://github.com/StanfordBioinformatics/wings/archive/dev.zip
# unzip dev.zip
# rm dev.zip
## Install frontend dependencies
cd wings-dev/app
sudo npm install cjs-to-es6 -g
sh scripts/server-init.sh
cd js
npm i
npm run build
## Install backend dependencies
cd ../
npm i
sudo npm start
## Use forever to run server as a daemon
# npm install forever -g
# sudo forever start server.js